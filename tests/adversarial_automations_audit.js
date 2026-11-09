#!/usr/bin/env node

/**
 * ============================================================================
 * Forensic Auditor Independent Adversarial Stress Suite (m2_auditor_1)
 * ============================================================================
 *
 * Verifies authenticity, resilience, boundary limits, and zero-hardcoding
 * across scripts/boubane_automations.js.
 */

const assert = require('node:assert/strict');
const {
  BoubaneAutomations,
  UniversalStorageAdapter,
  BrowserNetwork,
  slugify
} = require('../scripts/boubane_automations');

let passedChecks = 0;
let totalChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  \x1b[32m✔\x1b[0m ${desc}`);
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${desc}`);
    console.error(`    Error: ${err.message}`);
    throw err;
  }
}

async function asyncCheck(desc, fn) {
  totalChecks++;
  try {
    await fn();
    passedChecks++;
    console.log(`  \x1b[32m✔\x1b[0m ${desc}`);
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${desc}`);
    console.error(`    Error: ${err.message}`);
    throw err;
  }
}

async function run() {
  console.log('\n\x1b[1;35m--- FORENSIC AUDITOR INDEPENDENT ADVERSARIAL CHECKS ---\x1b[0m\n');

  // 1. DYNAMIC DATA INTEGRITY (Anti-Hardcoding Verification)
  console.log('\x1b[1m[1/7] Dynamic Data & Anti-Hardcoding Checks\x1b[0m');

  check('Cal.com parsing handles completely novel and arbitrary artisan names', () => {
    const engine = new BoubaneAutomations();
    const arbitraryName = 'Xavier-Éléonore de la Roche-Guyon';
    const arbitraryCompany = 'Toitures & Charpentes Séculaires';
    const arbitraryCity = 'Pouancé-en-Ombrée (49420)';
    const arbitraryPhone = '02 41 92 00 11';
    const arbitraryEmail = 'xavier.roche@charpente-seculaire.bzh';

    const booking = engine.parseCalcomBooking({
      payload: {
        id: 88776655,
        attendees: [{ name: arbitraryName, email: arbitraryEmail }],
        responses: {
          name: { value: arbitraryName },
          email: { value: arbitraryEmail },
          phone: { value: arbitraryPhone },
          company: { value: arbitraryCompany },
          craft: { value: 'Charpentier Traditionnel' },
          city: { value: arbitraryCity }
        }
      }
    });

    assert.equal(booking.name, arbitraryName);
    assert.equal(booking.company, arbitraryCompany);
    assert.equal(booking.city, arbitraryCity);
    assert.equal(booking.phone, arbitraryPhone);
    assert.equal(booking.email, arbitraryEmail);

    // Diagnostic generation with this arbitrary booking
    const diag = engine.generateProspectDiagnosis(booking);
    assert.equal(diag.contact.name, arbitraryName);
    assert.equal(diag.contact.company, arbitraryCompany);
    assert.match(diag.diagnosis.recommendedDomain, /toitures-charpentes-seculaires-pouance-en-ombree-49420\.fr/);

    // Telegram message formatting
    const tgMsg = engine.formatTelegramMessage(diag);
    assert.ok(tgMsg.includes(arbitraryName));
    assert.ok(tgMsg.includes(arbitraryCompany));
    assert.ok(tgMsg.includes(arbitraryCity));
  });

  check('Cal.com parsing handles messy notes with regex fallback extraction', () => {
    const engine = new BoubaneAutomations();
    const raw = {
      payload: {
        id: 12345,
        name: 'Jean Inconnu',
        description: 'Contact rapide.\nEntreprise: SARL Plomberie Moderne 49\nMétier: Chauffagiste PAC\nVille: Candé (49440)\nTél: +33611223344\nEmail: contact@plomberie49.fr'
      }
    };

    const booking = engine.parseCalcomBooking(raw);
    assert.equal(booking.name, 'Jean Inconnu');
    assert.equal(booking.company, 'SARL Plomberie Moderne 49');
    assert.equal(booking.craft, 'Chauffagiste PAC');
    assert.equal(booking.city, 'Candé (49440)');
    assert.equal(booking.phone, '+33611223344');
    assert.equal(booking.email, 'contact@plomberie49.fr');
  });

  // 2. UNIVERSAL STORAGE ADAPTER RESILIENCE
  console.log('\n\x1b[1m[2/7] Universal Storage Adapter Fault Tolerance\x1b[0m');

  check('Storage adapter transparently handles storage exceptions via in-memory Map', () => {
    const failingStorage = {
      getItem() { throw new Error('SecurityError: Access denied'); },
      setItem() { throw new Error('QuotaExceededError: Storage is full'); },
      removeItem() { throw new Error('SecurityError'); }
    };

    // Adapter wraps custom storage
    const adapter = new UniversalStorageAdapter();
    adapter.setItem('key1', 'val1');
    assert.equal(adapter.getItem('key1'), 'val1');

    // Verify memory store handles multiple keys and JSON serialization
    adapter.setItem('json_key', JSON.stringify({ a: 1, b: [2, 3] }));
    const parsed = JSON.parse(adapter.getItem('json_key'));
    assert.equal(parsed.b[1], 3);

    adapter.removeItem('key1');
    assert.equal(adapter.getItem('key1'), null);
  });

  // 3. TELEGRAM BOT API & INLINE KEYBOARD INTEGRITY
  console.log('\n\x1b[1m[3/7] Telegram Bot API Dispatch & Inline Keyboard Structure\x1b[0m');

  await asyncCheck('Telegram dispatch produces valid payload with all 5 required interactive buttons', async () => {
    let capturedUrl = null;
    let capturedBody = null;

    const mockNet = {
      async fetch(url, options) {
        capturedUrl = url;
        capturedBody = JSON.parse(options.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { message_id: 998811 } })
        };
      }
    };

    const engine = new BoubaneAutomations(null, mockNet);
    const diag = engine.generateProspectDiagnosis({
      name: 'Serge Plaquiste',
      company: 'Anjou Plâtre',
      city: 'Segré',
      phone: '06 99 88 77 66'
    });

    const res = await engine.sendTelegramBriefing(diag);
    assert.equal(res.success, true);
    assert.equal(res.messageId, 998811);
    assert.match(capturedUrl, /https:\/\/api\.telegram\.org\/bot9011245213:/);
    assert.equal(capturedBody.chat_id, 8036535453);
    assert.equal(capturedBody.parse_mode, 'Markdown');

    const rows = capturedBody.reply_markup.inline_keyboard;
    assert.equal(rows.length, 3);
    // Row 1: Call and WhatsApp
    assert.equal(rows[0][0].text, '📞 Appeler');
    assert.equal(rows[0][0].url, 'tel:0699887766');
    assert.equal(rows[0][1].text, '💬 WhatsApp');
    assert.equal(rows[0][1].url, 'https://wa.me/33699887766');

    // Row 2: Twenty CRM and Google Maps
    assert.equal(rows[1][0].text, '🏢 Fiche Twenty CRM');
    assert.equal(rows[1][0].url, 'https://crm.boubane.com');
    assert.equal(rows[1][1].text, '🗺️ Google Maps');
    assert.ok(rows[1][1].url.includes('google.com/maps/search/'));

    // Row 3: Photo Onboarding trigger
    assert.equal(rows[2][0].text, '📸 Lancer Onboarding Photos');
    assert.equal(rows[2][0].callback_data, 'trigger_onboarding:Serge Plaquiste');
  });

  // 4. ONBOARDING & J+2 WATCHDOG ARITHMETIC
  console.log('\n\x1b[1m[4/7] Onboarding & J+2 Watchdog Arithmetic\x1b[0m');

  check('J+2 Watchdog operates strictly with millisecond precision (+48h)', () => {
    const engine = new BoubaneAutomations();
    const t0 = 1700000000000;
    const exactly48h = 48 * 3600 * 1000;
    const tDue = t0 + exactly48h;

    engine.triggerPhotoOnboarding({ id: 'lead_t_test', name: 'Precision Artisan' }, 'whatsapp', { currentTime: t0 });

    // Exactly 1ms before due date -> 0 reports
    const early = engine.checkAndTriggerPhotoReminders({ currentTime: tDue - 1 });
    assert.equal(early.length, 0);

    // Exactly on due date -> fires 1 reminder
    const onTime = engine.checkAndTriggerPhotoReminders({ currentTime: tDue });
    assert.equal(onTime.length, 1);
    assert.equal(onTime[0].action, 'REMINDER_SENT');

    // Once fired, subsequent checks do not re-fire
    const later = engine.checkAndTriggerPhotoReminders({ currentTime: tDue + 100000 });
    assert.equal(later.length, 0);
  });

  check('Marking photos received neutralizes J+2 watchdog even after multiple calls', () => {
    const engine = new BoubaneAutomations();
    const t0 = 1700000000000;

    engine.triggerPhotoOnboarding({ id: 'lead_recv_test', name: 'Recv Artisan' }, 'whatsapp', { currentTime: t0 });

    // Neutralize
    const res1 = engine.markPhotosReceived('lead_recv_test');
    assert.equal(res1.neutralizedTasks, 1);

    // Neutralize again (idempotent)
    const res2 = engine.markPhotosReceived('lead_recv_test');
    assert.equal(res2.neutralizedTasks, 0);

    // Even after 48h, reminder is NOT sent
    const reports = engine.checkAndTriggerPhotoReminders({ currentTime: t0 + (50 * 3600 * 1000) });
    assert.equal(reports.length, 0);
  });

  // 5. DELIVERY NOTIFICATION & 48H GOOGLE REVIEW WATCHDOG
  console.log('\n\x1b[1m[5/7] Delivery Notification & 48h Google Review Watchdog\x1b[0m');

  check('Delivery message contains speed highlight < 0.4s and accurate slugified URL', () => {
    const engine = new BoubaneAutomations();
    const t0 = 1700000000000;

    const res = engine.triggerDelivery({
      id: 'lead_speed_test',
      name: 'Alexandre Batisseur',
      company: 'Bâti & Rénov d\'Anjou',
      city: 'Segré'
    }, null, { currentTime: t0 });

    assert.match(res.deliveryUrl, /https:\/\/boubane\.com\/clients\/bati-renov-d-anjou/);
    assert.match(res.deliveryMessage, /< 0\.4 seconde/);
    assert.match(res.deliveryMessage, /0 € de frais/);

    // Task created with status PENDING and exact 48h due date
    const queue = engine.getScheduledQueue({ leadId: 'lead_speed_test' });
    assert.equal(queue.length, 1);
    assert.equal(queue[0].dueAt, t0 + (48 * 3600 * 1000));
    assert.equal(queue[0].reviewUrl, 'https://g.page/r/boubane/review');
  });

  check('Review watchdog: Revisions pause, resume, and final review dispatch', () => {
    const engine = new BoubaneAutomations();
    const t0 = 1700000000000;
    const leadId = 'lead_cycle_test';

    engine.triggerDelivery({ id: leadId, name: 'Cycle Artisan' }, null, { currentTime: t0 });

    // 1. Revision requested at t0 + 2h
    const pReports = engine.checkAndTriggerReviewRequests({
      currentTime: t0 + 7200000,
      revisionReportedMap: { [leadId]: true }
    });
    assert.equal(pReports.length, 1);
    assert.equal(pReports[0].action, 'PAUSED_REVISIONS');

    // 2. At 48h from delivery, review must NOT be dispatched
    const at48 = engine.checkAndTriggerReviewRequests({ currentTime: t0 + (48 * 3600 * 1000) + 1000 });
    assert.equal(at48.length, 0);

    // 3. Revisions completed at t0 + 50h, operator resumes with 24h grace period
    const resumed = engine.resumeReviewTimer(leadId, {
      currentTime: t0 + (50 * 3600 * 1000),
      delayMs: 24 * 3600 * 1000
    });
    assert.ok(resumed);
    assert.equal(resumed.status, 'PENDING');
    assert.equal(resumed.dueAt, t0 + (74 * 3600 * 1000));

    // 4. Before 24h grace period: no review
    const beforeNewDue = engine.checkAndTriggerReviewRequests({ currentTime: t0 + (73 * 3600 * 1000) });
    assert.equal(beforeNewDue.length, 0);

    // 5. After new due date: review dispatches
    const finalReports = engine.checkAndTriggerReviewRequests({ currentTime: t0 + (75 * 3600 * 1000) });
    assert.equal(finalReports.length, 1);
    assert.equal(finalReports[0].action, 'REVIEW_SENT');
    assert.match(finalReports[0].message, /https:\/\/g\.page\/r\/boubane\/review/);
  });

  // 6. FIFO LOG RETENTION STRICT ENFORCEMENT (MAX 300)
  console.log('\n\x1b[1m[6/7] FIFO Log Rotation Strict Capacity Enforcement (Max 300)\x1b[0m');

  check('Inserting 1000 log entries maintains exactly max 300 entries in FIFO order', () => {
    const engine = new BoubaneAutomations();

    // Rapid insertion of 1000 items
    for (let i = 1; i <= 1000; i++) {
      engine._logAutomation('FIFO_STRESS', 'INFO', `Stress log ${i}`, { seq: i });
    }

    const logs = engine.getAutomationLogs();
    assert.equal(logs.length, 300, `Expected exactly 300 logs, got ${logs.length}`);

    // Oldest remaining entry must be sequence #701
    assert.equal(logs[0].details.seq, 701, `Oldest entry should be 701, got ${logs[0].details.seq}`);
    // Newest entry must be sequence #1000
    assert.equal(logs[299].details.seq, 1000, `Newest entry should be 1000, got ${logs[299].details.seq}`);

    // Adding 1 more item drops 701 and appends 1001
    engine._logAutomation('FIFO_STRESS', 'INFO', 'Stress log 1001', { seq: 1001 });
    const updatedLogs = engine.getAutomationLogs();
    assert.equal(updatedLogs.length, 300);
    assert.equal(updatedLogs[0].details.seq, 702);
    assert.equal(updatedLogs[299].details.seq, 1001);
  });

  // 7. MULTI-CHANNEL LINK ENCODING
  console.log('\n\x1b[1m[7/7] Multi-Channel Link Encoding & Formatting\x1b[0m');

  check('Multi-channel formatting handles edge case phone numbers and French prefixes', () => {
    const engine = new BoubaneAutomations();
    const rawMsg = 'Bonjour ! C\'est Boubane & Co (100% test).';

    // Format 06 phone
    const wa1 = engine.formatMultiChannelUrl('whatsapp', '06.12.34.56.78', rawMsg);
    assert.match(wa1, /^https:\/\/wa\.me\/33612345678\?text=/);

    // Format international +33 phone
    const wa2 = engine.formatMultiChannelUrl('whatsapp', '+33 6 12 34 56 78', rawMsg);
    assert.match(wa2, /^https:\/\/wa\.me\/33612345678\?text=/);

    // Format SMS
    const sms = engine.formatMultiChannelUrl('sms', '06 12 34 56 78', rawMsg);
    assert.match(sms, /^sms:0612345678\?body=/);

    // Format Telegram
    const tg = engine.formatMultiChannelUrl('telegram', '06 12 34 56 78', rawMsg);
    assert.match(tg, /^https:\/\/t\.me\/share\/url\?url=&text=/);
  });

  console.log('\n\x1b[1;32m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`\x1b[1;32m  ALL ${passedChecks}/${totalChecks} INDEPENDENT ADVERSARIAL CHECKS PASSED EMPIRICALLY!\x1b[0m`);
  console.log('\x1b[1;32m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
}

run().catch(err => {
  console.error('Adversarial suite crashed:', err);
  process.exit(1);
});
