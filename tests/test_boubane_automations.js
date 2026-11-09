#!/usr/bin/env node

/**
 * ============================================================================
 * Boubane Internal Automations — Unit Verification & Contract Test Suite
 * ============================================================================
 * 
 * Verifying Requirement 1, Requirement 2, Requirement 4, UniversalStorageAdapter,
 * Persistent Queue Engine, FIFO Audit Log Engine, and UMD exports.
 *
 * Usage:
 *   node tests/test_boubane_automations.js
 *   node tests/test_boubane_automations.js --verbose
 */

const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const {
  BoubaneAutomations,
  UniversalStorageAdapter,
  BrowserNetwork,
  slugify
} = require('../scripts/boubane_automations');

const {
  MockStorage,
  MockNetwork
} = require('./helpers/reference_contracts');

// CLI options
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

class UnitHarness {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.suites = [];
    this.startTime = Date.now();
  }

  suite(name) {
    this.currentSuite = { name, tests: [] };
    this.suites.push(this.currentSuite);
    if (isVerbose) {
      console.log(`\n\x1b[1;34m[SUITE]\x1b[0m \x1b[1m${name}\x1b[0m`);
    }
  }

  async test(name, fn) {
    this.total++;
    try {
      await fn();
      this.passed++;
      this.currentSuite.tests.push({ name, pass: true });
      if (isVerbose) {
        console.log(`  \x1b[32m✔\x1b[0m ${name}`);
      } else {
        process.stdout.write('\x1b[32m.\x1b[0m');
      }
    } catch (err) {
      this.failed++;
      this.currentSuite.tests.push({ name, pass: false, error: err });
      console.log(`\n  \x1b[31m✖\x1b[0m ${name}`);
      console.log(`    \x1b[31mError:\x1b[0m ${err.message}`);
      if (isVerbose && err.stack) {
        console.log(`    ${err.stack.split('\n').slice(1, 4).join('\n    ')}`);
      }
    }
  }

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log('\n\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`\x1b[1m  Boubane Automations Engine — Unit Test Summary\x1b[0m`);
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`  Total Checks : ${this.total}`);
    console.log(`  Passed       : \x1b[32m${this.passed}\x1b[0m`);
    console.log(`  Failed       : ${this.failed > 0 ? `\x1b[31m${this.failed}\x1b[0m` : '0'}`);
    console.log(`  Duration     : ${duration}s`);
    console.log('───────────────────────────────────────────────────────────────────────────');
    if (this.failed === 0) {
      console.log('  \x1b[1;32mRESULT: ALL TESTS PASSED (100% SUCCESS RATE)\x1b[0m');
      console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
      process.exit(0);
    } else {
      console.log('  \x1b[1;31mRESULT: TEST SUITE FAILED\x1b[0m');
      console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
      process.exit(1);
    }
  }
}

const harness = new UnitHarness();

async function runAllTests() {
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;36m  Running Boubane Automations Engine Verification Suite\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');

  if (!isVerbose) {
    process.stdout.write('  Running tests: ');
  }

  // =========================================================================
  // 1. Module Exports & Helpers
  // =========================================================================
  harness.suite('1. Module Exports & Helper Utilities');

  await harness.test('Exports BoubaneAutomations and helper classes', async () => {
    assert.equal(typeof BoubaneAutomations, 'function');
    assert.equal(typeof UniversalStorageAdapter, 'function');
    assert.equal(typeof BrowserNetwork, 'function');
    assert.equal(typeof slugify, 'function');
  });

  await harness.test('slugify handles standard, accented, and ligature French characters', async () => {
    assert.equal(slugify('Maçonnerie & Rénovation Pierre d’Anjou'), 'maconnerie-renovation-pierre-d-anjou');
    assert.equal(slugify('L’Ébénisterie Éclairée'), 'l-ebenisterie-eclairee');
    assert.equal(slugify('Chœur & Cœur en Œuvre'), 'choeur-coeur-en-oeuvre');
    assert.equal(slugify(''), '');
    assert.equal(slugify(null), '');
    assert.equal(slugify(undefined), '');
  });

  // =========================================================================
  // 2. Universal Storage Adapter
  // =========================================================================
  harness.suite('2. Universal Storage Adapter (Level 1, 2, 3)');

  await harness.test('In-memory fallback works reliably when localStorage unavailable', async () => {
    const adapter = new UniversalStorageAdapter();
    assert.equal(adapter.getItem('unknown_key'), null);

    adapter.setItem('test_k1', 'val1');
    assert.equal(adapter.getItem('test_k1'), 'val1');
    assert.equal(adapter.length, 1);

    adapter.setItem('test_k2', 'val2');
    assert.equal(adapter.length, 2);

    adapter.removeItem('test_k1');
    assert.equal(adapter.getItem('test_k1'), null);
    assert.equal(adapter.length, 1);

    adapter.clear();
    assert.equal(adapter.length, 0);
    assert.equal(adapter.getItem('test_k2'), null);
  });

  await harness.test('Custom mock storage injection operates transparently', async () => {
    const mock = new MockStorage({ pre_existing: 'hello' });
    const adapter = new UniversalStorageAdapter(mock);

    assert.equal(adapter.getItem('pre_existing'), 'hello');
    adapter.setItem('new_key', 'world');
    assert.equal(mock.getItem('new_key'), 'world');
    assert.equal(adapter.length, 2);

    adapter.removeItem('pre_existing');
    assert.equal(mock.getItem('pre_existing'), null);
  });

  await harness.test('Automations engine wraps storage safely when initialized without arguments', async () => {
    const engine = new BoubaneAutomations();
    assert.ok(engine.storage);
    assert.equal(typeof engine.storage.getItem, 'function');
    assert.equal(typeof engine.storage.setItem, 'function');

    engine._logAutomation('TEST_MODULE', 'INFO', 'Adapter self test');
    const logs = engine.getAutomationLogs();
    assert.ok(logs.length >= 1);
    assert.equal(logs[0].module, 'TEST_MODULE');
  });

  // =========================================================================
  // 3. Requirement 1: Cal.com Ingestion & Telegram Briefing
  // =========================================================================
  harness.suite('3. Requirement 1: Cal.com Ingestion & Telegram Pre-Call Briefing');

  await harness.test('parseCalcomBooking extracts all fields from standard Cal.com responses', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const fixture = {
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        id: 99102,
        startTime: '2026-11-15T10:00:00.000Z',
        endTime: '2026-11-15T10:15:00.000Z',
        title: 'RDV Cadrage Boubane',
        attendees: [{ name: 'Marc Leblanc', email: 'marc@leblanc-ardoise.fr' }],
        responses: {
          name: { value: 'Marc Leblanc' },
          email: { value: 'marc@leblanc-ardoise.fr' },
          phone: { value: '06 22 33 44 55' },
          company: { value: 'Leblanc Couverture SAS' },
          craft: { value: 'Couvreur ardoisier & zingueur' },
          city: { value: 'Château-Gontier (53200)' },
          notes: { value: 'Besoin d’un site vitrine avec photos de chantiers' }
        }
      }
    };

    const parsed = engine.parseCalcomBooking(fixture);
    assert.equal(parsed.bookingId, 99102);
    assert.equal(parsed.triggerEvent, 'BOOKING_CREATED');
    assert.equal(parsed.name, 'Marc Leblanc');
    assert.equal(parsed.email, 'marc@leblanc-ardoise.fr');
    assert.equal(parsed.phone, '06 22 33 44 55');
    assert.equal(parsed.company, 'Leblanc Couverture SAS');
    assert.equal(parsed.craft, 'Couvreur ardoisier & zingueur');
    assert.equal(parsed.city, 'Château-Gontier (53200)');
    assert.match(parsed.notes, /Besoin d’un site vitrine/);
  });

  await harness.test('parseCalcomBooking extracts company, craft, city, and phone from notes regex fallback', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const rawWithNotes = {
      payload: {
        id: 55412,
        attendees: [{ name: 'Sébastien Petit', email: 'seb@btp.fr' }],
        description: 'Entreprise: Petit Bâti Rénov\nMétier: Maçonnerie & Plâtrerie\nVille: Segré-en-Anjou Bleu\nTél: 06 99 88 77 66'
      }
    };

    const parsed = engine.parseCalcomBooking(rawWithNotes);
    assert.equal(parsed.name, 'Sébastien Petit');
    assert.equal(parsed.company, 'Petit Bâti Rénov');
    assert.equal(parsed.craft, 'Maçonnerie & Plâtrerie');
    assert.equal(parsed.city, 'Segré-en-Anjou Bleu');
    assert.equal(parsed.phone, '06 99 88 77 66');
  });

  await harness.test('parseCalcomBooking rejects invalid payloads', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    assert.throws(() => engine.parseCalcomBooking(null), /payload must be a non-null object/);
    assert.throws(() => engine.parseCalcomBooking('string'), /payload must be a non-null object/);
    assert.throws(() => engine.parseCalcomBooking(undefined), /payload must be a non-null object/);
  });

  await harness.test('generateProspectDiagnosis produces complete 4-axis synthesis', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Lucie Moreau',
      company: 'Moreau Menuiserie',
      craft: 'Menuisier poseur',
      city: 'Segré',
      phone: '06 11 22 33 44',
      email: 'lucie@moreau-menuiserie.fr',
      startTime: '2026-11-12T14:30:00.000Z',
      has_website: false,
      google_maps_claimed: false,
      google_rating: 4.9,
      google_reviews_count: 7
    });

    assert.equal(diag.contact.name, 'Lucie Moreau');
    assert.equal(diag.contact.company, 'Moreau Menuiserie');
    assert.equal(diag.diagnosis.hasWebsite, false);
    assert.match(diag.diagnosis.websiteStatus, /Aucun site web détecté/);
    assert.equal(diag.diagnosis.recommendedDomain, 'moreau-menuiserie-segre.fr');
    assert.equal(diag.diagnosis.googleMaps.claimed, false);
    assert.match(diag.diagnosis.googleMaps.label, /Fiche non revendiquée/);
    assert.equal(diag.diagnosis.googleMaps.rating, 4.9);
    assert.equal(diag.diagnosis.googleMaps.reviewsCount, 7);
    assert.equal(diag.diagnosis.competitors.length, 2);
    assert.equal(diag.pitchPoints.length, 3);
    assert.ok(diag.meetingTime.formatted);
  });

  await harness.test('formatTelegramMessage produces compliant Markdown with competitors and pitch', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Thierry Brossard',
      company: 'Brossard Électricité',
      craft: 'Électricien',
      city: 'Craon',
      phone: '06 77 88 99 00',
      email: 'thierry@brossard-elec.fr'
    });

    const md = engine.formatTelegramMessage(diag);
    assert.match(md, /NOUVEAU BRIEFING PRÉ-APPEL BOUBANE/);
    assert.match(md, /Thierry Brossard/);
    assert.match(md, /Brossard Électricité/);
    assert.match(md, /Craon/);
    assert.match(md, /brossard-electricite-craon\.fr/);
    assert.match(md, /CONCURRENTS LOCAUX/);
    assert.match(md, /STRATÉGIE & ACCROCHE APPEL/);
  });

  await harness.test('sendTelegramBriefing dispatches inline buttons and logs successfully', async () => {
    const mockNet = new MockNetwork();
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore, mockNet);

    const diag = engine.generateProspectDiagnosis({
      name: 'Michel Dupont',
      company: 'Maçonnerie Dupont',
      craft: 'Maçonnerie',
      city: 'Segré',
      phone: '06 12 34 56 78',
      email: 'michel@dupont.fr'
    });

    const res = await engine.sendTelegramBriefing(diag);
    assert.equal(res.success, true);
    assert.equal(res.chatId, 8036535453);
    assert.ok(res.messageId);

    assert.equal(mockNet.calls.length, 1);
    const sentBody = JSON.parse(mockNet.calls[0].options.body);
    assert.equal(sentBody.chat_id, 8036535453);
    assert.equal(sentBody.parse_mode, 'Markdown');

    const keyboard = sentBody.reply_markup.inline_keyboard;
    assert.equal(keyboard[0][0].text, '📞 Appeler');
    assert.match(keyboard[0][0].url, /^tel:/);
    assert.equal(keyboard[0][1].text, '💬 WhatsApp');
    assert.match(keyboard[0][1].url, /^https:\/\/wa\.me\/33612345678/);
    assert.equal(keyboard[1][0].text, '🏢 Fiche Twenty CRM');
    assert.match(keyboard[1][0].url, /crm\.boubane\.com/);
    assert.equal(keyboard[1][1].text, '🗺️ Google Maps');
    assert.equal(keyboard[2][0].text, '📸 Lancer Onboarding Photos');

    const logs = engine.getAutomationLogs({ module: 'R1_TELEGRAM_DISPATCH' });
    assert.ok(logs.length >= 1);
    assert.equal(logs[0].status, 'SUCCESS');
  });

  await harness.test('sendTelegramBriefing offline mock mode bypasses network fetch', async () => {
    const mockNet = new MockNetwork();
    mockNet.setFailMode('network_error'); // If called, fetch would throw
    const engine = new BoubaneAutomations(new MockStorage(), mockNet);

    const diag = engine.generateProspectDiagnosis({ name: 'Mock Test', phone: '0600000000' });
    const res = await engine.sendTelegramBriefing(diag, { mock: true });

    assert.equal(res.success, true);
    assert.equal(res.messageId, 10482);
    assert.equal(mockNet.calls.length, 0); // Network never touched
  });

  await harness.test('sendTelegramBriefing handles HTTP 429 rate limit gracefully', async () => {
    const mockNet = new MockNetwork();
    mockNet.setFailMode('rate_limit');
    const engine = new BoubaneAutomations(new MockStorage(), mockNet);

    const diag = engine.generateProspectDiagnosis({ name: 'Rate Limit Test', phone: '0600000000' });
    const res = await engine.sendTelegramBriefing(diag);

    assert.equal(res.success, false);
    assert.equal(res.status, 429);

    const errorLogs = engine.getAutomationLogs({ level: 'ERROR' });
    assert.ok(errorLogs.length >= 1);
    assert.match(errorLogs[0].message, /HTTP 429/);
  });

  // =========================================================================
  // 4. Requirement 2: Photo Onboarding & J+2 Reminder Watchdog
  // =========================================================================
  harness.suite('4. Requirement 2: Photo Onboarding & J+2 Reminder Watchdog');

  await harness.test('generatePhotoOnboardingMessage contains all 4-5 photo guidelines', async () => {
    const engine = new BoubaneAutomations();
    const lead = { name: 'Gilles Renard', craft: 'Couvreur ardoisier', city: 'Segré' };
    const msg = engine.generatePhotoOnboardingMessage(lead);

    assert.match(msg, /4 à 5 photos de vos chantiers/);
    assert.match(msg, /1\. Une vue d'ensemble du chantier terminé/);
    assert.match(msg, /2\. Un gros plan sur les finitions/);
    assert.match(msg, /3\. Une photo de vous ou de l'équipe/);
    assert.match(msg, /4\. Idéalement en lumière naturelle de jour/);
    assert.match(msg, /07 78 31 03 46/);
  });

  await harness.test('formatMultiChannelUrl generates correct links for WhatsApp, SMS, and Telegram', async () => {
    const engine = new BoubaneAutomations();
    const phoneFrench = '06 12 34 56 78';
    const phoneIntl = '+33 6 12 34 56 78';

    const wa = engine.formatMultiChannelUrl('whatsapp', phoneFrench, 'Test Message');
    assert.match(wa, /^https:\/\/wa\.me\/33612345678\?text=Test%20Message/);

    const smsLocal = engine.formatMultiChannelUrl('sms', phoneFrench, 'Test SMS');
    assert.match(smsLocal, /^sms:0612345678\?body=Test%20SMS/);

    const smsIntl = engine.formatMultiChannelUrl('sms', phoneIntl, 'Test SMS');
    assert.match(smsIntl, /^sms:\+33612345678\?body=Test%20SMS/);

    const tg = engine.formatMultiChannelUrl('telegram', phoneFrench, 'Test TG');
    assert.match(tg, /^https:\/\/t\.me\/share\/url\?url=&text=Test%20TG/);
  });

  await harness.test('triggerPhotoOnboarding arms J+2 reminder task in queue', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const now = 1762800000000;
    const expectedDueAt = now + (48 * 3600 * 1000);

    const res = engine.triggerPhotoOnboarding(
      { id: 'lead_artisan_42', name: 'Alain Travail', phone: '06 11 22 33 44' },
      'whatsapp',
      { currentTime: now }
    );

    assert.equal(res.success, true);
    assert.equal(res.reminderDueAt, expectedDueAt);
    assert.match(res.directUrl, /https:\/\/wa\.me\/33611223344/);

    const queue = engine.getScheduledQueue();
    assert.equal(queue.length, 1);
    const task = queue[0];
    assert.equal(task.type, 'PHOTO_REMINDER_J2');
    assert.equal(task.leadId, 'lead_artisan_42');
    assert.equal(task.status, 'PENDING');
    assert.equal(task.dueAt, expectedDueAt);
  });

  await harness.test('markPhotosReceived neutralizes pending J+2 reminder task', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);

    engine.triggerPhotoOnboarding({ id: 'lead_photo_check', name: 'Photos Recv Test' });
    let queue = engine.getScheduledQueue();
    assert.equal(queue[0].status, 'PENDING');

    const markRes = engine.markPhotosReceived('lead_photo_check');
    assert.equal(markRes.success, true);
    assert.equal(markRes.neutralizedTasks, 1);

    queue = engine.getScheduledQueue();
    assert.equal(queue[0].status, 'CANCELLED_RECEIVED');

    const logs = engine.getAutomationLogs({ module: 'R2_J2_WATCHDOG' });
    assert.ok(logs.some(l => l.message.includes('neutralized')));
  });

  await harness.test('checkAndTriggerPhotoReminders watchdog fires reminder when due date elapsed', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const t0 = 1762800000000;
    const tDue = t0 + (48 * 3600 * 1000);

    engine.triggerPhotoOnboarding({ id: 'lead_watchdog_fire', name: 'Fire Watchdog' }, 'whatsapp', { currentTime: t0 });

    // Before due date: no action
    const earlyReports = engine.checkAndTriggerPhotoReminders({ currentTime: t0 + 3600000 });
    assert.equal(earlyReports.length, 0);

    // At due date: reminder fires
    const dueReports = engine.checkAndTriggerPhotoReminders({ currentTime: tDue + 1000 });
    assert.equal(dueReports.length, 1);
    assert.equal(dueReports[0].action, 'REMINDER_SENT');
    assert.equal(dueReports[0].channel, 'whatsapp');

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'REMINDER_SENT');
  });

  // =========================================================================
  // 5. Requirement 4: Delivery Notification & 48h Google Review Watchdog
  // =========================================================================
  harness.suite('5. Requirement 4: Delivery Follow-up & 48h Google 5-Star Review');

  await harness.test('triggerDelivery generates notification with <0.4s speed and arms 48h review', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const t0 = 1762800000000;
    const expectedReviewDue = t0 + (48 * 3600 * 1000);

    const lead = {
      id: 'lead_deliv_1',
      name: 'Frédéric Menuisier',
      company: 'Menuiserie Frédéric SARL',
      city: 'Segré',
      phone: '06 12 34 56 78'
    };

    const res = engine.triggerDelivery(lead, null, { currentTime: t0 });
    assert.equal(res.success, true);
    assert.equal(res.deliveredAt, t0);
    assert.equal(res.reviewDueAt, expectedReviewDue);
    assert.match(res.deliveryUrl, /https:\/\/boubane\.com\/clients\/menuiserie-frederic-sarl/);

    // Verify verbatim assertions
    assert.match(res.deliveryMessage, /Votre nouveau site internet Boubane est officiellement en ligne/);
    assert.match(res.deliveryMessage, /< 0\.4 seconde/);
    assert.match(res.deliveryMessage, /plein écran/);

    // Verify task enqueued
    const queue = engine.getScheduledQueue();
    assert.equal(queue.length, 1);
    const task = queue[0];
    assert.equal(task.type, 'GOOGLE_REVIEW_48H');
    assert.equal(task.leadId, 'lead_deliv_1');
    assert.equal(task.reviewUrl, 'https://g.page/r/boubane/review');
    assert.equal(task.status, 'PENDING');
  });

  await harness.test('triggerDelivery idempotency prevents duplicate pending review tasks', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const lead = { id: 'lead_idempotent', name: 'Client Idempotent' };

    engine.triggerDelivery(lead);
    engine.triggerDelivery(lead); // second call without force

    const queue = engine.getScheduledQueue({ type: 'GOOGLE_REVIEW_48H', leadId: 'lead_idempotent' });
    assert.equal(queue.length, 1);
  });

  await harness.test('checkAndTriggerReviewRequests pauses on revisions and does not dispatch review', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const t0 = 1762800000000;
    const t48 = t0 + (48 * 3600 * 1000);

    engine.triggerDelivery({ id: 'lead_revision_test', name: 'Paul Peintre' }, null, { currentTime: t0 });

    // Client reports revision
    const pauseReports = engine.checkAndTriggerReviewRequests({
      currentTime: t0 + 1000,
      revisionReportedMap: { 'lead_revision_test': true }
    });

    assert.equal(pauseReports.length, 1);
    assert.equal(pauseReports[0].action, 'PAUSED_REVISIONS');

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'PAUSED_REVISIONS');

    // At 48h, review request MUST NOT be sent
    const at48Reports = engine.checkAndTriggerReviewRequests({ currentTime: t48 + 5000 });
    assert.equal(at48Reports.length, 0);
  });

  await harness.test('resumeReviewTimer unpauses review request with new due date', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const t0 = 1762800000000;

    engine.triggerDelivery({ id: 'lead_resume_test', name: 'Marc Bâti' }, null, { currentTime: t0 });
    engine.checkAndTriggerReviewRequests({
      currentTime: t0 + 1000,
      revisionReportedMap: { 'lead_resume_test': true }
    });

    // Revisions done, operator resumes timer for 24h
    const tResume = t0 + (86400000);
    const resumedTask = engine.resumeReviewTimer('lead_resume_test', {
      currentTime: tResume,
      delayMs: 24 * 3600 * 1000
    });

    assert.ok(resumedTask);
    assert.equal(resumedTask.status, 'PENDING');
    assert.equal(resumedTask.dueAt, tResume + (24 * 3600 * 1000));

    // Watchdog fires when new timer expires
    const fireReports = engine.checkAndTriggerReviewRequests({
      currentTime: resumedTask.dueAt + 1000
    });
    assert.equal(fireReports.length, 1);
    assert.equal(fireReports[0].action, 'REVIEW_SENT');
  });

  await harness.test('checkAndTriggerReviewRequests sends review message with Google review URL at 48h', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);
    const t0 = 1762800000000;
    const t48 = t0 + (48 * 3600 * 1000);

    engine.triggerDelivery({ id: 'lead_normal_review', name: 'Stéphane Bernard' }, null, { currentTime: t0 });

    const reports = engine.checkAndTriggerReviewRequests({ currentTime: t48 + 1000 });
    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'REVIEW_SENT');
    assert.match(reports[0].message, /Stéphane Bernard/);
    assert.match(reports[0].message, /https:\/\/g\.page\/r\/boubane\/review/);
    assert.match(reports[0].message, /avis 5 étoiles/);

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'REVIEW_SENT');
  });

  // =========================================================================
  // 6. Queue & FIFO Audit Log Engine
  // =========================================================================
  harness.suite('6. Queue & FIFO Audit Log Engine (Max 300 Entries)');

  await harness.test('Audit log strictly caps retention at max 300 entries (FIFO rotation)', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);

    // Insert 350 log entries
    for (let i = 1; i <= 350; i++) {
      engine._logAutomation('FIFO_TEST', 'INFO', `Entry ${i}`, { index: i });
    }

    const allLogs = engine.getAutomationLogs();
    assert.equal(allLogs.length, 300, 'Logs must be strictly capped at 300 entries');

    // First entry in log must be entry 51 (oldest 50 were purged)
    assert.equal(allLogs[0].details.index, 51);
    assert.equal(allLogs[299].details.index, 350);
  });

  await harness.test('Audit log filtering by modulePrefix, module, and level', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);

    engine._logAutomation('R1_CALCOM_INGESTION', 'INFO', 'Calcom ingested');
    engine._logAutomation('R1_TELEGRAM_DISPATCH', 'INFO', 'Telegram sent');
    engine._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', 'Onboarding triggered');
    engine._logAutomation('R4_DELIVERY_NOTIFICATION', 'ERROR', 'Delivery error');

    assert.equal(engine.getAutomationLogs({ modulePrefix: 'R1_' }).length, 2);
    assert.equal(engine.getAutomationLogs({ modulePrefix: 'R2_' }).length, 1);
    assert.equal(engine.getAutomationLogs({ module: 'R4_DELIVERY_NOTIFICATION' }).length, 1);
    assert.equal(engine.getAutomationLogs({ level: 'ERROR' }).length, 1);
    assert.equal(engine.getAutomationLogs({ level: 'INFO' }).length, 3);
  });

  await harness.test('clearAutomationLogs and clearQueue purge storage keys', async () => {
    const mockStore = new MockStorage();
    const engine = new BoubaneAutomations(mockStore);

    engine.triggerPhotoOnboarding({ id: 'lead_purge_test', name: 'Purge' });
    engine._logAutomation('R1_TEST', 'INFO', 'Log entry');

    assert.ok(engine.getScheduledQueue().length > 0);
    assert.ok(engine.getAutomationLogs().length > 0);

    engine.clearQueue();
    engine.clearAutomationLogs();

    assert.equal(engine.getScheduledQueue().length, 0);
    assert.equal(engine.getAutomationLogs().length, 0);
  });

  harness.summary();
}

runAllTests().catch(err => {
  console.error('\nFatal test runner error:', err);
  process.exit(1);
});
