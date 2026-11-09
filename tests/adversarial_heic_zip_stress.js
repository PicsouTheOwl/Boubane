/**
 * Adversarial Stress Test Suite: HEIC Detection, Magic Bytes, and ZIP Packaging
 * Boubane Media Optimizer Engine (scripts/media_optimizer.js)
 * 
 * Executed by m1_challenger_2 to stress-test adversarial assumptions and error boundaries.
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');

const BoubaneMediaOptimizer = require('../scripts/media_optimizer.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function recordTest(name, category, passed, details = {}) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m [${category}] ${name}`);
  } else {
    failedTests++;
    failures.push({ name, category, ...details });
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m [${category}] ${name}`);
    if (details.expected !== undefined && details.actual !== undefined) {
      console.log(`         Expected: \x1b[33m${JSON.stringify(details.expected)}\x1b[0m`);
      console.log(`         Actual:   \x1b[31m${JSON.stringify(details.actual)}\x1b[0m`);
    }
    if (details.reason) {
      console.log(`         Reason:   \x1b[35m${details.reason}\x1b[0m`);
    }
  }
}

// Helper to generate ISO Base Media File Format (ISOBMFF) ftyp boxes
function buildFtypBox(majorBrand, compatibleBrands = [], boxLength = null) {
  const compBufs = compatibleBrands.map(b => Buffer.from(b.padEnd(4).slice(0, 4), 'ascii'));
  const len = boxLength !== null ? boxLength : (16 + compBufs.length * 4);
  const buf = Buffer.alloc(len);
  buf.writeUInt32BE(len, 0);
  buf.write('ftyp', 4, 4, 'ascii');
  buf.write(majorBrand.padEnd(4).slice(0, 4), 8, 4, 'ascii');
  buf.writeUInt32BE(0, 12); // minor version
  for (let i = 0; i < compBufs.length; i++) {
    compBufs[i].copy(buf, 16 + i * 4);
  }
  return buf;
}

async function runAdversarialSuite() {
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;31m  Boubane Media Optimizer — Adversarial Stress Test Harness (m1_challenger_2)\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');

  // =========================================================================
  // SECTION 1: HEIC DETECTION & MAGIC BYTES ADVERSARIAL GENERATORS
  // =========================================================================
  console.log('\x1b[1;34m[1/3] Adversarial HEIC & Magic Bytes Detection\x1b[0m');

  // 1.1 Valid HEIC major brands
  for (const brand of ['heic', 'mif1', 'msf1', 'heix', 'hevc']) {
    const buf = buildFtypBox(brand, ['mif1']);
    const format = BoubaneMediaOptimizer.detectFormat({ name: `sample_${brand}.heic`, buffer: buf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: `sample_${brand}.heic`, buffer: buf });
    recordTest(`Valid HEIC major brand '${brand}'`, 'HEIC_MAGIC', format === 'heic' && isHeic === true, {
      expected: { format: 'heic', isHeic: true },
      actual: { format, isHeic }
    });
  }

  // 1.2 Valid HEIC via compatible brands list in offset 16..64
  {
    const buf = buildFtypBox('isom', ['mp42', 'mif1']); // major is generic isom, but mif1 is compatible
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'photo.heic', buffer: buf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'photo.heic', buffer: buf });
    recordTest('HEIC compatible brand in secondary offset (major=isom, comp=mif1)', 'HEIC_MAGIC', format === 'heic' && isHeic === true, {
      expected: { format: 'heic', isHeic: true },
      actual: { format, isHeic }
    });
  }

  // 1.3 Anti-falsification: Disguised JPEG named .heic
  {
    const jpegBuf = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'disguised_photo.heic', buffer: jpegBuf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'disguised_photo.heic', buffer: jpegBuf });
    recordTest('Anti-falsification: Disguised JPEG named .heic detected as JPEG', 'HEIC_MAGIC', format === 'jpeg' && isHeic === false, {
      expected: { format: 'jpeg', isHeic: false },
      actual: { format, isHeic }
    });
  }

  // 1.4 Anti-falsification: Disguised PNG named .heic
  {
    const pngBuf = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'disguised_photo.heic', buffer: pngBuf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'disguised_photo.heic', buffer: pngBuf });
    recordTest('Anti-falsification: Disguised PNG named .heic detected as PNG', 'HEIC_MAGIC', format === 'png' && isHeic === false, {
      expected: { format: 'png', isHeic: false },
      actual: { format, isHeic }
    });
  }

  // 1.5 Anti-falsification: Disguised WebP named .heic
  {
    const webpBuf = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x20, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'disguised_photo.heic', buffer: webpBuf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'disguised_photo.heic', buffer: webpBuf });
    recordTest('Anti-falsification: Disguised WebP named .heic detected as WebP', 'HEIC_MAGIC', format === 'webp' && isHeic === false, {
      expected: { format: 'webp', isHeic: false },
      actual: { format, isHeic }
    });
  }

  // 1.6 Adversarial: MP4 Video with ftyp isom/mp42 named .heic (should NOT be detected as HEIC)
  {
    const mp4Buf = buildFtypBox('isom', ['mp41', 'mp42']);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'clip.heic', buffer: mp4Buf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'clip.heic', buffer: mp4Buf });
    recordTest('Adversarial: MP4 video (ftyp isom) named .heic rejected from HEIC detection', 'HEIC_MAGIC', format !== 'heic' && isHeic === false, {
      expected: { format: 'unknown', isHeic: false },
      actual: { format, isHeic },
      reason: 'MP4 container has ftyp header but no HEIC compatible brands. Couche 3 fell through to file extension (.heic).'
    });
  }

  // 1.7 Adversarial: Pure text file named .heic
  {
    const textBuf = Buffer.from('Artisan devis toiture et charpente segre-en-anjou-bleu plain text content');
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'devis.heic', buffer: textBuf });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'devis.heic', buffer: textBuf });
    recordTest('Adversarial: Pure text file named .heic rejected from HEIC detection', 'HEIC_MAGIC', format === 'unknown' && isHeic === false, {
      expected: { format: 'unknown', isHeic: false },
      actual: { format, isHeic },
      reason: 'Binary buffer contains arbitrary non-image text. Couche 3 mismatch fell through to file extension.'
    });
  }

  // 1.8 Adversarial: Corrupted ftyp header (< 12 bytes: e.g. 8 bytes total)
  {
    const shortFtyp = Buffer.from([0x00, 0x00, 0x00, 0x08, 0x66, 0x74, 0x79, 0x70]);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'truncated.heic', buffer: shortFtyp });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'truncated.heic', buffer: shortFtyp });
    recordTest('Adversarial: Truncated ftyp header (<12 bytes) rejected from HEIC detection', 'HEIC_MAGIC', format === 'unknown' && isHeic === false, {
      expected: { format: 'unknown', isHeic: false },
      actual: { format, isHeic },
      reason: 'Truncated buffer (<12 bytes) skipped Couche 3 and fell through to extension.'
    });
  }

  // 1.9 Adversarial: Malformed ftyp box length (boxLength = 0, unknown brand)
  {
    const zeroBoxFtyp = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70, 0x78, 0x78, 0x78, 0x78]);
    const format = BoubaneMediaOptimizer.detectFormat({ name: 'malformed.heic', buffer: zeroBoxFtyp });
    const isHeic = BoubaneMediaOptimizer.isHeicFormat({ name: 'malformed.heic', buffer: zeroBoxFtyp });
    recordTest('Adversarial: Malformed ftyp box length (0) with unknown brand rejected', 'HEIC_MAGIC', format === 'unknown' && isHeic === false, {
      expected: { format: 'unknown', isHeic: false },
      actual: { format, isHeic },
      reason: 'Unknown brand xxxx in ftyp box fell through to extension.'
    });
  }

  // =========================================================================
  // SECTION 2: ZIP EXPORT & PACKAGING STRESS TESTS
  // =========================================================================
  console.log('\n\x1b[1;34m[2/3] ZIP Packaging & JSZip Robustness Tests\x1b[0m');

  // 2.1 Zero items: createZipPackage([]) must reject
  {
    let rejected = false;
    let errMsg = '';
    try {
      await BoubaneMediaOptimizer.createZipPackage([]);
    } catch (err) {
      rejected = true;
      errMsg = err.message;
    }
    recordTest('Zero items: createZipPackage([]) cleanly rejected', 'ZIP_EXPORT', rejected && errMsg.includes('no items provided'), {
      expected: 'Rejection with "Cannot create ZIP: no items provided"',
      actual: rejected ? `Rejected: "${errMsg}"` : 'Did not reject'
    });
  }

  // 2.2 Null items: createZipPackage(null) must reject
  {
    let rejected = false;
    try {
      await BoubaneMediaOptimizer.createZipPackage(null);
    } catch (_) {
      rejected = true;
    }
    recordTest('Null items: createZipPackage(null) cleanly rejected', 'ZIP_EXPORT', rejected);
  }

  // 2.3 Undefined items: createZipPackage(undefined) must reject
  {
    let rejected = false;
    try {
      await BoubaneMediaOptimizer.createZipPackage(undefined);
    } catch (_) {
      rejected = true;
    }
    recordTest('Undefined items: createZipPackage(undefined) cleanly rejected', 'ZIP_EXPORT', rejected);
  }

  // 2.4 downloadZipOrFallback([]) graceful zero count
  {
    const res = await BoubaneMediaOptimizer.downloadZipOrFallback([]);
    recordTest('downloadZipOrFallback([]) returns { mode: "zip", count: 0 } gracefully', 'ZIP_EXPORT',
      res && res.mode === 'zip' && res.count === 0, {
        expected: { mode: 'zip', count: 0 },
        actual: res
      });
  }

  // 2.5 Single item: binary ZIP magic bytes (0x50, 0x4B, 0x03, 0x04)
  {
    const single = [{
      seoName: 'couvreur-segre-chantier-01.webp',
      newSize: 45000,
      data: Buffer.alloc(45000, 0x33)
    }];
    const zipBuf = await BoubaneMediaOptimizer.createZipPackage(single);
    const hasValidHeader = zipBuf[0] === 0x50 && zipBuf[1] === 0x4B && zipBuf[2] === 0x03 && zipBuf[3] === 0x04;

    const tmpPath = path.resolve(__dirname, 'temp_single_test.zip');
    fs.writeFileSync(tmpPath, zipBuf);
    let unzipPass = false;
    try {
      const out = execSync(`unzip -t "${tmpPath}"`).toString();
      unzipPass = out.includes('No errors detected');
    } catch (_) {
      unzipPass = false;
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }

    recordTest('Single item: Valid PK\\x03\\x04 magic bytes and unzip CRC verification', 'ZIP_EXPORT',
      hasValidHeader && unzipPass, {
        expected: 'PK\\x03\\x04 header and clean unzip -t verification',
        actual: `Header: [0x${zipBuf[0].toString(16)}, 0x${zipBuf[1].toString(16)}, 0x${zipBuf[2].toString(16)}, 0x${zipBuf[3].toString(16)}], UnzipPass: ${unzipPass}`
      });
  }

  // 2.6 Large batch: 50 items stress packaging
  {
    const batch50 = Array.from({ length: 50 }, (_, i) => ({
      seoName: `artisan-segre-chantier-${String(i + 1).padStart(2, '0')}.webp`,
      newSize: 2000 + (i * 300),
      data: Buffer.alloc(2000 + (i * 300), (i * 13) & 0xFF)
    }));

    const zip50Buf = await BoubaneMediaOptimizer.createZipPackage(batch50);
    const hasValidHeader = zip50Buf[0] === 0x50 && zip50Buf[1] === 0x4B && zip50Buf[2] === 0x03 && zip50Buf[3] === 0x04;

    const tmpPath = path.resolve(__dirname, 'temp_batch50_test.zip');
    fs.writeFileSync(tmpPath, zip50Buf);
    let unzip50Pass = false;
    let fileCount50 = 0;
    try {
      const tOut = execSync(`unzip -t "${tmpPath}"`).toString();
      unzip50Pass = tOut.includes('No errors detected');
      const lOut = execSync(`unzip -l "${tmpPath}"`).toString();
      const match = lOut.match(/(\d+)\s+files/);
      fileCount50 = match ? parseInt(match[1], 10) : 0;
    } catch (_) {
      unzip50Pass = false;
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }

    recordTest('Large batch: 50 items packaged with CRC-32 integrity and complete EOCD directory', 'ZIP_EXPORT',
      hasValidHeader && unzip50Pass && fileCount50 === 50, {
        expected: '50 files verified with unzip -t without CRC or header corruption',
        actual: `HeaderValid: ${hasValidHeader}, UnzipPass: ${unzip50Pass}, FileCount: ${fileCount50}`
      });
  }

  // 2.7 Special characters in filenames
  {
    const specialItems = [
      { seoName: 'couvreur-segre-chateau-renovee-01.webp', data: Buffer.from('data1') },
      { seoName: 'plombier-espace-segre-02.webp', data: Buffer.from('data2') },
      { seoName: 'chantier-accents-éèà-03.webp', data: Buffer.from('data3') },
      { seoName: 'chantier-ligature-œ-æ-04.webp', data: Buffer.from('data4') },
      { seoName: 'chantier-symbols-(100%)-[test]-05.webp', data: Buffer.from('data5') }
    ];

    const zipSpecialBuf = await BoubaneMediaOptimizer.createZipPackage(specialItems);
    const tmpPath = path.resolve(__dirname, 'temp_special_test.zip');
    fs.writeFileSync(tmpPath, zipSpecialBuf);
    let unzipSpecialPass = false;
    try {
      const tOut = execSync(`unzip -t "${tmpPath}"`).toString();
      unzipSpecialPass = tOut.includes('No errors detected');
    } catch (_) {
      unzipSpecialPass = false;
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }

    recordTest('Special characters in ZIP filenames: standard unzip integrity preserved', 'ZIP_EXPORT',
      unzipSpecialPass, {
        expected: 'unzip -t reports No errors detected',
        actual: `UnzipPass: ${unzipSpecialPass}`
      });
  }

  // =========================================================================
  // SECTION 3: ERROR BOUNDARIES & INPUT VALIDATION IN COMPRESSIMAGE
  // =========================================================================
  console.log('\n\x1b[1;34m[3/3] Error Boundaries & Graceful Fallbacks (compressImage)\x1b[0m');

  // 3.1 Null input
  {
    let rejected = false;
    let errMsg = '';
    try {
      await BoubaneMediaOptimizer.compressImage(null);
    } catch (err) {
      rejected = true;
      errMsg = err.message;
    }
    recordTest('compressImage(null) rejected with descriptive error', 'ERROR_BOUNDARIES',
      rejected && errMsg.includes('no file provided'), {
        expected: 'Rejection with "Invalid input: no file provided"',
        actual: rejected ? `Rejected: "${errMsg}"` : 'Did not reject'
      });
  }

  // 3.2 Undefined input
  {
    let rejected = false;
    try {
      await BoubaneMediaOptimizer.compressImage(undefined);
    } catch (err) {
      rejected = true;
    }
    recordTest('compressImage(undefined) rejected with descriptive error', 'ERROR_BOUNDARIES', rejected);
  }

  // 3.3 0-byte file object
  {
    let rejected = false;
    let errMsg = '';
    try {
      await BoubaneMediaOptimizer.compressImage({ name: 'empty.jpg', size: 0 });
    } catch (err) {
      rejected = true;
      errMsg = err.message;
    }
    recordTest('compressImage({ size: 0 }) rejected with descriptive error', 'ERROR_BOUNDARIES',
      rejected && errMsg.includes('empty'), {
        expected: 'Rejection with "Invalid input: image file is empty (0 bytes)"',
        actual: rejected ? `Rejected: "${errMsg}"` : 'Did not reject'
      });
  }

  // 3.4 Empty Blob instance
  {
    let rejected = false;
    let errMsg = '';
    try {
      await BoubaneMediaOptimizer.compressImage(new Blob([]));
    } catch (err) {
      rejected = true;
      errMsg = err.message;
    }
    recordTest('compressImage(new Blob([])) rejected with descriptive error', 'ERROR_BOUNDARIES',
      rejected && errMsg.includes('empty'), {
        expected: 'Rejection with "Invalid input: image file is empty (0 bytes)"',
        actual: rejected ? `Rejected: "${errMsg}"` : 'Did not reject'
      });
  }

  // 3.5 Empty generic object `{}` (Must NOT silently succeed by defaulting size to 150000)
  {
    let rejected = false;
    let result = null;
    try {
      result = await BoubaneMediaOptimizer.compressImage({});
    } catch (_) {
      rejected = true;
    }
    recordTest('compressImage({}) empty object rejected (not silently synthesised)', 'ERROR_BOUNDARIES', rejected, {
      expected: 'Rejection due to missing image payload or invalid input',
      actual: rejected ? 'Rejected' : `Silently succeeded returning synthetic WebP (size: ${result ? result.newSize : 0})`,
      reason: 'Empty object {} defaults size to 150000 and falls through validation checks into simulation branch.'
    });
  }

  // 3.6 String input instead of File/Blob object
  {
    let rejected = false;
    let result = null;
    try {
      result = await BoubaneMediaOptimizer.compressImage('artisan.jpg');
    } catch (_) {
      rejected = true;
    }
    recordTest('compressImage("string") non-object input rejected', 'ERROR_BOUNDARIES', rejected, {
      expected: 'Rejection due to invalid input type (string instead of File/Blob/Descriptor)',
      actual: rejected ? 'Rejected' : `Silently succeeded returning synthetic WebP`,
      reason: 'String input was accepted, treated as filename, and processed without binary payload.'
    });
  }

  // 3.7 Unreadable descriptor without buffer or size
  {
    let rejected = false;
    let result = null;
    try {
      result = await BoubaneMediaOptimizer.compressImage({ name: 'chantier.jpg' });
    } catch (_) {
      rejected = true;
    }
    recordTest('compressImage({ name: "chantier.jpg" }) with no buffer/size rejected', 'ERROR_BOUNDARIES', rejected, {
      expected: 'Rejection due to missing data/buffer',
      actual: rejected ? 'Rejected' : `Silently succeeded returning synthetic WebP`,
      reason: 'Missing buffer/size defaults to 150000 and bypasses format check because extension is .jpg.'
    });
  }

  // 3.8 Disguised plain text file named .heic
  {
    let rejected = false;
    let result = null;
    try {
      result = await BoubaneMediaOptimizer.compressImage({
        name: 'notes.heic',
        buffer: Buffer.from('This is a plain text file pretending to be an iPhone HEIC photo.')
      });
    } catch (_) {
      rejected = true;
    }
    recordTest('compressImage with text buffer named .heic rejected', 'ERROR_BOUNDARIES', rejected, {
      expected: 'Rejection with "Unsupported image format" or decode failure',
      actual: rejected ? 'Rejected' : `Silently succeeded returning synthetic WebP (size: ${result ? result.newSize : 0})`,
      reason: 'detectFormat classifies text buffer as heic due to extension fall-through; compressImage accepts it.'
    });
  }

  // 3.9 Disguised plain text file named .jpg
  {
    let rejected = false;
    let result = null;
    try {
      result = await BoubaneMediaOptimizer.compressImage({
        name: 'devis.jpg',
        buffer: Buffer.from('This is a plain text devis pretending to be a JPG image.')
      });
    } catch (_) {
      rejected = true;
    }
    recordTest('compressImage with text buffer named .jpg rejected', 'ERROR_BOUNDARIES', rejected, {
      expected: 'Rejection with "Unsupported image format" or decode failure',
      actual: rejected ? 'Rejected' : `Silently succeeded returning synthetic WebP`,
      reason: 'detectFormat classifies text buffer as jpeg due to extension fall-through; compressImage accepts it.'
    });
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`  Adversarial Tests Executed : \x1b[1m${totalTests}\x1b[0m`);
  console.log(`  Passed                     : \x1b[32m${passedTests}\x1b[0m`);
  console.log(`  Failed / Vulnerabilities   : \x1b[31m${failedTests}\x1b[0m`);
  console.log('───────────────────────────────────────────────────────────────────────────');

  if (failedTests > 0) {
    console.log(`  \x1b[1;31mVERDICT: REQUEST_CHANGES (${failedTests} vulnerability finding(s))\x1b[0m`);
  } else {
    console.log('  \x1b[1;32mVERDICT: APPROVE (100% Robust)\x1b[0m');
  }
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');

  return { totalTests, passedTests, failedTests, failures };
}

if (require.main === module) {
  runAdversarialSuite().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = { runAdversarialSuite, buildFtypBox };
