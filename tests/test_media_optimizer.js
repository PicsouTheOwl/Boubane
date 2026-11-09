/**
 * Test Suite: Boubane Client-Side Media Optimizer Engine
 * Fichier de tests unitaires et de vérification rigoureuse pour scripts/media_optimizer.js.
 *
 * Couverture :
 * 1. Boucle de compression itérative Canvas WebP garantissant < 80 Ko
 * 2. Redimensionnement responsive préservant le ratio d'aspect (paysage, portrait, carré, panoramique, petit format)
 * 3. Détection de format HEIC/HEIF à 3 niveaux (MIME, extension, magic bytes ftyp 64-octets, détection anti-falsification)
 * 4. Slugification SEO française (accents NFD, ligatures œ/æ, ponctuation, apostrophes, emojis) et nommage standardisé
 * 5. File d'attente par lot avec limitation stricte de concurrence à 2 et suivi de progression
 * 6. Empaquetage ZIP autonome et repli séquentiel
 * 7. Gestion défensive des cas limites (fichiers vides, formats corrompus, images réelles)
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');

// Chargement du module live sous test
const optimizerPath = path.resolve(__dirname, '../scripts/media_optimizer.js');
const BoubaneMediaOptimizer = require(optimizerPath);

let testsPassed = 0;
let testsFailed = 0;
const testStartTime = Date.now();

async function test(description, testFn) {
  try {
    await testFn();
    testsPassed++;
    console.log(`  \x1b[32m✔\x1b[0m ${description}`);
  } catch (err) {
    testsFailed++;
    console.error(`  \x1b[31m✖\x1b[0m ${description}`);
    console.error(`    \x1b[31mErreur: ${err.message}\x1b[0m`);
    if (err.stack) {
      const relevantStack = err.stack.split('\n').slice(1, 4).join('\n');
      console.error(`    ${relevantStack}`);
    }
  }
}

async function runTestSuite() {
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;36m  Boubane Media Optimizer — Suite de Tests Unitaires et de Validation\x1b[0m');
  console.log(`  Source testée : \x1b[33m${optimizerPath}\x1b[0m`);
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');

  // =========================================================================
  // SECTION 1 : SLUGIFICATION SEO & NOMMAGE NORMALISÉ
  // =========================================================================
  console.log('\x1b[1;34m[1/6] Slugification SEO & Génération de Noms de Fichiers\x1b[0m');

  await test('Slugification : gestion complète des accents français (NFD)', () => {
    const raw = "Ébénisterie, Maçonnerie & Façade à Château-Gontier";
    const expected = "ebenisterie-maconnerie-facade-a-chateau-gontier";
    assert.equal(BoubaneMediaOptimizer.slugify(raw), expected);
  });

  await test('Slugification : expansion des ligatures françaises œ (oe) et æ (ae)', () => {
    assert.equal(BoubaneMediaOptimizer.slugify("Œuvre d'art et cœur d'artisan"), "oeuvre-d-art-et-coeur-d-artisan");
    assert.equal(BoubaneMediaOptimizer.slugify("Curriculum vitæ d'un maître artisan"), "curriculum-vitae-d-un-maitre-artisan");
    assert.equal(BoubaneMediaOptimizer.slugify("CŒUR & ŒNO-TOURISME"), "coeur-oeno-tourisme");
  });

  await test('Slugification : apostrophes, guillemets et tirets multiples', () => {
    assert.equal(BoubaneMediaOptimizer.slugify("L'artisan de l'Anjou — 100% Pierre"), "l-artisan-de-l-anjou-100-pierre");
    assert.equal(BoubaneMediaOptimizer.slugify("---Rénovation   Multiples---Espaces---"), "renovation-multiples-espaces");
    assert.equal(BoubaneMediaOptimizer.slugify("Peinture & Déco (Rénov’ Express)"), "peinture-deco-renov-express");
  });

  await test('Slugification : emojis et caractères non-latins', () => {
    assert.equal(BoubaneMediaOptimizer.slugify("🔥 Super Artisan Bâtiment 🚀 49500"), "super-artisan-batiment-49500");
    assert.equal(BoubaneMediaOptimizer.slugify("!@#$%^&*()_+="), "");
    assert.equal(BoubaneMediaOptimizer.slugify(null), "");
    assert.equal(BoubaneMediaOptimizer.slugify(""), "");
  });

  await test('Nommage SEO : format standardisé metier-ville-chantier-XX.webp avec zero-padding', () => {
    const name1 = BoubaneMediaOptimizer.generateSeoFilename('Couvreur Zingueur', 'Segré-en-Anjou Bleu', 'Rénovation Toiture', 1);
    assert.equal(name1, 'couvreur-zingueur-segre-en-anjou-bleu-renovation-toiture-01.webp');

    const name9 = BoubaneMediaOptimizer.generateSeoFilename('Menuisier', 'Angers', 'Pose Fenêtres', 9);
    assert.equal(name9, 'menuisier-angers-pose-fenetres-09.webp');

    const name10 = BoubaneMediaOptimizer.generateSeoFilename('Plombier', 'Château-Gontier', 'Installation PAC', 10);
    assert.equal(name10, 'plombier-chateau-gontier-installation-pac-10.webp');

    const name125 = BoubaneMediaOptimizer.generateSeoFilename('Électricien', 'Nantes', 'Tableau Électrique', 125);
    assert.equal(name125, 'electricien-nantes-tableau-electrique-125.webp');
  });

  await test('Nommage SEO : suppression des extensions pré-existantes dans le nom de chantier', () => {
    const nameWithJpg = BoubaneMediaOptimizer.generateSeoFilename('Peintre', 'Craon', 'facade-ravalement.jpg', 3);
    assert.equal(nameWithJpg, 'peintre-craon-facade-ravalement-03.webp');

    const nameWithPng = BoubaneMediaOptimizer.generateSeoFilename('Charpentier', 'Lion-d-Angers', 'ossature-bois.PNG', 7);
    assert.equal(nameWithPng, 'charpentier-lion-d-angers-ossature-bois-07.webp');
  });

  await test('Nommage SEO : valeurs de repli par défaut si champs vides', () => {
    const defaultName = BoubaneMediaOptimizer.generateSeoFilename('', '', '', 0);
    assert.equal(defaultName, 'artisan-segre-chantier-01.webp');
  });

  // =========================================================================
  // SECTION 2 : GÉOMÉTRIE & REDIMENSIONNEMENT RESPONSIVE
  // =========================================================================
  console.log('\n\x1b[1;34m[2/6] Géométrie & Redimensionnement Homothétique\x1b[0m');

  await test('Redimensionnement : format Paysage (4:3) 4032x3024 borné à 1400px', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(4032, 3024, 1400);
    assert.equal(res.width, 1400);
    assert.equal(res.height, 1050);
    assert.ok(Math.abs(res.aspectRatio - (4032 / 3024)) < 0.001);
  });

  await test('Redimensionnement : format Portrait (3:4) 3024x4032 borné à 1400px', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(3024, 4032, 1400);
    assert.equal(res.height, 1400);
    assert.equal(res.width, 1050);
    assert.ok(Math.abs(res.aspectRatio - (3024 / 4032)) < 0.001);
  });

  await test('Redimensionnement : format 16:9 (3840x2160) borné à 1600px', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(3840, 2160, 1600);
    assert.equal(res.width, 1600);
    assert.equal(res.height, 900);
  });

  await test('Redimensionnement : format Carré 1:1 (3000x3000) borné à 1280px', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(3000, 3000, 1280);
    assert.equal(res.width, 1280);
    assert.equal(res.height, 1280);
  });

  await test('Redimensionnement : format Panoramique 4:1 (4000x1000) borné à 1400px', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(4000, 1000, 1400);
    assert.equal(res.width, 1400);
    assert.equal(res.height, 350);
  });

  await test('Redimensionnement : pas d’agrandissement (upscale) pour image inférieure (800x600)', () => {
    const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(800, 600, 1400);
    assert.equal(res.width, 800);
    assert.equal(res.height, 600);
    assert.equal(res.scale, 1.0);
  });

  await test('Redimensionnement : rejet des dimensions nulles ou négatives', () => {
    assert.throws(() => BoubaneMediaOptimizer.calculateResponsiveDimensions(0, 1000), /Dimensions d'image invalides/);
    assert.throws(() => BoubaneMediaOptimizer.calculateResponsiveDimensions(-100, -200), /Dimensions d'image invalides/);
  });

  // =========================================================================
  // SECTION 3 : DÉTECTION DE FORMAT À 3 NIVEAUX & HEIC
  // =========================================================================
  console.log('\n\x1b[1;34m[3/6] Détection de Format à 3 Niveaux & Support HEIC\x1b[0m');

  await test('Détection Couche 1 : type MIME standard (JPEG, PNG, WebP, HEIC)', () => {
    assert.equal(BoubaneMediaOptimizer.detectFormat({ type: 'image/jpeg' }), 'jpeg');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ type: 'image/png' }), 'png');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ type: 'image/webp' }), 'webp');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ type: 'image/heic' }), 'heic');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ type: 'image/heif' }), 'heic');
  });

  await test('Détection Couche 2 : extension de fichier sans MIME', () => {
    assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'photo_chantier.heic' }), 'heic');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'iPhone_Photo.HIF' }), 'heic');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'facade.jpg' }), 'jpeg');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'plan.PNG' }), 'png');
    assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'export.webp' }), 'webp');
  });

  await test('Détection Couche 3 : magic bytes HEIC (en-tête ftyp avec marques mif1/heic)', () => {
    const heicHeader = Buffer.from([
      0x00, 0x00, 0x00, 0x18, // Longueur boîte 24 octets
      0x66, 0x74, 0x79, 0x70, // 'ftyp'
      0x6d, 0x69, 0x66, 0x31, // Marque majeure 'mif1'
      0x00, 0x00, 0x00, 0x00, // Version mineure
      0x68, 0x65, 0x69, 0x63, // Marque compatible 'heic'
      0x6d, 0x73, 0x66, 0x31  // Marque compatible 'msf1'
    ]);
    assert.equal(BoubaneMediaOptimizer.detectFormat({ buffer: heicHeader }), 'heic');
    assert.equal(BoubaneMediaOptimizer.isHeicFormat({ buffer: heicHeader }), true);
  });

  await test('Détection Couche 3 : détection anti-falsification (JPEG renommé en .heic)', () => {
    // Fichier ayant le nom 'fake.heic' mais les octets réels d'un JPEG (FF D8 FF)
    const disguisedJpeg = {
      name: 'fake.heic',
      type: 'application/octet-stream',
      buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01])
    };
    assert.equal(BoubaneMediaOptimizer.detectFormat(disguisedJpeg), 'jpeg');
  });

  await test('Détection Couche 3 : détection anti-falsification (PNG renommé en .heic)', () => {
    const disguisedPng = {
      name: 'fake.heic',
      type: 'image/heic',
      buffer: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D])
    };
    assert.equal(BoubaneMediaOptimizer.detectFormat(disguisedPng), 'png');
  });

  await test('Détection sur fixtures du projet (tests/fixtures/images/sample.heic)', () => {
    const sampleHeicPath = path.resolve(__dirname, 'fixtures/images/sample.heic');
    if (fs.existsSync(sampleHeicPath)) {
      const buf = fs.readFileSync(sampleHeicPath);
      assert.equal(BoubaneMediaOptimizer.detectFormat({ name: 'sample.heic', buffer: buf }), 'heic');
    }
  });

  // =========================================================================
  // SECTION 4 : COMPRESSION WEBP ITÉRATIVE (< 80 KO GARANTI)
  // =========================================================================
  console.log('\n\x1b[1;34m[4/6] Compression Adaptative WebP (< 80 Ko Garanti)\x1b[0m');

  await test('Compression : respect strict du plafond < 80 Ko (< 81,920 octets) sur image haute résolution', async () => {
    const highRes = {
      name: 'chantier_toiture_ardoise.jpg',
      size: 5500000,
      width: 4032,
      height: 3024,
      buffer: Buffer.alloc(1000)
    };

    const res = await BoubaneMediaOptimizer.compressImage(highRes, {
      metier: 'Couvreur',
      ville: 'Segré',
      chantier: 'Toiture',
      index: 1,
      maxDimension: 1400,
      targetMaxBytes: 80000
    });

    assert.ok(res.newSize <= 80000, `Poids ${res.newSize} dépasse la cible de 80,000 octets`);
    assert.ok(res.newSize < 81920, `Poids ${res.newSize} dépasse 80 Ko`);
    assert.equal(res.width, 1400);
    assert.equal(res.height, 1050);
    assert.equal(res.seoName, 'couvreur-segre-toiture-01.webp');
    assert.ok(res.savingsPercent >= 0);
  });

  await test('Compression : passage de la réduction géométrique secondaire si forte entropie', async () => {
    // Image avec contrainte très agressive (30 Ko) simulant une très haute entropie
    const toughImage = {
      name: 'scaffolding_complex.jpg',
      size: 6000000,
      width: 4000,
      height: 3000,
      buffer: Buffer.alloc(2000)
    };

    const res = await BoubaneMediaOptimizer.compressImage(toughImage, {
      maxDimension: 1400,
      targetMaxBytes: 30000 // 30 Ko
    });

    assert.ok(res.newSize <= 30000, `Poids ${res.newSize} dépasse le seuil strict de 30 Ko`);
    assert.ok(res.attempts > 1, "Doit avoir exécuté plusieurs itérations de compression");
  });

  await test('Compression : préservation exacte du ratio pour orientation Portrait', async () => {
    // Cas A : Portrait 1:2 (1500x3000) borné à 1600px
    const portraitStandard = {
      name: 'portrait_standard.jpg',
      size: 2000000,
      width: 1500,
      height: 3000
    };
    const resA = await BoubaneMediaOptimizer.compressImage(portraitStandard, { maxDimension: 1600 });
    assert.equal(resA.height, 1600);
    assert.equal(resA.width, 800);
    assert.ok(resA.newSize <= 80000);

    // Cas B : Portrait 3:4 (2400x3200) nécessitant réduction géométrique pour atteindre < 80 Ko
    const portraitLarge = {
      name: 'facade_haute.jpg',
      size: 3200000,
      width: 2400,
      height: 3200,
      buffer: Buffer.alloc(1000)
    };
    const resB = await BoubaneMediaOptimizer.compressImage(portraitLarge, {
      maxDimension: 1600,
      targetMaxBytes: 80000
    });
    assert.ok(resB.newSize <= 80000, `Poids ${resB.newSize} doit être <= 80000 octets`);
    const ratioInitial = 2400 / 3200; // 0.75
    const ratioFinal = resB.width / resB.height;
    assert.ok(Math.abs(ratioFinal - ratioInitial) < 0.01, `Le ratio d'aspect (${ratioFinal}) doit correspondre au ratio initial (${ratioInitial}) à ±1% près`);
  });

  await test('Compression : gestion des images de test réelles du dépôt (boubane-logo.png)', async () => {
    const logoPath = path.resolve(__dirname, '../boubane-logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuf = fs.readFileSync(logoPath);
      const res = await BoubaneMediaOptimizer.compressImage({
        name: 'boubane-logo.png',
        buffer: logoBuf,
        size: logoBuf.length
      }, {
        metier: 'Agence',
        ville: 'Segré',
        chantier: 'Logo',
        index: 1
      });

      assert.ok(res.newSize < 80000, `Logo optimisé ${res.newSize} doit être < 80 Ko`);
      assert.equal(res.width, 856); // 856 < 1400, pas d'upscale
      assert.equal(res.height, 901);
      assert.equal(res.seoName, 'agence-segre-logo-01.webp');
    }
  });

  // =========================================================================
  // SECTION 5 : FILE D'ATTENTE PAR LOT (BATCH QUEUE) AVEC CONCURRENCE = 2
  // =========================================================================
  console.log('\n\x1b[1;34m[5/6] File d’Attente par Lot & Contrôle de Concurrence\x1b[0m');

  await test('Batch Queue : limitation stricte de la concurrence à 2 tâches simultanées', async () => {
    const queue = new BoubaneMediaOptimizer.BatchOptimizerQueue({ concurrency: 2 });
    let maxObservedActive = 0;
    let currentlyActive = 0;

    const files = [1, 2, 3, 4, 5, 6].map(i => ({
      name: `photo_${i}.jpg`,
      size: 2000000,
      width: 3000,
      height: 2000
    }));

    files.forEach(f => queue.add(f));

    const progressReports = [];
    const results = await queue.run(async (file, opts, idx) => {
      currentlyActive++;
      if (currentlyActive > maxObservedActive) {
        maxObservedActive = currentlyActive;
      }
      // Petite temporisation asynchrone pour observer la concurrence
      await new Promise(r => setTimeout(r, 10));
      currentlyActive--;
      return BoubaneMediaOptimizer.compressImage(file, { index: idx + 1 });
    }, (done, total) => {
      progressReports.push({ done, total });
    });

    assert.equal(maxObservedActive, 2, `La concurrence observée était de ${maxObservedActive}, doit être 2`);
    assert.equal(results.length, 6);
    assert.equal(progressReports.length, 6);
    assert.equal(progressReports[5].done, 6);
    assert.equal(progressReports[5].total, 6);
  });

  await test('Batch Helper : processBatch avec callback de progression séquentiel', async () => {
    const files = [
      { name: 'chantier1.jpg', size: 3000000 },
      { name: 'chantier2.png', size: 2500000 },
      { name: 'chantier3.jpg', size: 4100000 },
      { name: 'chantier4.jpg', size: 1800000 }
    ];

    let lastDone = 0;
    const items = await BoubaneMediaOptimizer.processBatch(files, {
      metier: 'Macon',
      ville: 'Segre',
      chantier: 'Facade'
    }, (done, total) => {
      assert.ok(done > lastDone, "La progression doit être strictement croissante");
      assert.ok(done <= total, "La progression ne peut pas dépasser le total");
      lastDone = done;
    });

    assert.equal(items.length, 4);
    assert.equal(lastDone, 4);
    assert.equal(items[0].seoName, 'macon-segre-facade-01.webp');
    assert.equal(items[1].seoName, 'macon-segre-facade-02.webp');
    assert.equal(items[2].seoName, 'macon-segre-facade-03.webp');
    assert.equal(items[3].seoName, 'macon-segre-facade-04.webp');
  });

  await test('Batch Queue : résilience face à une image défectueuse sans bloquer le reste', async () => {
    const queue = new BoubaneMediaOptimizer.BatchOptimizerQueue({ concurrency: 2 });
    queue.add({ name: 'good1.jpg', size: 100000, width: 800, height: 600 });
    queue.add({ name: 'bad.txt', size: 20, buffer: Buffer.from('NOT_AN_IMAGE') });
    queue.add({ name: 'good2.jpg', size: 100000, width: 800, height: 600 });

    const out = await queue.run(async (file, opts) => {
      return await BoubaneMediaOptimizer.compressImage(file, opts);
    });

    assert.equal(out.length, 2, "Doit contenir 2 éléments réussis");
    assert.equal(out.errors.length, 1, "Doit avoir capturé 1 erreur");
    assert.equal(out.totalCount, 3);
  });

  // =========================================================================
  // SECTION 6 : EMPAQUETAGE ZIP AUTONOME & GESTION DES CAS LIMITES
  // =========================================================================
  console.log('\n\x1b[1;34m[6/6] Empaquetage ZIP Standard & Robustesse Adversariale\x1b[0m');

  await test('Export ZIP : structure standard PK\\x03\\x04 valide et lisible par unzip', async () => {
    const mockItems = [
      { seoName: 'couvreur-segre-01.webp', newSize: 45000, data: Buffer.alloc(45000, 0x11) },
      { seoName: 'couvreur-segre-02.webp', newSize: 52000, data: Buffer.alloc(52000, 0x22) }
    ];

    const zipBuffer = await BoubaneMediaOptimizer.createZipPackage(mockItems, 'pack-test.zip');
    assert.ok(zipBuffer.length > 0);

    // Vérification magic bytes PK\x03\x04
    assert.equal(zipBuffer[0], 0x50);
    assert.equal(zipBuffer[1], 0x4B);
    assert.equal(zipBuffer[2], 0x03);
    assert.equal(zipBuffer[3], 0x04);

    // Validation intégrité via commande unzip système
    const tmpZipPath = path.resolve(__dirname, 'temp_test_archive.zip');
    fs.writeFileSync(tmpZipPath, zipBuffer);
    try {
      const unzipOutput = execSync(`unzip -l "${tmpZipPath}"`).toString();
      assert.ok(unzipOutput.includes('couvreur-segre-01.webp'));
      assert.ok(unzipOutput.includes('couvreur-segre-02.webp'));
      assert.ok(unzipOutput.includes('2 files'));
    } finally {
      if (fs.existsSync(tmpZipPath)) fs.unlinkSync(tmpZipPath);
    }
  });

  await test('Export ZIP : rejet d’une liste vide avec message d’erreur clair', async () => {
    await assert.rejects(
      async () => await BoubaneMediaOptimizer.createZipPackage([]),
      /Cannot create ZIP: no items provided/
    );
  });

  await test('Robustesse : rejet strict d’une image de 0 octet', async () => {
    await assert.rejects(
      async () => await BoubaneMediaOptimizer.compressImage({ name: 'empty.jpg', size: 0 }),
      /Invalid input: image file is empty/
    );
  });

  await test('Robustesse : rejet d’un fichier texte ou non-image', async () => {
    await assert.rejects(
      async () => await BoubaneMediaOptimizer.compressImage({
        name: 'document.txt',
        type: 'text/plain',
        size: 50,
        buffer: Buffer.from('ceci est du texte')
      }),
      /Unsupported image format/
    );
  });

  // =========================================================================
  // BILAN FINAL D'EXÉCUTION
  // =========================================================================
  const duration = ((Date.now() - testStartTime) / 1000).toFixed(3);
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`  Tests exécutés : \x1b[1m${testsPassed + testsFailed}\x1b[0m`);
  console.log(`  Succès         : \x1b[32m${testsPassed}\x1b[0m`);
  console.log(`  Échecs         : ${testsFailed > 0 ? `\x1b[31m${testsFailed}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
  console.log(`  Durée          : ${duration}s`);
  console.log('───────────────────────────────────────────────────────────────────────────');

  if (testsFailed === 0) {
    console.log('  \x1b[32m✔ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (100%)\x1b[0m');
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
    process.exit(0);
  } else {
    console.log(`  \x1b[31m✖ ${testsFailed} TEST(S) EN ÉCHEC\x1b[0m`);
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
    process.exit(1);
  }
}

runTestSuite();
