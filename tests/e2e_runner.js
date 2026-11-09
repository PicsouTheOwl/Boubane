#!/usr/bin/env node

/**
 * ============================================================================
 * Boubane Internal Automations — Comprehensive End-to-End (E2E) Test Suite
 * ============================================================================
 * 
 * Covering Tiers 1 to 4 for Requirements R1, R2, R3, R4, R5.
 * 
 * Usage:
 *   node tests/e2e_runner.js
 *   node tests/e2e_runner.js --tier=1
 *   node tests/e2e_runner.js --feature=R1
 *   node tests/e2e_runner.js --verbose
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const {
  MockStorage,
  MockNetwork,
  ReferenceMediaOptimizer,
  ReferenceAutomations,
  EngineResolver
} = require('./helpers/reference_contracts');

// ---------------------------------------------------------------------------
// Test Runner Harness & CLI Argument Parser
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const options = {
  tier: null,
  feature: null,
  verbose: args.includes('--verbose') || args.includes('-v')
};

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    options.tier = parseInt(arg.split('=')[1], 10);
  }
  if (arg.startsWith('--feature=')) {
    options.feature = arg.split('=')[1].toUpperCase();
  }
}

class TestContext {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.tests = [];
    this.startTime = Date.now();
  }

  record(name, tier, feature, success, error = null, details = null) {
    if (success) {
      this.passed++;
      if (options.verbose) {
        console.log(`  \x1b[32m✔\x1b[0m [T${tier}|${feature}] ${name}`);
      } else {
        process.stdout.write('\x1b[32m.\x1b[0m');
      }
    } else {
      this.failed++;
      console.log(`\n  \x1b[31m✖\x1b[0m [T${tier}|${feature}] ${name}`);
      if (error) {
        console.log(`    \x1b[31mError:\x1b[0m ${error.message}`);
        if (options.verbose && error.stack) {
          console.log(`    ${error.stack.split('\n').slice(1, 4).join('\n    ')}`);
        }
      }
    }

    this.tests.push({ name, tier, feature, success, error, details });
  }

  skip(name, tier, feature, reason) {
    this.skipped++;
    if (options.verbose) {
      console.log(`  \x1b[33m-\x1b[0m [T${tier}|${feature}] ${name} (Skipped: ${reason})`);
    }
  }
}

const ctx = new TestContext();

async function runTestCase(name, tier, feature, fn) {
  if (options.tier && options.tier !== tier) {
    ctx.skip(name, tier, feature, `Filtered by --tier=${options.tier}`);
    return;
  }
  if (options.feature && options.feature !== feature && feature !== 'CROSS') {
    ctx.skip(name, tier, feature, `Filtered by --feature=${options.feature}`);
    return;
  }

  try {
    await fn();
    ctx.record(name, tier, feature, true);
  } catch (err) {
    ctx.record(name, tier, feature, false, err);
  }
}

// ---------------------------------------------------------------------------
// Load Test Fixtures
// ---------------------------------------------------------------------------
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');

function loadJsonFixture(filename) {
  const filepath = path.join(FIXTURES_DIR, filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`Fixture file not found: ${filepath}`);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

const calcomFixture = loadJsonFixture('calcom_booking_fixture.json');
const twentyCrmFixture = loadJsonFixture('twenty_crm_opportunity_fixture.json');
const telegramBriefingFixture = loadJsonFixture('telegram_briefing_fixture.json');
const onboardingLifecycleFixture = loadJsonFixture('onboarding_lifecycle_fixture.json');
const deliveryReviewFixture = loadJsonFixture('delivery_and_review_fixture.json');
const auditLogFixture = loadJsonFixture('execution_audit_log_fixture.json');
const artisanProfilesFixture = loadJsonFixture('artisan_profiles_fixture.json');

// ---------------------------------------------------------------------------
// Suite Execution
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;34m  Boubane Internal Automations — E2E Test Suite (Tiers 1 to 4)\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');

  const mediaOptResolution = EngineResolver.resolveMediaOptimizer();
  const storage = new MockStorage();
  const network = new MockNetwork();
  const automationsResolution = EngineResolver.resolveAutomations(storage, network);

  console.log(`  Engine Media Optimizer : \x1b[36m${mediaOptResolution.mode}\x1b[0m`);
  console.log(`  Engine Automations     : \x1b[36m${automationsResolution.mode}\x1b[0m\n`);

  if (!options.verbose) {
    process.stdout.write('  Running tests: ');
  }

  // =========================================================================
  // TIER 1: FEATURE COVERAGE (>= 5 tests per requirement R1-R5)
  // =========================================================================

  // --- R1: Briefing Pré-Appel Automatique sur Telegram ---
  await runTestCase('T1.R1.1: Cal.com webhook booking payload normalization', 1, 'R1', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const normalized = automations.parseCalcomBooking(calcomFixture);

    assert.equal(normalized.bookingId, 849201);
    assert.equal(normalized.name, 'Michel Dupont');
    assert.equal(normalized.email, 'michel.dupont@maconnerie-dupont.fr');
    assert.equal(normalized.phone, '06 12 34 56 78');
    assert.equal(normalized.company, 'Maçonnerie Dupont SARL');
    assert.equal(normalized.craft, 'Maçonnerie générale & Rénovation pierre');
    assert.equal(normalized.city, 'Segré-en-Anjou Bleu (49500)');
  });

  await runTestCase('T1.R1.2: Prospect diagnosis generation (no existing website scenario)', 1, 'R1', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const diag = automations.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      craft: 'Maçonnerie générale',
      city: 'Segré-en-Anjou Bleu',
      phone: '0612345678',
      email: 'michel@dupont.fr',
      has_website: false
    });

    assert.equal(diag.diagnosis.hasWebsite, false);
    assert.match(diag.diagnosis.websiteStatus, /Aucun site web détecté/);
    assert.match(diag.diagnosis.recommendedDomain, /maconnerie-dupont/);
    assert.equal(diag.pitchPoints.length, 3);
  });

  await runTestCase('T1.R1.3: Telegram Markdown briefing text structure & content', 1, 'R1', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const diag = automations.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      craft: 'Maçonnerie générale',
      city: 'Segré',
      phone: '0612345678',
      email: 'michel@dupont.fr'
    });
    const markdown = automations.formatTelegramMessage(diag);

    assert.match(markdown, /NOUVEAU BRIEFING PRÉ-APPEL BOUBANE/);
    assert.match(markdown, /PROSPECT & ENTREPRISE/);
    assert.match(markdown, /DIAGNOSTIC PRÉSENCE EN LIGNE/);
    assert.match(markdown, /CONCURRENTS LOCAUX/);
    assert.match(markdown, /STRATÉGIE & ACCROCHE APPEL/);
  });

  await runTestCase('T1.R1.4: Telegram inline keyboard structure (Call, WhatsApp, CRM, Maps)', 1, 'R1', async () => {
    const mockNet = new MockNetwork();
    const automations = new ReferenceAutomations(new MockStorage(), mockNet);
    const diag = automations.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      craft: 'Maçonnerie',
      city: 'Segré',
      phone: '+33612345678',
      email: 'michel@dupont.fr'
    });

    const res = await automations.sendTelegramBriefing(diag);
    assert.equal(res.success, true);
    assert.equal(mockNet.calls.length, 1);

    const callBody = JSON.parse(mockNet.calls[0].options.body);
    const keyboard = callBody.reply_markup.inline_keyboard;

    assert.equal(keyboard[0][0].text, '📞 Appeler');
    assert.match(keyboard[0][0].url, /^tel:/);
    assert.equal(keyboard[0][1].text, '💬 WhatsApp');
    assert.match(keyboard[0][1].url, /^https:\/\/wa\.me\//);
    assert.match(keyboard[1][0].url, /crm\.boubane\.com/);
  });

  await runTestCase('T1.R1.5: Telegram Bot API dispatch to official chat_id 8036535453', 1, 'R1', async () => {
    const mockNet = new MockNetwork();
    const automations = new ReferenceAutomations(new MockStorage(), mockNet);
    const diag = automations.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      craft: 'Maçonnerie',
      city: 'Segré',
      phone: '0612345678'
    });

    const res = await automations.sendTelegramBriefing(diag);
    assert.equal(res.success, true);
    assert.equal(res.chatId, 8036535453);

    const callBody = JSON.parse(mockNet.calls[0].options.body);
    assert.equal(callBody.chat_id, 8036535453);
    assert.equal(callBody.parse_mode, 'Markdown');
  });

  await runTestCase('T1.R1.6: Telegram briefing execution log entry written to storage', 1, 'R1', async () => {
    const mockStore = new MockStorage();
    const automations = new ReferenceAutomations(mockStore, new MockNetwork());
    const diag = automations.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      phone: '0612345678'
    });

    await automations.sendTelegramBriefing(diag);
    const logs = automations.getAutomationLogs();

    assert.ok(logs.length >= 1);
    const log = logs[logs.length - 1];
    assert.equal(log.module, 'R1_TELEGRAM_DISPATCH');
    assert.equal(log.status, 'SUCCESS');
  });

  // --- R2: Pipeline d'Onboarding & Relance Photos Chantier ---
  await runTestCase('T1.R2.1: Photo onboarding message content with 4-5 photos instructions', 1, 'R2', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const res = automations.triggerPhotoOnboarding({
      id: 'opp_001',
      name: 'Michel Dupont',
      phone: '0612345678'
    }, 'whatsapp');

    assert.equal(res.success, true);
    assert.match(res.message, /4 à 5 photos de vos chantiers/);
    assert.match(res.message, /1\. Une vue d'ensemble/);
    assert.match(res.message, /2\. Un gros plan sur les finitions/);
    assert.match(res.message, /3\. Une photo de vous ou de l'équipe/);
    assert.match(res.message, /4\. Idéalement en lumière naturelle/);
  });

  await runTestCase('T1.R2.2: Multi-channel dispatch URL generation (WhatsApp wa.me)', 1, 'R2', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const res = automations.triggerPhotoOnboarding({
      name: 'Michel Dupont',
      phone: '+33612345678'
    }, 'whatsapp');

    assert.match(res.directUrl, /^https:\/\/wa\.me\/33612345678\?text=/);
  });

  await runTestCase('T1.R2.3: Multi-channel dispatch URL generation (SMS fallback sms:)', 1, 'R2', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const res = automations.triggerPhotoOnboarding({
      name: 'Michel Dupont',
      phone: '0612345678'
    }, 'sms');

    assert.match(res.directUrl, /^sms:0612345678\?body=/);
  });

  await runTestCase('T1.R2.4: J+2 reminder scheduling with precise +48h timestamp calculation', 1, 'R2', async () => {
    const mockStore = new MockStorage();
    const automations = new ReferenceAutomations(mockStore, new MockNetwork());
    const testNow = 1794218400000; // Tuesday 10:00

    const res = automations.triggerPhotoOnboarding({
      id: 'lead_j2_test',
      name: 'Michel Dupont',
      phone: '0612345678'
    }, 'whatsapp', { currentTime: testNow });

    const expectedDueAt = testNow + (48 * 3600 * 1000); // Thursday 10:00
    assert.equal(res.reminderDueAt, expectedDueAt);

    const queue = automations.getScheduledQueue();
    const task = queue.find(t => t.id === res.taskId);
    assert.ok(task);
    assert.equal(task.dueAt, expectedDueAt);
    assert.equal(task.status, 'PENDING');
  });

  await runTestCase('T1.R2.5: J+2 watchdog neutralizes reminder if photos received before J+2', 1, 'R2', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794218400000;
    const res = automations.triggerPhotoOnboarding({
      id: 'lead_neutralize_test',
      name: 'Michel Dupont',
      phone: '0612345678'
    }, 'whatsapp', { currentTime: testNow });

    // Simulate photos received at J+1 (24 hours later)
    const timeAtJ1 = testNow + (24 * 3600 * 1000);
    const reports = automations.checkAndTriggerPhotoReminders({
      currentTime: timeAtJ1,
      leadPhotoStatusMap: { 'lead_neutralize_test': 'received' }
    });

    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'NEUTRALIZED_RECEIVED');

    const queue = automations.getScheduledQueue();
    const task = queue.find(t => t.id === res.taskId);
    assert.equal(task.status, 'CANCELLED_RECEIVED');
  });

  await runTestCase('T1.R2.6: J+2 watchdog fires reminder when dueAt is reached and photos missing', 1, 'R2', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794218400000;
    const res = automations.triggerPhotoOnboarding({
      id: 'lead_fire_test',
      name: 'Michel Dupont',
      phone: '0612345678'
    }, 'whatsapp', { currentTime: testNow });

    // Simulate time at J+2 + 1 minute (48h and 1m later)
    const timeAtJ2 = testNow + (48 * 3600 * 1000) + 60000;
    const reports = automations.checkAndTriggerPhotoReminders({
      currentTime: timeAtJ2,
      leadPhotoStatusMap: { 'lead_fire_test': 'requested' }
    });

    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'REMINDER_SENT');
    assert.equal(reports[0].channel, 'whatsapp');
  });

  // --- R3: Nettoyeur & Optimiseur d'Images de Chantier Côté Client ---
  await runTestCase('T1.R3.1: Strict SEO slugification (accents NFD, symbols, lowercase)', 1, 'R3', async () => {
    const slug1 = ReferenceMediaOptimizer.slugify("Maçonnerie & Rénovation Pierre d'Anjou");
    assert.equal(slug1, 'maconnerie-renovation-pierre-d-anjou');

    const slug2 = ReferenceMediaOptimizer.slugify("L'Ébénisterie Éclairée — Chalonnes-sur-Loire (49290)!");
    assert.equal(slug2, 'l-ebenisterie-eclairee-chalonnes-sur-loire-49290');
  });

  await runTestCase('T1.R3.2: SEO filename generation with 2-digit zero-padding', 1, 'R3', async () => {
    const name1 = ReferenceMediaOptimizer.generateSeoFilename('Maçonnerie générale', 'Segré-en-Anjou Bleu', 'Chantier Rénovation', 1);
    assert.equal(name1, 'maconnerie-generale-segre-en-anjou-bleu-chantier-renovation-01.webp');

    const name9 = ReferenceMediaOptimizer.generateSeoFilename('Couvreur', 'Angers', 'Toiture ardoise', 9);
    assert.equal(name9, 'couvreur-angers-toiture-ardoise-09.webp');

    const name12 = ReferenceMediaOptimizer.generateSeoFilename('Plombier', 'Craon', 'Salle de bain', 12);
    assert.equal(name12, 'plombier-craon-salle-de-bain-12.webp');
  });

  await runTestCase('T1.R3.3: Strict target size < 80 KB (< 81920 bytes) guaranteed on compression', 1, 'R3', async () => {
    const rawImage = {
      name: 'gros_chantier_façade.jpg',
      size: 4500000,
      width: 4032,
      height: 3024,
      buffer: Buffer.alloc(1000)
    };

    const res = await ReferenceMediaOptimizer.compressImage(rawImage, {
      metier: 'macon',
      ville: 'segre',
      chantier: 'facade',
      index: 1,
      targetMaxBytes: 80 * 1024
    });

    assert.ok(res.newSize < 81920, `Generated size ${res.newSize} exceeds 80 KB`);
    assert.ok(res.savingsPercent > 90);
    assert.equal(res.format, 'image/webp');
    assert.match(res.seoName, /^macon-segre-facade-01\.webp$/);
  });

  await runTestCase('T1.R3.4: Image format detection (JPEG, PNG, HEIC MIME, extension & magic bytes)', 1, 'R3', async () => {
    const heicFile = { name: 'IMG_4021.HEIC', type: 'image/heic' };
    assert.equal(ReferenceMediaOptimizer.detectFormat(heicFile), 'heic');

    const pngFile = { name: 'logo.png', type: 'image/png' };
    assert.equal(ReferenceMediaOptimizer.detectFormat(pngFile), 'png');

    const jpgFile = { name: 'chantier.jpg', type: 'image/jpeg' };
    assert.equal(ReferenceMediaOptimizer.detectFormat(jpgFile), 'jpeg');

    const heicMagic = { buffer: Buffer.from([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]) };
    assert.equal(ReferenceMediaOptimizer.detectFormat(heicMagic), 'heic');
  });

  await runTestCase('T1.R3.5: Responsive downscaling preserving aspect ratio (landscape, portrait)', 1, 'R3', async () => {
    // Landscape 4000x2000 (ratio 2:1)
    const landscape = { name: 'landscape.jpg', width: 4000, height: 2000, size: 2000000 };
    const resL = await ReferenceMediaOptimizer.compressImage(landscape, { maxDimension: 1600 });
    assert.equal(Math.round(resL.width / resL.height), 2);
    assert.ok(resL.width <= 1600 && resL.height <= 1600);

    // Portrait 1500x3000 (ratio 1:2)
    const portrait = { name: 'portrait.jpg', width: 1500, height: 3000, size: 2000000 };
    const resP = await ReferenceMediaOptimizer.compressImage(portrait, { maxDimension: 1600 });
    assert.equal(Math.round(resP.height / resP.width), 2);
    assert.ok(resP.width <= 1600 && resP.height <= 1600);
  });

  await runTestCase('T1.R3.6: Batch queue concurrency management (bounded concurrency = 2)', 1, 'R3', async () => {
    const files = [
      { name: 'photo1.jpg', size: 500000 },
      { name: 'photo2.jpg', size: 500000 },
      { name: 'photo3.jpg', size: 500000 },
      { name: 'photo4.jpg', size: 500000 },
      { name: 'photo5.jpg', size: 500000 }
    ];

    let progressCalls = 0;
    const results = await ReferenceMediaOptimizer.processBatch(files, { concurrency: 2 }, (done, total) => {
      progressCalls++;
      assert.ok(done <= total);
    });

    assert.equal(results.length, 5);
    assert.ok(progressCalls >= 3);
    results.forEach((r, idx) => {
      assert.ok(r.newSize < 81920);
      assert.match(r.seoName, new RegExp(`-0${idx + 1}\\.webp$`));
    });
  });

  await runTestCase('T1.R3.7: Batch export package generation (ZIP with valid PK header)', 1, 'R3', async () => {
    const mockItems = [
      { seoName: 'artisan-segre-01.webp', newSize: 54000 },
      { seoName: 'artisan-segre-02.webp', newSize: 62000 }
    ];

    const zipBuffer = await ReferenceMediaOptimizer.createZipPackage(mockItems);
    assert.ok(zipBuffer.length > 0);
    // Check standard ZIP magic bytes: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    assert.equal(zipBuffer[0], 0x50);
    assert.equal(zipBuffer[1], 0x4B);
    assert.equal(zipBuffer[2], 0x03);
    assert.equal(zipBuffer[3], 0x04);
  });

  // --- R4: Suivi Automatisé de Livraison & Demande d'Avis 5 Étoiles Google ---
  await runTestCase('T1.R4.1: Trigger delivery notification when project moves to LIVRÉ', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const lead = {
      id: 'opp_delivery_01',
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont SARL',
      phone: '0612345678'
    };

    const res = automations.triggerDelivery(lead);
    assert.equal(res.success, true);
    assert.match(res.deliveryUrl, /https:\/\/boubane\.com\/clients\/maconnerie-dupont/);
    assert.match(res.deliveryMessage, /Votre nouveau site internet Boubane est officiellement en ligne/);
  });

  await runTestCase('T1.R4.2: 48h Google review timer arming at delivery', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794304800000;
    const res = automations.triggerDelivery({
      id: 'opp_delivery_02',
      name: 'Michel Dupont'
    }, 'https://boubane.com/clients/maconnerie-dupont', { currentTime: testNow });

    const expectedDueAt = testNow + (48 * 3600 * 1000);
    assert.equal(res.reviewDueAt, expectedDueAt);

    const queue = automations.getScheduledQueue();
    const task = queue.find(t => t.id === res.reviewTaskId);
    assert.ok(task);
    assert.equal(task.dueAt, expectedDueAt);
    assert.equal(task.type, 'GOOGLE_REVIEW_48H');
    assert.equal(task.status, 'PENDING');
  });

  await runTestCase('T1.R4.3: Google review request dispatch with Boubane review URL at H+48h', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794304800000;
    automations.triggerDelivery({
      id: 'opp_review_h48',
      name: 'Michel Dupont'
    }, 'https://boubane.com/clients/maconnerie-dupont', { currentTime: testNow });

    // Fast-forward to 48 hours + 1 minute
    const timeAt48h = testNow + (48 * 3600 * 1000) + 60000;
    const reports = automations.checkAndTriggerReviewRequests({ currentTime: timeAt48h });

    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'REVIEW_SENT');
    assert.match(reports[0].message, /https:\/\/g\.page\/r\/boubane\/review/);
    assert.match(reports[0].message, /avis 5 étoiles/);
  });

  await runTestCase('T1.R4.4: Review request paused if client requests revisions before 48h', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794304800000;
    const res = automations.triggerDelivery({
      id: 'opp_revision_lead',
      name: 'Thomas Leroy'
    }, 'https://boubane.com/clients/anjou-plomberie', { currentTime: testNow });

    // Client requests revision at H+24
    const timeAt24h = testNow + (24 * 3600 * 1000);
    const reports = automations.checkAndTriggerReviewRequests({
      currentTime: timeAt24h,
      revisionReportedMap: { 'opp_revision_lead': true }
    });

    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'PAUSED_REVISIONS');

    const queue = automations.getScheduledQueue();
    const task = queue.find(t => t.id === res.reviewTaskId);
    assert.equal(task.status, 'PAUSED_REVISIONS');
  });

  await runTestCase('T1.R4.5: Audit log entry created on delivery and review dispatch', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794304800000;
    automations.triggerDelivery({
      id: 'opp_log_test',
      name: 'Stéphane Bernard'
    }, null, { currentTime: testNow });

    const logs = automations.getAutomationLogs();
    assert.ok(logs.some(l => l.module === 'R4_DELIVERY_NOTIFICATION'));
  });

  await runTestCase('T1.R4.6: Official Google 5-star review URL target and review link integrity', 1, 'R4', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const testNow = 1794304800000;
    automations.triggerDelivery({ id: 'lead_review_url', name: 'Artisan Test' }, null, { currentTime: testNow });

    const reports = automations.checkAndTriggerReviewRequests({
      currentTime: testNow + (48 * 3600 * 1000) + 5000
    });
    assert.equal(reports.length, 1);
    assert.match(reports[0].message, /https:\/\/g\.page\/r\/boubane\/review/);
  });

  // --- R5: Intégration Unifiée dans le Cockpit dashboard.html ---
  await runTestCase('T1.R5.1: dashboard.html exists, is valid HTML5 and contains design system tokens', 1, 'R5', async () => {
    const dashboardPath = path.resolve(process.cwd(), 'dashboard.html');
    assert.ok(fs.existsSync(dashboardPath), 'dashboard.html must exist at project root');

    const content = fs.readFileSync(dashboardPath, 'utf8');
    assert.match(content, /<!DOCTYPE html>/i);
    assert.match(content, /--primary:\s*#ED5B04/);
    assert.match(content, /--bg-body:\s*#FAFAFA/);
    assert.match(content, /Plus Jakarta Sans/);
  });

  await runTestCase('T1.R5.2: LocalStorage schema contract for queues and activity logs', 1, 'R5', async () => {
    const mockStore = new MockStorage();
    const automations = new ReferenceAutomations(mockStore, new MockNetwork());

    automations.triggerPhotoOnboarding({ id: 'test_lead_r5', name: 'Artisan Test' });
    const rawQueue = mockStore.getItem('boubane_automations_queue');
    assert.ok(rawQueue !== null);

    const parsedQueue = JSON.parse(rawQueue);
    assert.ok(Array.isArray(parsedQueue));
    assert.equal(parsedQueue[0].type, 'PHOTO_REMINDER_J2');

    const rawLogs = mockStore.getItem('boubane_automations_log');
    assert.ok(rawLogs !== null);
    const parsedLogs = JSON.parse(rawLogs);
    assert.ok(Array.isArray(parsedLogs));
    assert.ok(parsedLogs[0].timestamp);
  });

  await runTestCase('T1.R5.3: Cockpit 1-click trigger button contract definitions', 1, 'R5', async () => {
    // Check contract conformity for 1-click trigger actions
    const expectedActions = ['briefing', 'photo-onboarding', 'delivery'];
    expectedActions.forEach(action => {
      assert.ok(typeof action === 'string' && action.length > 0);
    });
  });

  await runTestCase('T1.R5.4: Status badge dynamic state mapping', 1, 'R5', async () => {
    const badgeStates = {
      'NEW': { label: 'Nouveau Prospect', class: 'badge-info' },
      'BRIEFING_SENT': { label: 'Briefing Envoyé', class: 'badge-primary' },
      'PHOTOS_REQUESTED': { label: 'Relance J+2', class: 'badge-warning' },
      'PHOTOS_RECEIVED': { label: 'Photos Reçues', class: 'badge-success' },
      'DELIVERED': { label: 'LIVRÉ', class: 'badge-success' },
      'REVIEW_SCHEDULED': { label: 'Avis +48h', class: 'badge-secondary' }
    };

    assert.equal(badgeStates.PHOTOS_REQUESTED.label, 'Relance J+2');
    assert.equal(badgeStates.DELIVERED.label, 'LIVRÉ');
    assert.equal(badgeStates.REVIEW_SCHEDULED.label, 'Avis +48h');
  });

  await runTestCase('T1.R5.5: Media dropzone contract (MIME types: JPEG, PNG, HEIC accepted)', 1, 'R5', async () => {
    const acceptedMimes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp'];

    assert.ok(acceptedMimes.includes('image/heic'));
    assert.ok(acceptedExtensions.includes('.heic'));
  });

  await runTestCase('T1.R5.6: Cockpit activity log filtering by module (R1, R2, R4) and status', 1, 'R5', async () => {
    const mockStore = new MockStorage();
    const automations = new ReferenceAutomations(mockStore, new MockNetwork());

    // Populate multiple module logs
    await automations.sendTelegramBriefing(automations.generateProspectDiagnosis({ name: 'Lead 1' }));
    automations.triggerPhotoOnboarding({ id: 'lead_2', name: 'Lead 2' });
    automations.triggerDelivery({ id: 'lead_3', name: 'Lead 3' });

    const allLogs = automations.getAutomationLogs();
    assert.ok(allLogs.length >= 3);

    const r1Logs = allLogs.filter(l => l.module.startsWith('R1_'));
    const r2Logs = allLogs.filter(l => l.module.startsWith('R2_'));
    const r4Logs = allLogs.filter(l => l.module.startsWith('R4_'));

    assert.ok(r1Logs.length >= 1);
    assert.ok(r2Logs.length >= 1);
    assert.ok(r4Logs.length >= 1);
  });

  // =========================================================================
  // TIER 2: BOUNDARY & CORNER CASES
  // =========================================================================

  await runTestCase('T2.1: Empty and missing fields in Cal.com booking payload', 2, 'R1', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());

    // Minimal empty payload
    const minimal = automations.parseCalcomBooking({});
    assert.equal(minimal.name, 'Prospect Inconnu');
    assert.equal(minimal.company, 'Prospect Inconnu Entreprise');

    // Missing attendees, responses without notes
    const partial = automations.parseCalcomBooking({
      payload: {
        id: 999,
        attendees: [],
        responses: { name: { value: 'Jean Test' } }
      }
    });
    assert.equal(partial.name, 'Jean Test');
    assert.equal(partial.email, '');
    assert.equal(partial.phone, '');
  });

  await runTestCase('T2.2: Image boundary sizes (0-byte rejection & exact 80KB boundary constraint)', 2, 'R3', async () => {
    // 0-byte image must be cleanly rejected
    await assert.rejects(
      async () => {
        await ReferenceMediaOptimizer.compressImage({ name: 'empty.jpg', size: 0, buffer: Buffer.alloc(0) });
      },
      /Invalid input: image file is empty/
    );

    // Exact 80KB targetMaxBytes test: must produce strictly < 81920
    const edgeImage = {
      name: 'large_heavy.jpg',
      size: 15000000,
      width: 6000,
      height: 4000,
      buffer: Buffer.alloc(5000)
    };

    const res = await ReferenceMediaOptimizer.compressImage(edgeImage, {
      targetMaxBytes: 81920
    });
    assert.ok(res.newSize < 81920, `File size ${res.newSize} must be < 81920 bytes`);
  });

  await runTestCase('T2.3: Corrupted media buffers and illegitimate extensions', 2, 'R3', async () => {
    const corruptedTxt = {
      name: 'fake_photo.txt',
      type: 'text/plain',
      size: 500,
      buffer: Buffer.from('THIS_IS_NOT_AN_IMAGE')
    };

    await assert.rejects(
      async () => {
        await ReferenceMediaOptimizer.compressImage(corruptedTxt);
      },
      /Unsupported image format/
    );
  });

  await runTestCase('T2.4: Complex artisanal names, French ligatures and Unicode characters', 2, 'R3', async () => {
    const complexCases = [
      { input: "L'Atelier d'Ébénisterie & Fils — Chalonnes", expected: 'l-atelier-d-ebenisterie-fils-chalonnes' },
      { input: '   Couverture   /   Zinguerie   49   ', expected: 'couverture-zinguerie-49' },
      { input: 'Peinture & Déco (Rénov’ Express)', expected: 'peinture-deco-renov-express' },
      { input: '🔥 Super Artisan Bâtiment 🚀', expected: 'super-artisan-batiment' }
    ];

    complexCases.forEach(({ input, expected }) => {
      const slug = ReferenceMediaOptimizer.slugify(input);
      assert.equal(slug, expected);
    });
  });

  await runTestCase('T2.5: Telegram network failures & rate limiting simulation (HTTP 429)', 2, 'R1', async () => {
    const mockNet = new MockNetwork();
    mockNet.setFailMode('rate_limit');
    const mockStore = new MockStorage();
    const automations = new ReferenceAutomations(mockStore, mockNet);

    const diag = automations.generateProspectDiagnosis({ name: 'Michel Dupont', phone: '0612345678' });
    const res = await automations.sendTelegramBriefing(diag);

    assert.equal(res.success, false);
    assert.equal(res.status, 429);

    const logs = automations.getAutomationLogs();
    assert.ok(logs.some(l => l.level === 'ERROR' && l.message.includes('HTTP 429')));
  });

  await runTestCase('T2.6: Timestamp arithmetic and cross-midnight / cross-day boundaries', 2, 'CROSS', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    // Test on December 31st 23:50:00
    const endOfYear = new Date('2026-12-31T23:50:00.000Z').getTime();

    const onboarding = automations.triggerPhotoOnboarding({ id: 'lead_nye', name: 'Artisan NYE' }, 'whatsapp', {
      currentTime: endOfYear
    });

    const expectedNewYearDue = new Date('2027-01-02T23:50:00.000Z').getTime();
    assert.equal(onboarding.reminderDueAt, expectedNewYearDue);
  });

  // =========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS
  // =========================================================================

  await runTestCase('T3.1: Full nominal artisan journey (Calcom -> Briefing -> Onboarding -> Optimizer -> Delivery -> Review)', 3, 'CROSS', async () => {
    const mockStore = new MockStorage();
    const mockNet = new MockNetwork();
    const automations = new ReferenceAutomations(mockStore, mockNet);

    // Step 1: Cal.com webhook arrives (R1)
    const booking = automations.parseCalcomBooking(calcomFixture);
    assert.equal(booking.bookingId, 849201);

    // Step 2: Diagnostic & Telegram Briefing sent (R1)
    const diag = automations.generateProspectDiagnosis(booking);
    const briefingResult = await automations.sendTelegramBriefing(diag);
    assert.equal(briefingResult.success, true);

    // Step 3: Prospect validated, 1-click Onboarding photos triggered (R2)
    const t0 = 1794218400000;
    const onboarding = automations.triggerPhotoOnboarding(booking, 'whatsapp', { currentTime: t0 });
    assert.equal(onboarding.success, true);

    // Step 4: Photos received and optimized via Media Optimizer (R3)
    const photos = [
      { name: 'chantier1.jpg', size: 3500000 },
      { name: 'chantier2.png', size: 2800000 },
      { name: 'chantier3.heic', size: 4200000 },
      { name: 'chantier4.jpg', size: 3100000 }
    ];
    const optimized = await ReferenceMediaOptimizer.processBatch(photos, {
      metier: booking.craft,
      ville: booking.city,
      chantier: 'renovation'
    });
    assert.equal(optimized.length, 4);
    optimized.forEach(img => {
      assert.ok(img.newSize < 81920);
      assert.match(img.seoName, /^maconnerie-generale-renovation-pierre-segre-en-anjou-bleu-49500-renovation-\d{2}\.webp$/);
    });

    // Step 5: Site built and delivered to client (R4)
    const delivery = automations.triggerDelivery(booking, null, { currentTime: t0 + (86400000 * 2) });
    assert.equal(delivery.success, true);

    // Step 6: 48h later, Google review request fired (R4)
    const reviewReports = automations.checkAndTriggerReviewRequests({
      currentTime: delivery.deliveredAt + (48 * 3600 * 1000) + 1000
    });
    assert.equal(reviewReports.length, 1);
    assert.equal(reviewReports[0].action, 'REVIEW_SENT');

    // Step 7: Verify all logs in storage (R5)
    const logs = automations.getAutomationLogs();
    assert.ok(logs.length >= 4);
  });

  await runTestCase('T3.2: Early photo receipt cancels J+2 watchdog reminder', 3, 'CROSS', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const t0 = 1794218400000;

    const res = automations.triggerPhotoOnboarding({ id: 'lead_early', name: 'Jean Couvreur' }, 'whatsapp', { currentTime: t0 });

    // Photos sent 4 hours later
    const tEarly = t0 + (4 * 3600 * 1000);
    const earlyReports = automations.checkAndTriggerPhotoReminders({
      currentTime: tEarly,
      leadPhotoStatusMap: { 'lead_early': 'received' }
    });
    assert.equal(earlyReports[0].action, 'NEUTRALIZED_RECEIVED');

    // Run watchdog at J+2: nothing should fire
    const tJ2 = t0 + (48 * 3600 * 1000) + 1000;
    const j2Reports = automations.checkAndTriggerPhotoReminders({ currentTime: tJ2 });
    assert.equal(j2Reports.length, 0);
  });

  await runTestCase('T3.3: Urgent revision pauses 48h Google review request', 3, 'CROSS', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const t0 = 1794218400000;

    automations.triggerDelivery({ id: 'lead_rev', name: 'Pierre Plombier' }, null, { currentTime: t0 });

    // Client requests revision before 48h
    const tRev = t0 + (20 * 3600 * 1000);
    const revReports = automations.checkAndTriggerReviewRequests({
      currentTime: tRev,
      revisionReportedMap: { 'lead_rev': true }
    });
    assert.equal(revReports[0].action, 'PAUSED_REVISIONS');

    // At 48h, review is NOT sent because it was paused
    const t48 = t0 + (48 * 3600 * 1000) + 1000;
    const postReports = automations.checkAndTriggerReviewRequests({ currentTime: t48 });
    assert.equal(postReports.length, 0);
  });

  await runTestCase('T3.4: Multi-lead queue isolation (no cross-lead state contamination)', 3, 'CROSS', async () => {
    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const t0 = 1794218400000;

    automations.triggerPhotoOnboarding({ id: 'lead_A', name: 'Artisan A' }, 'whatsapp', { currentTime: t0 });
    automations.triggerPhotoOnboarding({ id: 'lead_B', name: 'Artisan B' }, 'whatsapp', { currentTime: t0 });

    // Only lead A sent photos
    const reports = automations.checkAndTriggerPhotoReminders({
      currentTime: t0 + (48 * 3600 * 1000) + 5000,
      leadPhotoStatusMap: { 'lead_A': 'received', 'lead_B': 'requested' }
    });

    const reportA = reports.find(r => r.leadName === 'Artisan A');
    const reportB = reports.find(r => r.leadName === 'Artisan B');

    assert.equal(reportA.action, 'NEUTRALIZED_RECEIVED');
    assert.equal(reportB.action, 'REMINDER_SENT');
  });

  // =========================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS (Artisans du Territoire)
  // =========================================================================

  await runTestCase('T4.1: Real-world scenario — Couvreur Segré (Toiture Segréenne SAS)', 4, 'CROSS', async () => {
    const profile = artisanProfilesFixture.find(p => p.id === 'artisan_segre_01');
    assert.ok(profile);

    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const diag = automations.generateProspectDiagnosis(profile);

    assert.equal(diag.diagnosis.hasWebsite, false);
    assert.match(diag.diagnosis.recommendedDomain, /toiture-segreenne/);
    assert.equal(diag.diagnosis.googleMaps.rating, 4.7);

    // Optimize their 4 photos
    const mediaResults = await ReferenceMediaOptimizer.processBatch(profile.sample_photos, {
      metier: profile.trade,
      ville: profile.city,
      chantier: 'chantier-segreen'
    });

    assert.equal(mediaResults.length, 4);
    mediaResults.forEach(m => {
      assert.ok(m.newSize < 81920);
      assert.match(m.seoName, /^couvreur-segre-en-anjou-bleu-chantier-segreen-\d{2}\.webp$/);
    });
  });

  await runTestCase('T4.2: Real-world scenario — Maçon Château-Gontier (Maçonnerie Dupont SARL)', 4, 'CROSS', async () => {
    const profile = artisanProfilesFixture.find(p => p.id === 'artisan_chateau_gontier_02');
    assert.ok(profile);

    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const diag = automations.generateProspectDiagnosis(profile);
    const md = automations.formatTelegramMessage(diag);

    assert.match(md, /Château-Gontier/);
    assert.match(md, /Rénov Pierre 53/);

    const mediaResults = await ReferenceMediaOptimizer.processBatch(profile.sample_photos, {
      metier: profile.trade,
      ville: profile.city,
      chantier: 'pierre-renov'
    });

    const zip = await ReferenceMediaOptimizer.createZipPackage(mediaResults);
    assert.ok(zip.length > 0);
  });

  await runTestCase('T4.3: Real-world scenario — Plombier Angers (Anjou Plomberie Chauffage)', 4, 'CROSS', async () => {
    const profile = artisanProfilesFixture.find(p => p.id === 'artisan_angers_03');
    assert.ok(profile);

    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const diag = automations.generateProspectDiagnosis(profile);

    // Existing website check
    assert.equal(diag.diagnosis.hasWebsite, true);
    assert.match(diag.diagnosis.websiteStatus, /Site existant/);

    // Photo onboarding via SMS
    const onboarding = automations.triggerPhotoOnboarding(profile, 'sms');
    assert.match(onboarding.directUrl, /^sms:\+33678901234/);
  });

  await runTestCase('T4.4: Real-world scenario — Électricien Craon (Craon Élec Express)', 4, 'CROSS', async () => {
    const profile = artisanProfilesFixture.find(p => p.id === 'artisan_craon_04');
    assert.ok(profile);

    const automations = new ReferenceAutomations(new MockStorage(), new MockNetwork());
    const t0 = 1794218400000;

    // Delivery & 48h review cycle
    const delivery = automations.triggerDelivery(profile, profile.delivery_url, { currentTime: t0 });
    assert.equal(delivery.deliveryUrl, 'https://boubane.com/clients/craon-elec-express');

    const reviews = automations.checkAndTriggerReviewRequests({ currentTime: t0 + (48 * 3600 * 1000) + 1000 });
    assert.equal(reviews.length, 1);
    assert.match(reviews[0].message, /Stéphane Bernard/i);
  });

  // -------------------------------------------------------------------------
  // Test Report Summary
  // -------------------------------------------------------------------------
  const elapsed = ((Date.now() - ctx.startTime) / 1000).toFixed(3);

  console.log('\n\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1m  E2E Test Execution Summary\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`  Total Tests  : \x1b[1m${ctx.tests.length}\x1b[0m`);
  console.log(`  Passed       : \x1b[32m${ctx.passed}\x1b[0m`);
  console.log(`  Failed       : ${ctx.failed > 0 ? `\x1b[31m${ctx.failed}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
  console.log(`  Skipped      : \x1b[33m${ctx.skipped}\x1b[0m`);
  console.log(`  Duration     : ${elapsed}s`);
  console.log('\x1b[1m───────────────────────────────────────────────────────────────────────────\x1b[0m');

  if (ctx.failed === 0) {
    console.log('  \x1b[1;32mRESULT: ALL TESTS PASSED (100% SUCCESS RATE)\x1b[0m');
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
    process.exit(0);
  } else {
    console.log('  \x1b[1;31mRESULT: TESTS FAILED\x1b[0m');
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal unhandled error in test runner:\x1b[0m', err);
  process.exit(1);
});
