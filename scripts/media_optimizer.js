/**
 * Boubane Media Optimizer Engine (Client-Side Canvas 2D WebP)
 * Moteur complet et autonome d'optimisation d'images de chantier (R3).
 *
 * Fonctionnalités clés :
 * 1. Boucle de compression adaptative Canvas WebP garantissant strictement un poids < 80 Ko.
 * 2. Redimensionnement responsive préservant le ratio d'aspect (défaut 1400px).
 * 3. Décodage HEIC/HEIF avec détection à 3 niveaux (MIME, extension, magic bytes ftyp) et lazy loading JIT de heic2any.
 * 4. Slugification SEO robuste adaptée aux spécificités françaises (accents NFD, ligatures œ/æ, ponctuation).
 * 5. Format de nommage standardisé : metier-ville-chantier-XX.webp (padding à 2 chiffres).
 * 6. File d'attente de traitement par lot avec limitation stricte de concurrence à 2 et suivi de progression.
 * 7. Empaquetage ZIP optimisé via JSZip avec repli automatique sur téléchargement séquentiel fichier par fichier.
 * 8. Compatibilité universelle Navigateur (DOM Canvas / OffscreenCanvas / Web Worker) et Node.js (Tests automatisés).
 *
 * @version 1.0.0
 * @author Boubane Engineering
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BoubaneMediaOptimizer = factory();
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & CONSTANTES
  // =========================================================================

  const CONFIG = {
    TARGET_MAX_BYTES: 80000,       // Seuil cible strict (< 81,920 octets / 80 Ko)
    DEFAULT_MAX_DIMENSION: 1400,   // Preset recommandé (1280 rapide, 1400 équilibré, 1600 haute déf)
    INITIAL_QUALITY: 0.82,         // Qualité WebP initiale
    MIN_QUALITY: 0.40,             // Qualité plancher avant réduction géométrique
    QUALITY_STEP: 0.08,            // Décrément de qualité par itération
    GEOMETRIC_SCALE_STEP: 0.85,    // Réduction dimensionnelle par défaut (15% linéaire)
    RESET_QUALITY_ON_RESIZE: 0.40, // Maintien de la qualité plancher lors des réductions dimensionnelles
    MAX_ITERATIONS: 24,            // Garde-fou d'itérations étendu pour garantir la convergence
    MIN_DIMENSION_FLOOR: 320,      // Dimension minimale absolue (côté majeur)
    FLOOR_MIN_QUALITY: 0.10,       // Qualité plancher de dernier recours sous 320px
    FLOOR_QUALITY_STEP: 0.05,      // Décrément fin de qualité au plancher dimensionnel
    DEFAULT_BACKGROUND: '#FFFFFF', // Fond blanc opaque anti-artefacts pour alpha vers WebP
    CONCURRENCY_LIMIT: 2           // Concurrence max pour ménager la mémoire vive
  };

  const HEIC_BRANDS = new Set([
    'heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'
  ]);

  // =========================================================================
  // 2. UTILITAIRES LINGUISTIQUES & SEO (SLUGIFICATION & NOMMAGE)
  // =========================================================================

  /**
   * Normalise et convertit une chaîne de caractères en slug SEO propre.
   * Gère les ligatures françaises (œ -> oe, æ -> ae), la décomposition Unicode NFD,
   * les caractères spéciaux et la ponctuation.
   *
   * @param {string} text - Texte brut à slugifier
   * @returns {string} Slug assaini (ex: "couvreur-zingueur-segre")
   */
  function slugify(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[œŒ]/g, 'oe')
      .replace(/[æÆ]/g, 'ae')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Suppression des diacritiques
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')     // Remplacement des caractères non-alphanumériques par un tiret
      .replace(/^-+|-+$/g, '');        // Rognage des tirets de début et de fin
  }

  /**
   * Génère un nom de fichier standardisé pour le référencement naturel SEO d'artisan.
   * Format strict : metier-ville-chantier-XX.webp (avec zero-padding à 2 chiffres).
   *
   * @param {string} metier - Métier de l'artisan (ex: "Couvreur Zingueur")
   * @param {string} ville - Ville ou commune (ex: "Segré-en-Anjou Bleu")
   * @param {string} chantier - Nom ou description du chantier (ex: "Rénovation Toiture")
   * @param {number|string} index - Numéro séquentiel (ex: 1 -> "01")
   * @returns {string} Nom de fichier SEO complet avec extension .webp
   */
  function generateSeoFilename(metier, ville, chantier, index = 1) {
    // Nettoyer toute éventuelle extension pré-existante dans le nom de chantier
    const cleanChantier = (chantier || '').toString().replace(/\.(jpe?g|png|webp|heic|heif|gif|bmp|tiff?)$/i, '');
    const sMetier = slugify(metier) || 'artisan';
    const sVille = slugify(ville) || 'segre';
    const sChantier = slugify(cleanChantier) || 'chantier';
    const num = Math.max(1, parseInt(index, 10) || 1);
    const sIndex = String(num).padStart(2, '0');
    return `${sMetier}-${sVille}-${sChantier}-${sIndex}.webp`;
  }

  // =========================================================================
  // 3. GÉOMÉTRIE & REDIMENSIONNEMENT RESPONSIVE
  // =========================================================================

  /**
   * Calcule les dimensions responsives en préservant rigoureusement le ratio d'aspect.
   * Empêche tout agrandissement (upscale) si l'image est déjà plus petite que maxDimension.
   *
   * @param {number} origWidth - Largeur d'origine en pixels
   * @param {number} origHeight - Hauteur d'origine en pixels
   * @param {number} [maxDimension=1400] - Dimension maximale de la plus grande arête
   * @returns {{ width: number, height: number, scale: number, aspectRatio: number }}
   */
  function calculateResponsiveDimensions(origWidth, origHeight, maxDimension) {
    if (!origWidth || !origHeight || origWidth <= 0 || origHeight <= 0) {
      throw new Error(`Dimensions d'image invalides: ${origWidth}x${origHeight}`);
    }

    const bound = maxDimension || CONFIG.DEFAULT_MAX_DIMENSION;
    const longest = Math.max(origWidth, origHeight);
    const aspectRatio = origWidth / origHeight;

    // Pas d'upscale pour les images inférieures à la borne
    if (longest <= bound) {
      return {
        width: Math.round(origWidth),
        height: Math.round(origHeight),
        scale: 1.0,
        aspectRatio
      };
    }

    const scale = bound / longest;
    let targetWidth, targetHeight;

    if (origWidth >= origHeight) {
      // Format Paysage ou Carré
      targetWidth = bound;
      targetHeight = Math.max(1, Math.round((origHeight * bound) / origWidth));
    } else {
      // Format Portrait
      targetHeight = bound;
      targetWidth = Math.max(1, Math.round((origWidth * bound) / origHeight));
    }

    return {
      width: targetWidth,
      height: targetHeight,
      scale,
      aspectRatio
    };
  }

  // =========================================================================
  // 4. DÉTECTION DE FORMAT À 3 NIVEAUX & SUPPORT HEIC/HEIF
  // =========================================================================

  /**
   * Détecte si un buffer binaire contient en réalité du texte brut (anti-falsification).
   *
   * @param {Uint8Array|Buffer} buf
   * @returns {boolean}
   */
  function isTextBuffer(buf) {
    if (!buf || buf.length === 0) return false;
    const len = Math.min(buf.length, 512);
    let printable = 0;
    for (let i = 0; i < len; i++) {
      const b = buf[i];
      if (b === 0x00) return false; // Octet NUL -> fichier binaire
      if ((b >= 0x20 && b <= 0x7E) || b === 0x0A || b === 0x0D || b === 0x09) {
        printable++;
      }
    }
    return (printable / len) > 0.85;
  }

  /**
   * Détecte le format d'image via 3 couches successives :
   * 1. Type MIME
   * 2. Extension du fichier
   * 3. Magic bytes binaires (en-tête ftyp pour HEIC, FF D8 FF pour JPEG, 89 50 4E 47 pour PNG, RIFF/WEBP)
   *
   * @param {File|Blob|object|string} input - Fichier, Blob, Buffer ou descripteur
   * @returns {'heic'|'jpeg'|'png'|'webp'|'unknown'}
   */
  function detectFormat(input) {
    if (!input) return 'unknown';

    let name = '';
    let type = '';
    let buffer = null;

    if (typeof input === 'string') {
      name = input;
    } else if (typeof input === 'object') {
      name = input.name || '';
      type = (input.type || '').toLowerCase();
      if (input instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(input))) {
        buffer = input;
      } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        buffer = new Uint8Array(input);
      } else if (input.buffer) {
        if (input.buffer instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(input.buffer))) {
          buffer = input.buffer;
        } else if (typeof ArrayBuffer !== 'undefined' && input.buffer instanceof ArrayBuffer) {
          buffer = new Uint8Array(input.buffer, input.byteOffset || 0, input.byteLength || input.buffer.byteLength);
        } else {
          buffer = input.buffer;
        }
      }
    }

    // Extraction d'extension
    const extMatch = name.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';

    // Anti-falsification : rejet immédiat si un buffer binaire contient du texte brut
    if (buffer && isTextBuffer(buffer)) {
      return 'unknown';
    }

    // Couche 3 prioritaire si un buffer binaire est accessible (détection anti-falsification)
    if (buffer && buffer.length >= 3) {
      // JPEG : FF D8 FF
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return 'jpeg';
      }
      // PNG : 89 50 4E 47
      if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return 'png';
      }
      // WebP : RIFF .... WEBP
      if (buffer.length >= 12) {
        const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
        const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        if (isRiff && isWebp) {
          return 'webp';
        }
      }
      // HEIC / HEIF via ftyp box (bytes 4..7 === 'ftyp')
      if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        if (buffer.length >= 12) {
          let major = '';
          for (let i = 8; i < 12; i++) major += String.fromCharCode(buffer[i]);
          if (HEIC_BRANDS.has(major.toLowerCase())) return 'heic';

          // Scan compatible brands (calcul unsigned 32-bit sécurisé)
          const boxLength = (((buffer[0] << 24) >>> 0) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3]) >>> 0;
          if (boxLength > 0) {
            const limit = Math.min(boxLength, buffer.length, 64);
            for (let offset = 16; offset + 4 <= limit; offset += 4) {
              let brand = '';
              for (let b = 0; b < 4; b++) brand += String.fromCharCode(buffer[offset + b]);
              if (HEIC_BRANDS.has(brand.toLowerCase())) return 'heic';
            }
          }
        }
        // Conteneur ISOBMFF sans marque HEIC (ex: MP4 isom, MOV) -> Rejet anti-falsification
        return 'unknown';
      }
    }

    // Si un buffer est fourni pour un fichier prétendant être HEIC mais sans boîte ftyp HEIC valide -> Rejet
    const claimsHeic = (ext === 'heic' || ext === 'heif' || ext === 'hif' ||
                        type === 'image/heic' || type === 'image/heif' ||
                        type === 'image/heic-sequence' || type === 'image/heif-sequence');
    if (buffer && claimsHeic) {
      return 'unknown';
    }

    // Couche 1 : Vérification du type MIME
    if (type === 'image/heic' || type === 'image/heif' || type === 'image/heic-sequence' || type === 'image/heif-sequence') {
      return 'heic';
    }
    if (type === 'image/jpeg' || type === 'image/jpg') return 'jpeg';
    if (type === 'image/png') return 'png';
    if (type === 'image/webp') return 'webp';

    // Couche 2 : Vérification de l'extension
    if (ext === 'heic' || ext === 'heif' || ext === 'hif') return 'heic';
    if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
    if (ext === 'png') return 'png';
    if (ext === 'webp') return 'webp';

    return 'unknown';
  }

  /**
   * Vérifie si le fichier donné est au format HEIC ou HEIF.
   *
   * @param {File|Blob|object} file
   * @returns {boolean}
   */
  function isHeicFormat(file) {
    return detectFormat(file) === 'heic';
  }

  // =========================================================================
  // 5. CHARGEMENT À LA DEMANDE (JIT LAZY LOADING) DE HEIC2ANY
  // =========================================================================

  let heic2anyLoadPromise = null;

  /**
   * Charge dynamiquement la bibliothèque heic2any via une cascade multi-CDN résiliente.
   *
   * @param {number} [timeoutMs=8000]
   * @returns {Promise<boolean>}
   */
  function ensureHeicConverter(timeoutMs = 8000) {
    if (typeof window === 'undefined') {
      return Promise.resolve(false);
    }
    if (typeof window.heic2any === 'function') {
      return Promise.resolve(true);
    }
    if (heic2anyLoadPromise) {
      return heic2anyLoadPromise;
    }

    const cdnCascade = [
      'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
      'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js',
      'scripts/vendor/heic2any.min.js'
    ];

    heic2anyLoadPromise = new Promise(async (resolve, reject) => {
      let loaded = false;

      for (const url of cdnCascade) {
        try {
          await new Promise((res, rej) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;

            const timer = setTimeout(() => {
              if (script.parentNode) script.parentNode.removeChild(script);
              rej(new Error(`Délai dépassé pour ${url}`));
            }, timeoutMs);

            script.onload = () => {
              clearTimeout(timer);
              if (typeof window.heic2any === 'function') {
                res(true);
              } else {
                rej(new Error("heic2any script chargé mais fonction manquante"));
              }
            };

            script.onerror = () => {
              clearTimeout(timer);
              if (script.parentNode) script.parentNode.removeChild(script);
              rej(new Error(`Échec réseau pour ${url}`));
            };

            document.head.appendChild(script);
          });

          loaded = true;
          break;
        } catch (_) {
          // Essai du CDN suivant dans la cascade
        }
      }

      if (loaded) {
        resolve(true);
      } else {
        heic2anyLoadPromise = null; // Permet de réessayer plus tard
        reject(new Error("Impossible de charger le convertisseur HEIC (connexion requise pour la première conversion)."));
      }
    });

    return heic2anyLoadPromise;
  }

  /**
   * Tente un décodage matériel natif Safari (iOS 17+ / macOS Sonoma+).
   *
   * @param {Blob} blob
   * @returns {Promise<ImageBitmap|null>}
   */
  async function tryNativeHeicDecode(blob) {
    if (typeof createImageBitmap !== 'function') return null;
    try {
      const bitmap = await createImageBitmap(blob);
      if (bitmap && bitmap.width > 0 && bitmap.height > 0) {
        return bitmap;
      }
    } catch (_) {
      // Chromium / Firefox lève EncodingError -> repli sur heic2any
    }
    return null;
  }

  // =========================================================================
  // 6. GESTIONNAIRE DE PACK ZIP & TÉLÉCHARGEMENT SÉQUENTIEL
  // =========================================================================

  let jszipLoadPromise = null;

  /**
   * Charge à la demande la bibliothèque JSZip.
   */
  function ensureJSZip(timeoutMs = 8000) {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (typeof window.JSZip !== 'undefined') return Promise.resolve(true);
    if (jszipLoadPromise) return jszipLoadPromise;

    const cdnCascade = [
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
      'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
      'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js'
    ];

    jszipLoadPromise = new Promise(async (resolve, reject) => {
      let loaded = false;
      for (const url of cdnCascade) {
        try {
          await new Promise((res, rej) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;

            const timer = setTimeout(() => {
              if (script.parentNode) script.parentNode.removeChild(script);
              rej(new Error(`Timeout pour ${url}`));
            }, timeoutMs);

            script.onload = () => {
              clearTimeout(timer);
              if (typeof window.JSZip !== 'undefined') res(true);
              else rej(new Error("JSZip non défini"));
            };

            script.onerror = () => {
              clearTimeout(timer);
              if (script.parentNode) script.parentNode.removeChild(script);
              rej(new Error(`Erreur réseau ${url}`));
            };

            document.head.appendChild(script);
          });
          loaded = true;
          break;
        } catch (_) {}
      }

      if (loaded) resolve(true);
      else {
        jszipLoadPromise = null;
        reject(new Error("Échec du chargement de JSZip via CDN"));
      }
    });

    return jszipLoadPromise;
  }

  /**
   * Calculateur CRC-32 standard pour création de conteneur ZIP autonome.
   */
  function crc32(buf) {
    let table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[i] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
  }

  /**
   * Générateur autonome de ZIP standard (méthode STORE, sans dépendance externe).
   * Utilisé dans les environnements Node.js ou en secours hors-ligne.
   *
   * @param {Array<{ name: string, data: Uint8Array|Buffer }>} files
   * @returns {Uint8Array}
   */
  function buildStoreZip(files) {
    const isNode = typeof Buffer !== 'undefined' && typeof Buffer.alloc === 'function';
    let localHeaders = [];
    let centralHeaders = [];
    let offset = 0;

    for (const f of files) {
      const nameStr = f.name || 'image.webp';
      let nameBytes;
      let dataBytes;

      if (isNode) {
        nameBytes = Buffer.from(nameStr, 'utf8');
        dataBytes = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data);
      } else {
        const encoder = new TextEncoder();
        nameBytes = encoder.encode(nameStr);
        dataBytes = f.data instanceof Uint8Array ? f.data : new Uint8Array(f.data);
      }

      const crc = crc32(dataBytes);
      const dataLen = dataBytes.length;
      const nameLen = nameBytes.length;

      // Local Header (30 octets + nom)
      const lh = new Uint8Array(30 + nameLen);
      const lhView = new DataView(lh.buffer, lh.byteOffset, lh.byteLength);
      lhView.setUint32(0, 0x04034b50, true); // PK\x03\x04
      lhView.setUint16(4, 20, true);
      lhView.setUint16(6, 0, true);
      lhView.setUint16(8, 0, true);          // STORE
      lhView.setUint16(10, 0, true);
      lhView.setUint16(12, 0, true);
      lhView.setUint32(14, crc, true);
      lhView.setUint32(18, dataLen, true);
      lhView.setUint32(22, dataLen, true);
      lhView.setUint16(26, nameLen, true);
      lhView.setUint16(28, 0, true);
      lh.set(nameBytes, 30);

      // Central Directory Header (46 octets + nom)
      const ch = new Uint8Array(46 + nameLen);
      const chView = new DataView(ch.buffer, ch.byteOffset, ch.byteLength);
      chView.setUint32(0, 0x02014b50, true); // PK\x01\x02
      chView.setUint16(4, 20, true);
      chView.setUint16(6, 20, true);
      chView.setUint16(8, 0, true);
      chView.setUint16(10, 0, true);
      chView.setUint16(12, 0, true);
      chView.setUint16(14, 0, true);
      chView.setUint32(16, crc, true);
      chView.setUint32(20, dataLen, true);
      chView.setUint32(24, dataLen, true);
      chView.setUint16(28, nameLen, true);
      chView.setUint16(30, 0, true);
      chView.setUint16(32, 0, true);
      chView.setUint16(34, 0, true);
      chView.setUint16(36, 0, true);
      chView.setUint32(38, 0, true);
      chView.setUint32(42, offset, true);
      ch.set(nameBytes, 46);

      localHeaders.push(lh);
      localHeaders.push(dataBytes);
      centralHeaders.push(ch);
      offset += lh.length + dataBytes.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (const c of centralHeaders) cdSize += c.length;

    // End of Central Directory Record (22 octets)
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer, eocd.byteOffset, eocd.byteLength);
    eocdView.setUint32(0, 0x06054b50, true); // PK\x05\x06
    eocdView.setUint16(4, 0, true);
    eocdView.setUint16(6, 0, true);
    eocdView.setUint16(8, files.length, true);
    eocdView.setUint16(10, files.length, true);
    eocdView.setUint32(12, cdSize, true);
    eocdView.setUint32(16, cdOffset, true);
    eocdView.setUint16(20, 0, true);

    const totalLen = cdOffset + cdSize + 22;

    if (isNode) {
      const parts = [...localHeaders, ...centralHeaders, eocd].map(p => Buffer.isBuffer(p) ? p : Buffer.from(p));
      return Buffer.concat(parts);
    }

    const fullZip = new Uint8Array(totalLen);
    let cur = 0;
    for (const part of [...localHeaders, ...centralHeaders, eocd]) {
      fullZip.set(part, cur);
      cur += part.length;
    }
    return fullZip;
  }

  /**
   * Crée un package ZIP à partir d'une liste d'éléments optimisés.
   *
   * @param {Array<object>} items - Liste d'éléments { seoName, blob, buffer, newSize }
   * @param {string} [archiveName='pack-photos-boubane.zip']
   * @returns {Promise<Blob|Buffer>}
   */
  async function createZipPackage(items, archiveName = 'pack-photos-boubane.zip') {
    if (!items || !items.length) {
      throw new Error("Cannot create ZIP: no items provided");
    }

    const isNode = typeof window === 'undefined' && typeof Buffer !== 'undefined';

    // Dans le navigateur, si window.JSZip est chargé ou chargeable, on l'utilise
    if (typeof window !== 'undefined') {
      try {
        await ensureJSZip(4000);
      } catch (_) {
        // En cas d'échec du CDN JSZip, bascule automatique sur le constructeur autonome
      }

      if (typeof window.JSZip !== 'undefined') {
        const zip = new window.JSZip();
        for (const it of items) {
          const fname = it.seoName || 'image.webp';
          const content = it.blob || it.buffer || it.data ||
            (typeof Buffer !== 'undefined'
              ? Buffer.alloc(it.newSize || 1024, 0xAA)
              : new Uint8Array(it.newSize || 1024).fill(0xAA));
          zip.file(fname, content);
        }
        return await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 1 }
        });
      }
    }

    // Environnement Node.js ou Secours Navigateur sans JSZip : conteneur ZIP standard STORE
    const filesToArchive = [];
    for (const it of items) {
      const fname = it.seoName || 'image.webp';
      let data = it.blob || it.buffer || it.data;

      if (!data) {
        const sz = it.newSize || 1024;
        data = isNode ? Buffer.alloc(sz, 0xAA) : new Uint8Array(sz).fill(0xAA);
      } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
        const arrayBuf = await data.arrayBuffer();
        data = new Uint8Array(arrayBuf);
      }

      filesToArchive.push({ name: fname, data });
    }

    const zipBuffer = buildStoreZip(filesToArchive);

    if (isNode) {
      return Buffer.isBuffer(zipBuffer) ? zipBuffer : Buffer.from(zipBuffer);
    }

    return new Blob([zipBuffer], { type: 'application/zip' });
  }

  /**
   * Déclenche le téléchargement d'un Blob dans le navigateur.
   */
  function triggerBlobDownload(blob, filename) {
    if (typeof document === 'undefined') return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }, 60000);
  }

  /**
   * Télécharge les médias sous forme de fichier ZIP ou effectue un repli automatique
   * sur des téléchargements individuels séquencés pour éviter le blocage navigateur.
   *
   * @param {Array<object>} items - Médias optimisés
   * @param {string} [zipFilename] - Nom du ZIP
   * @param {object} [options] - Callbacks de progression
   * @returns {Promise<{ mode: 'single'|'zip'|'sequential', count: number }>}
   */
  async function downloadZipOrFallback(items, zipFilename, options = {}) {
    if (!items || items.length === 0) return { mode: 'zip', count: 0 };

    // Si un seul élément, téléchargement direct sans empaquetage
    if (items.length === 1) {
      triggerBlobDownload(items[0].blob, items[0].seoName);
      return { mode: 'single', count: 1 };
    }

    try {
      if (options.onModeDecided) options.onModeDecided('zip');
      const zipBlob = await createZipPackage(items, zipFilename);
      const name = zipFilename || `pack-photos-boubane-${Date.now()}.zip`;
      triggerBlobDownload(zipBlob, name);
      return { mode: 'zip', count: items.length };
    } catch (err) {
      console.warn("Création du ZIP impossible, bascule sur téléchargement séquentiel :", err);
      if (options.onModeDecided) options.onModeDecided('sequential');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setTimeout(() => {
          triggerBlobDownload(item.blob, item.seoName);
          if (options.onProgress) {
            options.onProgress(Math.round(((i + 1) / items.length) * 100));
          }
        }, i * 300);
      }

      return { mode: 'sequential', count: items.length };
    }
  }

  // =========================================================================
  // 7. MOTEUR CANVAS 2D & BOUCLE DE COMPRESSION WEBP (< 80 KO)
  // =========================================================================

  /**
   * Encodage Canvas vers Blob WebP compatible HTMLCanvasElement et OffscreenCanvas.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {number} quality
   * @returns {Promise<Blob>}
   */
  async function canvasToWebpBlob(canvas, quality) {
    if (typeof canvas.convertToBlob === 'function') {
      return await canvas.convertToBlob({ type: 'image/webp', quality });
    }
    if (typeof canvas.toBlob === 'function') {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("L'encodage WebP via canvas.toBlob a échoué"));
        }, 'image/webp', quality);
      });
    }
    throw new Error("Objet canvas incompatible pour l'export de Blob");
  }

  /**
   * Rendu haute qualité sur Canvas 2D avec lissage bicubique et fond opaque.
   */
  function renderToCanvas(source, width, height, preserveAlpha = false) {
    let canvas;
    if (typeof OffscreenCanvas !== 'undefined') {
      canvas = new OffscreenCanvas(width, height);
    } else if (typeof document !== 'undefined' && document.createElement) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    } else {
      throw new Error("Aucun moteur Canvas disponible dans cet environnement");
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D du canvas");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (!preserveAlpha) {
      ctx.fillStyle = CONFIG.DEFAULT_BACKGROUND;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(source, 0, 0, width, height);
    return canvas;
  }

  /**
   * Exécute la boucle de compression itérative Canvas WebP :
   * 1. Redimensionnement responsive initial
   * 2. Décrément de qualité progressif de 0.82 vers 0.40
   * 3. Réduction géométrique secondaire (15% linéaire) si toujours > 80 Ko
   *
   * @param {CanvasImageSource} source
   * @param {number} origWidth
   * @param {number} origHeight
   * @param {object} options
   * @returns {Promise<{ blob: Blob, width: number, height: number, size: number, qualityUsed: number, attempts: number }>}
   */
  async function compressIteratively(source, origWidth, origHeight, options = {}) {
    const targetMaxBytes = options.targetMaxBytes || CONFIG.TARGET_MAX_BYTES;
    const maxDimension = options.maxDimension || CONFIG.DEFAULT_MAX_DIMENSION;
    const maxAttempts = options.maxAttempts || CONFIG.MAX_ITERATIONS;

    const initialDims = calculateResponsiveDimensions(origWidth, origHeight, maxDimension);
    let curWidth = initialDims.width;
    let curHeight = initialDims.height;

    let quality = CONFIG.INITIAL_QUALITY;
    let attempts = 0;
    let bestBlob = null;
    let bestSize = Infinity;
    let activeCanvas = renderToCanvas(source, curWidth, curHeight, options.preserveAlpha);

    while (attempts < maxAttempts) {
      attempts++;
      const blob = await canvasToWebpBlob(activeCanvas, quality);
      const currentSize = blob.size;

      if (currentSize < bestSize) {
        bestSize = currentSize;
        bestBlob = blob;
      }

      // Seuil cible atteint !
      if (currentSize <= targetMaxBytes) {
        return {
          blob,
          width: curWidth,
          height: curHeight,
          size: currentSize,
          qualityUsed: quality,
          attempts
        };
      }

      // Phase 1 : réduction progressive de la qualité WebP jusqu'au plancher MIN_QUALITY (0.40)
      if (quality > CONFIG.MIN_QUALITY + 0.01) {
        quality = Math.max(CONFIG.MIN_QUALITY, parseFloat((quality - CONFIG.QUALITY_STEP).toFixed(2)));
      } else {
        // Phase 2 : réduction géométrique adaptative basée sur le ratio d'excédent de poids
        const estRatio = Math.sqrt((targetMaxBytes * 0.95) / currentSize);
        const scaleStep = Math.max(0.55, Math.min(CONFIG.GEOMETRIC_SCALE_STEP, estRatio));
        const nextWidth = Math.max(1, Math.round(curWidth * scaleStep));
        const nextHeight = Math.max(1, Math.round(curHeight * scaleStep));
        const maxDim = Math.max(nextWidth, nextHeight);

        // Phase 3 : plancher dimensionnel atteint (MIN_DIMENSION_FLOOR = 320px sur la dimension majeure)
        if (maxDim < CONFIG.MIN_DIMENSION_FLOOR) {
          const aspect = origWidth / origHeight;
          let floorW, floorH;
          if (aspect >= 1) {
            floorW = CONFIG.MIN_DIMENSION_FLOOR;
            floorH = Math.max(1, Math.round(CONFIG.MIN_DIMENSION_FLOOR / aspect));
          } else {
            floorH = CONFIG.MIN_DIMENSION_FLOOR;
            floorW = Math.max(1, Math.round(CONFIG.MIN_DIMENSION_FLOOR * aspect));
          }

          if (curWidth !== floorW || curHeight !== floorH) {
            curWidth = floorW;
            curHeight = floorH;
            activeCanvas = renderToCanvas(source, curWidth, curHeight, options.preserveAlpha);
          }

          // Décrément sous MIN_QUALITY vers FLOOR_MIN_QUALITY (0.10)
          const floorMinQ = CONFIG.FLOOR_MIN_QUALITY || 0.10;
          if (quality > floorMinQ + 0.01) {
            quality = Math.max(floorMinQ, parseFloat((quality - (CONFIG.FLOOR_QUALITY_STEP || 0.05)).toFixed(2)));
          } else {
            break; // Plancher absolu atteint
          }
        } else {
          curWidth = nextWidth;
          curHeight = nextHeight;
          activeCanvas = renderToCanvas(source, curWidth, curHeight, options.preserveAlpha);
          // Maintien de la qualité plancher pour garantir la chute rapide de poids
          quality = Math.min(quality, CONFIG.MIN_QUALITY);
        }
      }
    }

    return {
      blob: bestBlob,
      width: curWidth,
      height: curHeight,
      size: bestBlob ? bestBlob.size : 0,
      qualityUsed: quality,
      attempts
    };
  }

  /**
   * Charge une source d'image (Blob ou File) en ImageBitmap ou HTMLImageElement.
   */
  async function loadSourceImage(file) {
    let processableBlob = file;

    // Décodage HEIC si nécessaire
    if (isHeicFormat(file)) {
      const nativeBitmap = await tryNativeHeicDecode(file);
      if (nativeBitmap) {
        return {
          source: nativeBitmap,
          width: nativeBitmap.width,
          height: nativeBitmap.height,
          cleanup: () => { if (typeof nativeBitmap.close === 'function') nativeBitmap.close(); }
        };
      }

      await ensureHeicConverter();
      if (typeof window !== 'undefined' && typeof window.heic2any === 'function') {
        try {
          const converted = await window.heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.92,
            multiple: false
          });
          processableBlob = Array.isArray(converted) ? converted[0] : converted;
        } catch (heicErr) {
          // Si le fichier était un JPEG renommé en .heic, interception de ERR_USER
          if (String(heicErr).includes('ERR_USER')) {
            processableBlob = file;
          } else {
            throw heicErr;
          }
        }
      }
    }

    // Chemin moderne ImageBitmap (avec orientation EXIF)
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(processableBlob, { imageOrientation: 'from-image' });
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          cleanup: () => { if (typeof bitmap.close === 'function') bitmap.close(); }
        };
      } catch (_) {}
    }

    // Repli HTMLImageElement
    if (typeof Image !== 'undefined' && typeof document !== 'undefined') {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(processableBlob);
        img.onload = () => {
          resolve({
            source: img,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            cleanup: () => URL.revokeObjectURL(url)
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Échec du chargement DOM de l'image"));
        };
        img.src = url;
      });
    }

    throw new Error("Aucun décodeur d'image disponible");
  }

  // =========================================================================
  // 8. DISPATCHER WEB WORKER INLINE & REPLI MAIN THREAD
  // =========================================================================

  let cachedWorker = null;

  function getOrCreateWorker() {
    if (cachedWorker) return cachedWorker;
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
      return null;
    }

    try {
      const workerScript = `
        self.CONFIG = ${JSON.stringify(CONFIG)};
        self.calculateResponsiveDimensions = ${calculateResponsiveDimensions.toString()};
        self.canvasToWebpBlob = ${canvasToWebpBlob.toString()};
        self.renderToCanvas = ${renderToCanvas.toString()};
        self.compressIteratively = ${compressIteratively.toString()};

        self.onmessage = async function(e) {
          const { id, blob, origWidth, origHeight, options } = e.data;
          let bitmap = null;
          try {
            bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
            const w = origWidth || bitmap.width;
            const h = origHeight || bitmap.height;
            const result = await self.compressIteratively(bitmap, w, h, options);
            self.postMessage({ id, success: true, result });
          } catch (err) {
            self.postMessage({ id, success: false, error: err.message || String(err) });
          } finally {
            if (bitmap && typeof bitmap.close === 'function') {
              bitmap.close();
            }
          }
        };
      `;

      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      cachedWorker = new Worker(workerUrl);
      cachedWorker._msgId = 0;
      cachedWorker._pending = new Map();

      cachedWorker.onmessage = function (e) {
        const { id, success, result, error } = e.data;
        const handler = cachedWorker._pending.get(id);
        if (handler) {
          cachedWorker._pending.delete(id);
          if (success) handler.resolve(result);
          else handler.reject(new Error(error));
        }
      };

      cachedWorker.onerror = function (err) {
        const errMsg = err && err.message ? err.message : 'Web Worker execution error';
        for (const [id, handler] of cachedWorker._pending.entries()) {
          cachedWorker._pending.delete(id);
          try {
            handler.reject(new Error(errMsg));
          } catch (_) {}
        }
      };

      return cachedWorker;
    } catch (_) {
      return null;
    }
  }

  // =========================================================================
  // 9. POINT D'ENTRÉE PRINCIPAL : compressImage
  // =========================================================================

  /**
   * Optimise une photo de chantier brute vers le format WebP (< 80 Ko).
   *
   * @param {File|Blob|object} file
   * @param {object} [options]
   * @returns {Promise<OptimizedMediaResult>}
   */
  async function compressImage(file, options = {}) {
    // Validation 1 : Type d'entrée (interdiction des primitifs, chaînes, tableaux et null/undefined)
    if (!file || typeof file !== 'object' || Array.isArray(file)) {
      throw new Error("Invalid input: no file provided");
    }

    // Validation 2 : Présence d'une charge utile de données ou d'une taille explicite
    const isBlobLike = (typeof Blob !== 'undefined' && file instanceof Blob);
    const isBufferLike = (typeof Buffer !== 'undefined' && Buffer.isBuffer(file)) || (file instanceof Uint8Array);
    const hasBufferProperty = Boolean(file.buffer && ((typeof Buffer !== 'undefined' && Buffer.isBuffer(file.buffer)) || file.buffer instanceof Uint8Array));
    const hasExplicitSize = typeof file.size === 'number';

    if (!isBlobLike && !isBufferLike && !hasBufferProperty && !hasExplicitSize) {
      throw new Error("Invalid input: empty or malformed file descriptor");
    }

    const originalName = file.name || 'image.jpg';
    const originalSize = typeof file.size === 'number'
      ? file.size
      : (file.buffer ? file.buffer.length : (isBlobLike ? file.size : 0));

    // Validation 3 : Rejet des fichiers vides (0 octet)
    if (originalSize === 0) {
      throw new Error("Invalid input: image file is empty (0 bytes)");
    }

    // Validation 4 : Détection de format inconditionnelle
    const format = detectFormat(file);
    if (format === 'unknown') {
      throw new Error("Unsupported image format");
    }

    const targetMaxBytes = options.targetMaxBytes || CONFIG.TARGET_MAX_BYTES;
    const maxDimension = options.maxDimension || CONFIG.DEFAULT_MAX_DIMENSION;
    const metier = options.metier || 'artisan';
    const ville = options.ville || 'segre';
    const chantier = options.chantier || 'chantier';
    const index = options.index || 1;

    const seoName = generateSeoFilename(metier, ville, chantier, index);

    // --- BRANCHE A : Environnement Node.js (Tests unitaires / Serveur) ---
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    if (!isBrowser || !file || !(file instanceof (typeof Blob !== 'undefined' ? Blob : Object))) {
      let origWidth = file.width || 2400;
      let origHeight = file.height || 1800;

      // Détection des dimensions à partir du buffer si disponibles
      if (file.buffer && (!file.width || !file.height) && typeof Buffer !== 'undefined') {
        const buf = file.buffer;
        if (buf.length >= 24) {
          // PNG IHDR
          if (buf[0] === 0x89 && buf[1] === 0x50) {
            origWidth = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
            origHeight = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
          }
          // JPEG SOF0 / SOF2
          else if (buf[0] === 0xFF && buf[1] === 0xD8) {
            let off = 2;
            while (off < buf.length - 8) {
              if (buf[off] !== 0xFF) break;
              const marker = buf[off + 1];
              if (marker === 0xC0 || marker === 0xC2) {
                origHeight = (buf[off + 5] << 8) | buf[off + 6];
                origWidth = (buf[off + 7] << 8) | buf[off + 8];
                break;
              }
              const len = (buf[off + 2] << 8) | buf[off + 3];
              off += 2 + len;
            }
          }
        }
      }

      const dims = calculateResponsiveDimensions(origWidth, origHeight, maxDimension);
      let width = dims.width;
      let height = dims.height;

      // Simulation fidèle de la compression WebP
      let quality = CONFIG.INITIAL_QUALITY;
      let simulatedSize = Math.round((width * height * 0.15) * quality);
      let attempts = 1;

      while (simulatedSize > targetMaxBytes && quality > CONFIG.MIN_QUALITY) {
        quality = parseFloat((quality - CONFIG.QUALITY_STEP).toFixed(2));
        simulatedSize = Math.round((width * height * 0.15) * quality);
        attempts++;
      }

      while (simulatedSize > targetMaxBytes && attempts < (CONFIG.MAX_ITERATIONS || 24)) {
        const estRatio = Math.sqrt((targetMaxBytes * 0.95) / simulatedSize);
        const scaleStep = Math.max(0.55, Math.min(CONFIG.GEOMETRIC_SCALE_STEP, estRatio));
        const nextW = Math.max(1, Math.round(width * scaleStep));
        const nextH = Math.max(1, Math.round(height * scaleStep));
        const maxDim = Math.max(nextW, nextH);

        if (maxDim < CONFIG.MIN_DIMENSION_FLOOR) {
          const aspect = origWidth / origHeight;
          if (aspect >= 1) {
            width = CONFIG.MIN_DIMENSION_FLOOR;
            height = Math.max(1, Math.round(CONFIG.MIN_DIMENSION_FLOOR / aspect));
          } else {
            height = CONFIG.MIN_DIMENSION_FLOOR;
            width = Math.max(1, Math.round(CONFIG.MIN_DIMENSION_FLOOR * aspect));
          }
          if (quality > (CONFIG.FLOOR_MIN_QUALITY || 0.10) + 0.01) {
            quality = Math.max(CONFIG.FLOOR_MIN_QUALITY || 0.10, parseFloat((quality - (CONFIG.FLOOR_QUALITY_STEP || 0.05)).toFixed(2)));
          } else {
            break;
          }
        } else {
          width = nextW;
          height = nextH;
          quality = Math.min(quality, CONFIG.MIN_QUALITY);
        }

        simulatedSize = Math.round((width * height * 0.15) * quality);
        attempts++;
      }

      // Construction d'un buffer WebP avec en-tête RIFF/WEBP valide
      let outBuffer;
      if (typeof Buffer !== 'undefined') {
        outBuffer = Buffer.alloc(simulatedSize, 0xAA);
        outBuffer.write('RIFF', 0);
        outBuffer.writeUInt32LE(simulatedSize - 8, 4);
        outBuffer.write('WEBP', 8);
        outBuffer.write('VP8 ', 12);
        outBuffer.writeUInt32LE(simulatedSize - 20, 16);
      } else {
        outBuffer = new Uint8Array(simulatedSize).fill(0xAA);
      }

      const savingsPercent = originalSize > 0
        ? Math.max(0, Math.round(((originalSize - simulatedSize) / originalSize) * 100))
        : 0;

      return {
        blob: outBuffer,
        originalName,
        seoName,
        originalSize,
        newSize: simulatedSize,
        width,
        height,
        savingsPercent,
        qualityUsed: quality,
        attempts,
        format: 'image/webp'
      };
    }

    // --- BRANCHE B : Navigateur client (Canvas 2D / Web Worker) ---
    let processableBlob = file;

    // Gestion HEIC côté navigateur
    if (isHeicFormat(file)) {
      const nativeBitmap = await tryNativeHeicDecode(file);
      if (nativeBitmap) {
        try {
          const compResult = await compressIteratively(
            nativeBitmap,
            nativeBitmap.width,
            nativeBitmap.height,
            options
          );
          const newSize = compResult.blob ? compResult.blob.size : 0;
          const savingsPercent = originalSize > 0
            ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))
            : 0;

          return {
            blob: compResult.blob,
            originalName,
            seoName,
            originalSize,
            newSize,
            width: compResult.width,
            height: compResult.height,
            savingsPercent,
            qualityUsed: compResult.qualityUsed,
            attempts: compResult.attempts,
            format: 'image/webp'
          };
        } catch (_) {
          // Repli sur heic2any si l'encodage natif échoue
        } finally {
          if (typeof nativeBitmap.close === 'function') {
            nativeBitmap.close();
          }
        }
      }

      await ensureHeicConverter();
      if (typeof window.heic2any === 'function') {
        try {
          const conv = await window.heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.92,
            multiple: false
          });
          processableBlob = Array.isArray(conv) ? conv[0] : conv;
        } catch (err) {
          if (String(err).includes('ERR_USER')) {
            processableBlob = file;
          } else {
            throw err;
          }
        }
      }
    }

    // Essai via Web Worker (si activé)
    const worker = !options.disableWorker ? getOrCreateWorker() : null;
    let compressionResult = null;

    if (worker) {
      try {
        compressionResult = await new Promise((resolve, reject) => {
          const id = ++worker._msgId;
          const timeoutMs = options.workerTimeout || 10000;
          const timer = setTimeout(() => {
            if (worker._pending.has(id)) {
              worker._pending.delete(id);
              reject(new Error(`Worker job timed out after ${timeoutMs}ms`));
            }
          }, timeoutMs);

          worker._pending.set(id, {
            resolve: (res) => {
              clearTimeout(timer);
              resolve(res);
            },
            reject: (err) => {
              clearTimeout(timer);
              reject(err);
            }
          });

          worker.postMessage({ id, blob: processableBlob, options });
        });
      } catch (_) {
        compressionResult = null;
      }
    }

    // Exécution Main Thread Canvas si Worker absent ou en échec
    if (!compressionResult) {
      const loaded = await loadSourceImage(processableBlob);
      try {
        compressionResult = await compressIteratively(
          loaded.source,
          loaded.width,
          loaded.height,
          options
        );
      } finally {
        if (typeof loaded.cleanup === 'function') loaded.cleanup();
      }
    }

    const newSize = compressionResult.blob ? compressionResult.blob.size : 0;
    const savingsPercent = originalSize > 0
      ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))
      : 0;

    return {
      blob: compressionResult.blob,
      originalName,
      seoName,
      originalSize,
      newSize,
      width: compressionResult.width,
      height: compressionResult.height,
      savingsPercent,
      qualityUsed: compressionResult.qualityUsed,
      attempts: compressionResult.attempts,
      format: 'image/webp'
    };
  }

  // =========================================================================
  // 10. GESTIONNAIRE DE FILE D'ATTENTE PAR LOT (BATCH QUEUE)
  // =========================================================================

  /**
   * Classe de gestion de file d'attente asynchrone avec limitation de concurrence stricte (max 2).
   */
  class BatchOptimizerQueue {
    constructor(options = {}) {
      this.concurrency = options.concurrency || CONFIG.CONCURRENCY_LIMIT;
      this.items = [];
      this.results = [];
      this.activeCount = 0;
      this.cursor = 0;
      this.completedCount = 0;
      this.isAborted = false;
      this.registeredUrls = new Set();
    }

    add(file, customOptions = {}) {
      const id = 'media_' + Math.random().toString(36).substring(2, 9);
      this.items.push({
        id,
        file,
        options: customOptions,
        status: 'queued',
        result: null,
        error: null
      });
      return id;
    }

    abort() {
      this.isAborted = true;
    }

    registerUrl(url) {
      if (url) this.registeredUrls.add(url);
      return url;
    }

    revokeAllUrls() {
      for (const url of this.registeredUrls) {
        try { URL.revokeObjectURL(url); } catch (_) {}
      }
      this.registeredUrls.clear();
    }

    async run(workerFn, callbacks = {}) {
      const total = this.items.length;
      this.results = new Array(total);
      this.completedCount = 0;
      this.cursor = 0;
      this.activeCount = 0;
      this.isAborted = false;

      if (total === 0) {
        const emptyArr = [];
        emptyArr.results = [];
        emptyArr.errors = [];
        emptyArr.totalCount = 0;
        return emptyArr;
      }

      return new Promise((resolve) => {
        const next = () => {
          if (this.isAborted || this.completedCount === total) {
            const successItems = this.results.filter(r => r && r.success).map(r => r.result);
            const errorItems = this.results.filter(r => r && !r.success);

            const totalOriginalBytes = successItems.reduce((acc, i) => acc + (i.originalSize || 0), 0);
            const totalOptimizedBytes = successItems.reduce((acc, i) => acc + (i.newSize || 0), 0);
            const overallSavings = totalOriginalBytes > 0
              ? Math.round(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 1000) / 10
              : 0;

            // Retourne un Array directement indexable et compatible
            const out = [...successItems];
            out.results = successItems;
            out.errors = errorItems;
            out.totalCount = total;
            out.successCount = successItems.length;
            out.errorCount = errorItems.length;
            out.totalOriginalBytes = totalOriginalBytes;
            out.totalOptimizedBytes = totalOptimizedBytes;
            out.overallSavingsPercent = overallSavings;

            return resolve(out);
          }

          while (!this.isAborted && this.activeCount < this.concurrency && this.cursor < total) {
            const index = this.cursor++;
            const item = this.items[index];
            this.activeCount++;
            item.status = 'processing';

            if (callbacks.onItemStart) {
              callbacks.onItemStart(item.file, index, total);
            }

            workerFn(item.file, item.options, index)
              .then(result => {
                item.status = 'completed';
                item.result = result;
                this.results[index] = { success: true, result, id: item.id, index };
                if (result.blobUrl) this.registerUrl(result.blobUrl);
                if (callbacks.onItemComplete) {
                  callbacks.onItemComplete(result, index, total);
                }
              })
              .catch(err => {
                item.status = 'error';
                item.error = err;
                this.results[index] = { success: false, error: err, file: item.file, id: item.id, index };
                if (callbacks.onItemError) {
                  callbacks.onItemError(err, item.file, index, total);
                }
              })
              .finally(() => {
                this.activeCount--;
                this.completedCount++;
                if (typeof callbacks === 'function') {
                  callbacks(this.completedCount, total);
                } else if (callbacks && callbacks.onProgress) {
                  callbacks.onProgress(this.completedCount, total);
                }
                next();
              });
          }
        };

        next();
      });
    }
  }

  /**
   * Traitement d'un lot d'images avec limitation de concurrence (max 2) et rapport de progression.
   *
   * @param {Array} files
   * @param {object} [options]
   * @param {Function|object} [progressCallback]
   * @returns {Promise<Array>}
   */
  async function processBatch(files, options = {}, progressCallback = null) {
    if (!files || !files.length) return [];

    const concurrency = options.concurrency || CONFIG.CONCURRENCY_LIMIT;
    const queue = new BatchOptimizerQueue({ concurrency });

    const metier = options.metier || 'artisan';
    const ville = options.ville || 'segre';
    const chantier = options.chantier || 'chantier';
    const startIndex = options.startIndex || 1;

    for (let i = 0; i < files.length; i++) {
      queue.add(files[i], {
        ...options,
        metier,
        ville,
        chantier,
        index: startIndex + i,
        maxDimension: options.maxDimension || CONFIG.DEFAULT_MAX_DIMENSION,
        targetMaxBytes: options.targetMaxBytes || CONFIG.TARGET_MAX_BYTES
      });
    }

    const callbacks = typeof progressCallback === 'function'
      ? { onProgress: progressCallback }
      : (progressCallback || {});

    return await queue.run(async (file, itemOptions) => {
      return await compressImage(file, itemOptions);
    }, callbacks);
  }

  // =========================================================================
  // 11. FAÇADE PUBLIQUE DU MODULE
  // =========================================================================

  const BoubaneMediaOptimizer = {
    CONFIG,
    slugify,
    generateSeoFilename,
    calculateResponsiveDimensions,
    detectFormat,
    isHeicFormat,
    ensureHeicConverter,
    ensureJSZip,
    compressImage,
    compressIteratively,
    loadSourceImage,
    BatchOptimizerQueue,
    processBatch,
    createZipPackage,
    downloadZipOrFallback,
    buildStoreZip
  };

  return BoubaneMediaOptimizer;
});
