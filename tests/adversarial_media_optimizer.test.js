/**
 * Adversarial Stress & Verification Test Suite for Boubane Media Optimizer
 * 
 * Challenger: m1_challenger_1
 * Target: scripts/media_optimizer.js
 * 
 * Adversarial Dimensions:
 * 1. Extreme Aspect Ratios & Homothetic Preservation (50:1, 1:50, 8000x6000, 1x1, 10000:1)
 * 2. High Entropy Synthetic Noise & Strict < 80 KB Bound (Chrome Canvas & Node)
 * 3. Exotic Diacritic, Ligature & Bizarre SEO Slugification Stress
 * 4. Burst Queue Concurrency Limit & Memory Stability (20 jobs burst, max concurrency <= 2)
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

const optimizerPath = path.resolve(__dirname, '../scripts/media_optimizer.js');
const BoubaneMediaOptimizer = require(optimizerPath);

const REPORT = {
  timestamp: new Date().toISOString(),
  target: optimizerPath,
  totalTests: 0,
  passed: 0,
  failed: 0,
  findings: []
};

function recordPass(suite, name, details = '') {
  REPORT.totalTests++;
  REPORT.passed++;
  console.log(`  \x1b[32m✔\x1b[0m [${suite}] ${name}${details ? ` (${details})` : ''}`);
}

function recordFail(suite, name, error, details = '') {
  REPORT.totalTests++;
  REPORT.failed++;
  REPORT.findings.push({ suite, name, error: error.message || String(error), details });
  console.log(`  \x1b[31m✖\x1b[0m [${suite}] ${name}`);
  console.log(`    \x1b[31mError: ${error.message || error}\x1b[0m`);
  if (details) console.log(`    \x1b[33mDetails: ${details}\x1b[0m`);
}

// =========================================================================
// SUITE 1: EXTREME ASPECT RATIOS & HOMOTHETIC PRESERVATION
// =========================================================================
async function testExtremeAspectRatios() {
  console.log('\n\x1b[1;34m[SUITE 1/4] Extreme Aspect Ratios & Homothetic Preservation\x1b[0m');

  const cases = [
    { name: '50:1 Extreme Panorama', origW: 5000, origH: 100, maxDim: 1400 },
    { name: '1:50 Extreme Sliver (Vertical Strip)', origW: 100, origH: 5000, maxDim: 1400 },
    { name: '8000x6000 Ultra-High Resolution (48 MP)', origW: 8000, origH: 6000, maxDim: 1400 },
    { name: '1x1 Single Pixel Edge Case', origW: 1, origH: 1, maxDim: 1400 },
    { name: '10000x1 Ultra-Thin Horizontal Filament', origW: 10000, origH: 1, maxDim: 1400 },
    { name: '1x10000 Ultra-Thin Vertical Filament', origW: 1, origH: 10000, maxDim: 1400 },
    { name: 'Square 5000x5000 Large Format', origW: 5000, origH: 5000, maxDim: 1280 },
    { name: 'Already Small (400x300) — No Upscaling Allowed', origW: 400, origH: 300, maxDim: 1400 }
  ];

  for (const c of cases) {
    try {
      const res = BoubaneMediaOptimizer.calculateResponsiveDimensions(c.origW, c.origH, c.maxDim);
      const inputAspect = c.origW / c.origH;
      const outputAspect = res.width / res.height;

      // Discrete raster limitation: if theoretical target dimension < 0.5 px, it is clamped to 1 px
      const isDiscreteClamped = (Math.min(c.origW, c.origH) * c.maxDim / Math.max(c.origW, c.origH)) < 0.5;
      const relError = Math.abs(inputAspect - outputAspect) / inputAspect;
      if (!isDiscreteClamped) {
        assert.ok(
          relError <= 0.01,
          `Aspect ratio altered: expected ${inputAspect.toFixed(4)}, got ${outputAspect.toFixed(4)} (rel error ${(relError*100).toFixed(2)}%)`
        );
      } else {
        // Must clamp to exactly 1 pixel and avoid 0 px
        assert.equal(Math.min(res.width, res.height), 1, 'Sub-pixel dimension must clamp to exactly 1 pixel');
      }

      // Verify max dimension boundary
      assert.ok(
        Math.max(res.width, res.height) <= Math.max(c.maxDim, Math.max(c.origW, c.origH)),
        `Output dimensions ${res.width}x${res.height} exceed allowed bound`
      );

      // Verify no upscale for small images
      if (Math.max(c.origW, c.origH) <= c.maxDim) {
        assert.equal(res.width, c.origW, `Small image was upscaled in width`);
        assert.equal(res.height, c.origH, `Small image was upscaled in height`);
        assert.equal(res.scale, 1.0, `Scale for small image should be 1.0`);
      }

      recordPass(
        'ASPECT_RATIO',
        c.name,
        `in: ${c.origW}x${c.origH} -> out: ${res.width}x${res.height}, ratio: ${outputAspect.toFixed(3)}`
      );
    } catch (err) {
      recordFail('ASPECT_RATIO', c.name, err);
    }
  }

  // Stress invalid/adversarial dimension inputs
  const invalidDimensions = [
    { w: 0, h: 100 },
    { w: 100, h: 0 },
    { w: -50, h: 100 },
    { w: 100, h: -50 },
    { w: NaN, h: 100 },
    { w: 100, h: null }
  ];

  for (const inv of invalidDimensions) {
    try {
      BoubaneMediaOptimizer.calculateResponsiveDimensions(inv.w, inv.h, 1400);
      recordFail('ASPECT_RATIO', `Invalid dimensions (${inv.w}x${inv.h}) should throw`, new Error('Did not throw'));
    } catch (_) {
      recordPass('ASPECT_RATIO', `Invalid dimensions (${inv.w}x${inv.h}) properly rejected`);
    }
  }
}

// =========================================================================
// SUITE 2: EXOTIC DIACRITIC SLUGIFICATION & SEO NOMENCLATURE
// =========================================================================
async function testExoticDiacriticsAndSlugification() {
  console.log('\n\x1b[1;34m[SUITE 2/4] Exotic Diacritic Slugification & SEO Nomenclature\x1b[0m');

  const slugCases = [
    {
      name: 'All standard French accents (lower + upper)',
      input: 'Ébénisterie Échafaudage À Ô Île Être Ça Déjà Où Mûr',
      expected: 'ebenisterie-echafaudage-a-o-ile-etre-ca-deja-ou-mur'
    },
    {
      name: 'Ligatures françaises œ / Œ and æ / Æ',
      input: 'Œuvre de cœur et curriculum vitæ en ex æquo',
      expected: 'oeuvre-de-coeur-et-curriculum-vitae-en-ex-aequo'
    },
    {
      name: 'Heavy punctuation, typographic quotes and em-dashes',
      input: '« L’Artisan — Maçon & Fils : 100% Qualité… »',
      expected: 'l-artisan-macon-fils-100-qualite'
    },
    {
      name: 'Non-breaking spaces, zero-width spaces and multi-tabs',
      input: "Rénovation\t\ttoiture\u00A0Segré\u200Bbleu\nAnjou",
      expected: 'renovation-toiture-segre-bleu-anjou'
    },
    {
      name: 'High density emojis string',
      input: '🔨🏠✨🔥 Super Chantier BTP Segré 🚀🏗️',
      expected: 'super-chantier-btp-segre'
    },
    {
      name: 'Non-Latin alphabet (Cyrillic + Greek) clean stripping',
      input: 'Плиточник Студия Ремонт Ελληνικά Artisan',
      expected: 'artisan'
    },
    {
      name: 'Excessive leading, trailing, and internal hyphens',
      input: '----Pose---De---Velux-------Double---Vitrage----',
      expected: 'pose-de-velux-double-vitrage'
    },
    {
      name: 'Falsy and non-string inputs safety',
      inputs: [null, undefined, '', 12345, true, false, {}, []],
      expected: ''
    }
  ];

  for (const c of slugCases) {
    try {
      if (c.inputs) {
        for (const input of c.inputs) {
          const res = BoubaneMediaOptimizer.slugify(input);
          assert.equal(res, c.expected, `Input ${JSON.stringify(input)} produced "${res}"`);
        }
        recordPass('SLUGIFY', c.name, 'All falsy/non-string inputs cleanly returned empty string');
      } else {
        const res = BoubaneMediaOptimizer.slugify(c.input);
        assert.equal(res, c.expected);
        recordPass('SLUGIFY', c.name, `"${res}"`);
      }
    } catch (err) {
      recordFail('SLUGIFY', c.name, err);
    }
  }

  // Test SEO filename generator
  const filenameCases = [
    {
      metier: 'Couvreur Zingueur',
      ville: 'Segré-en-Anjou Bleu',
      chantier: 'Rénovation Toiture Ardoise',
      index: 1,
      expected: 'couvreur-zingueur-segre-en-anjou-bleu-renovation-toiture-ardoise-01.webp'
    },
    {
      metier: 'Plâtrier Peintre',
      ville: 'Château-Gontier-sur-Mayenne',
      chantier: 'enduit-chaux.jpeg', // existing extension should be stripped
      index: 8,
      expected: 'platrier-peintre-chateau-gontier-sur-mayenne-enduit-chaux-08.webp'
    },
    {
      metier: 'Électricien',
      ville: 'Nantes',
      chantier: 'Mise aux normes',
      index: 99,
      expected: 'electricien-nantes-mise-aux-normes-99.webp'
    },
    {
      metier: 'Menuisier',
      ville: 'Angers',
      chantier: 'Escalier Chêne',
      index: 104,
      expected: 'menuisier-angers-escalier-chene-104.webp'
    },
    {
      metier: '',
      ville: null,
      chantier: undefined,
      index: -5,
      expected: 'artisan-segre-chantier-01.webp'
    }
  ];

  for (const c of filenameCases) {
    try {
      const res = BoubaneMediaOptimizer.generateSeoFilename(c.metier, c.ville, c.chantier, c.index);
      assert.equal(res, c.expected);
      recordPass('SEO_NAMING', `generateSeoFilename index ${c.index}`, res);
    } catch (err) {
      recordFail('SEO_NAMING', `generateSeoFilename error for ${c.metier}`, err);
    }
  }
}

// =========================================================================
// SUITE 3: BURST QUEUE CONCURRENCY & MEMORY STRESS
// =========================================================================
async function testBurstQueueConcurrency() {
  console.log('\n\x1b[1;34m[SUITE 3/4] Burst Queue Concurrency & Memory Stability\x1b[0m');

  const BURST_COUNT = 20;
  const CONCURRENCY_LIMIT = 2;
  const queue = new BoubaneMediaOptimizer.BatchOptimizerQueue({ concurrency: CONCURRENCY_LIMIT });

  for (let i = 0; i < BURST_COUNT; i++) {
    queue.add(
      { name: `chantier_adversarial_${i}.jpg`, size: 250000 },
      { metier: 'artisan', ville: 'segre', chantier: `chantier-${i}`, index: i + 1 }
    );
  }

  let currentActive = 0;
  let maxObservedActive = 0;
  const timeline = [];

  try {
    const batchResult = await queue.run(async (file, opts, idx) => {
      currentActive++;
      if (currentActive > maxObservedActive) maxObservedActive = currentActive;
      timeline.push({ idx, start: Date.now(), active: currentActive });

      // Simulated jitter: 5ms to 25ms, inject intentional errors on tasks #5 and #12
      const jitter = Math.floor(Math.random() * 20) + 5;
      await new Promise(res => setTimeout(res, jitter));

      currentActive--;
      timeline.push({ idx, end: Date.now(), active: currentActive });

      if (idx === 5 || idx === 12) {
        throw new Error(`Injected adversarial task failure at index ${idx}`);
      }

      return {
        seoName: `artisan-segre-chantier-${String(idx + 1).padStart(2, '0')}.webp`,
        newSize: 42000,
        originalSize: file.size,
        blobUrl: `blob:mock-uuid-${idx}`
      };
    });

    // 1. Verify concurrency limit strictly held
    assert.ok(
      maxObservedActive <= CONCURRENCY_LIMIT,
      `Concurrency violated: max active was ${maxObservedActive}, expected <= ${CONCURRENCY_LIMIT}`
    );
    recordPass('BURST_CONCURRENCY', `Max active concurrency <= ${CONCURRENCY_LIMIT}`, `Observed max: ${maxObservedActive}`);

    // 2. Verify all tasks processed
    assert.equal(batchResult.totalCount, BURST_COUNT, `Expected total ${BURST_COUNT}, got ${batchResult.totalCount}`);
    assert.equal(batchResult.successCount, BURST_COUNT - 2, `Expected 18 successes, got ${batchResult.successCount}`);
    assert.equal(batchResult.errorCount, 2, `Expected 2 errors, got ${batchResult.errorCount}`);
    recordPass('BURST_CONCURRENCY', `All ${BURST_COUNT} items processed with error tolerance`, `18 ok, 2 errors`);

    // 3. Verify URL registration and memory cleanup
    assert.equal(queue.registeredUrls.size, 18, `Expected 18 registered URLs, got ${queue.registeredUrls.size}`);
    queue.revokeAllUrls();
    assert.equal(queue.registeredUrls.size, 0, `Expected 0 URLs after revokeAllUrls`);
    recordPass('BURST_CONCURRENCY', 'Blob URL registration & cleanup', 'All 18 URLs registered and revoked');

  } catch (err) {
    recordFail('BURST_CONCURRENCY', 'Batch queue burst execution', err);
  }
}

// =========================================================================
// SUITE 4: HIGH-ENTROPY NOISE & REAL BROWSER CANVAS WEBP STRESS
// =========================================================================
async function testHighEntropyNoiseInBrowser() {
  console.log('\n\x1b[1;34m[SUITE 4/4] High-Entropy Synthetic Noise & Strict < 80 KB Compliance\x1b[0m');

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) {
    console.log('  \x1b[33m- Headless Google Chrome not detected, skipping live Canvas tests\x1b[0m');
    return;
  }

  // Create an ephemeral HTTP server to orchestrate real Chrome headless test
  return new Promise((resolve) => {
    let chromeProc = null;
    const server = http.createServer((req, res) => {
      if (req.url === '/media_optimizer.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        return res.end(fs.readFileSync(optimizerPath));
      }

      if (req.url === '/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ received: true }));

          const data = JSON.parse(body);
          if (chromeProc) chromeProc.kill();
          server.close();

          for (const item of data) {
            if (item.under80k) {
              recordPass(
                'BROWSER_CANVAS',
                item.name,
                `size: ${item.newSize} B (${(item.newSize/1024).toFixed(1)} KB), dims: ${item.width}x${item.height}, attempts: ${item.attempts}`
              );
            } else {
              recordFail(
                'BROWSER_CANVAS',
                item.name,
                new Error(`Size ${item.newSize} B exceeds strict 80 KB limit (target: ${item.targetMaxBytes} B)`),
                `Output was ${(item.newSize/1024).toFixed(1)} KB (> 80 KB)! Dims: ${item.width}x${item.height}, attempts: ${item.attempts}, quality: ${item.qualityUsed}`
              );
            }
          }

          resolve();
        });
        return;
      }

      // Serve test harness HTML
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Adversarial Chrome Canvas Test</title></head>
<body>
<script src="/media_optimizer.js"></script>
<script>
async function runAdversarialBrowserSuite() {
  const optimizer = window.BoubaneMediaOptimizer;
  const testResults = [];

  // TEST CASE A: Smooth construction photo simulation (easy compression)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1600, 1200);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1200);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
    const file = new File([blob], 'gradient.jpg', { type: 'image/jpeg' });
    const res = await optimizer.compressImage(file, { metier: 'peintre', ville: 'segre', chantier: 'facade' });
    testResults.push({
      name: 'Smooth Gradient 1600x1200 (Baseline Construction)',
      newSize: res.newSize,
      targetMaxBytes: optimizer.CONFIG.TARGET_MAX_BYTES,
      under80k: res.newSize <= optimizer.CONFIG.TARGET_MAX_BYTES,
      width: res.width,
      height: res.height,
      attempts: res.attempts,
      qualityUsed: res.qualityUsed
    });
  }

  // TEST CASE B: Extreme High-Entropy Synthetic Noise (1400x1400 pure random RGB)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(1400, 1400);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = Math.floor(Math.random() * 256);
      imgData.data[i+1] = Math.floor(Math.random() * 256);
      imgData.data[i+2] = Math.floor(Math.random() * 256);
      imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
    const file = new File([blob], 'high_entropy_noise.jpg', { type: 'image/jpeg' });
    const res = await optimizer.compressImage(file, { metier: 'couvreur', ville: 'segre', chantier: 'ardoise-bruit' });
    testResults.push({
      name: 'High-Entropy Synthetic Noise 1400x1400 (Stress Test)',
      newSize: res.newSize,
      targetMaxBytes: optimizer.CONFIG.TARGET_MAX_BYTES,
      under80k: res.newSize <= optimizer.CONFIG.TARGET_MAX_BYTES,
      width: res.width,
      height: res.height,
      attempts: res.attempts,
      qualityUsed: res.qualityUsed
    });
  }

  // TEST CASE C: High-Frequency Checkerboard Pattern (Micro-Texture / Gravel / Brickwork)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(1000, 1000);
    for (let y = 0; y < 1000; y++) {
      for (let x = 0; x < 1000; x++) {
        const idx = (y * 1000 + x) * 4;
        const val = ((x ^ y) & 4) ? 255 : 0;
        imgData.data[idx] = val;
        imgData.data[idx+1] = val;
        imgData.data[idx+2] = val;
        imgData.data[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
    const file = new File([blob], 'checkerboard.jpg', { type: 'image/jpeg' });
    const res = await optimizer.compressImage(file, { metier: 'macon', ville: 'segre', chantier: 'gravier' });
    testResults.push({
      name: 'High-Frequency Micro-Texture 1000x1000 (Checkerboard)',
      newSize: res.newSize,
      targetMaxBytes: optimizer.CONFIG.TARGET_MAX_BYTES,
      under80k: res.newSize <= optimizer.CONFIG.TARGET_MAX_BYTES,
      width: res.width,
      height: res.height,
      attempts: res.attempts,
      qualityUsed: res.qualityUsed
    });
  }

  // Report back to Node runner
  fetch('/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testResults)
  });
}
runAdversarialBrowserSuite();
</script>
</body>
</html>`);
    });

    const PORT = 9055;
    server.listen(PORT, () => {
      chromeProc = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        `http://localhost:${PORT}/`
      ]);
    });
  });
}

// =========================================================================
// MAIN RUNNER
// =========================================================================
async function runAll() {
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;35m  Adversarial Challenge Runner — Boubane Media Optimizer Engine\x1b[0m');
  console.log(`  Source: \x1b[33m${optimizerPath}\x1b[0m`);
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');

  await testExtremeAspectRatios();
  await testExoticDiacriticsAndSlugification();
  await testBurstQueueConcurrency();
  await testHighEntropyNoiseInBrowser();

  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1m  CHALLENGE REPORT SUMMARY\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`  Total Adversarial Checks : ${REPORT.totalTests}`);
  console.log(`  Passed                   : \x1b[32m${REPORT.passed}\x1b[0m`);
  console.log(`  Failed                   : \x1b[31m${REPORT.failed}\x1b[0m`);

  if (REPORT.findings.length > 0) {
    console.log('\n  \x1b[1;31mCONFIRMED VULNERABILITIES / FAILURES:\x1b[0m');
    for (const f of REPORT.findings) {
      console.log(`  - [${f.suite}] ${f.name}`);
      console.log(`    Error   : ${f.error}`);
      if (f.details) console.log(`    Details : ${f.details}`);
    }
    console.log('\n  \x1b[1;31mFINAL VERDICT: REQUEST_CHANGES\x1b[0m');
  } else {
    console.log('\n  \x1b[1;32mFINAL VERDICT: APPROVE\x1b[0m');
  }
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
}

runAll().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
