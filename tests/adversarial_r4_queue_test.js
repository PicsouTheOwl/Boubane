#!/usr/bin/env node

/**
 * ============================================================================
 * Boubane Automations Engine — Milestone 2 Adversarial Stress Test Suite
 * ============================================================================
 *
 * EMPIRICAL ADVERSARIAL CHALLENGER (m2_challenger_2)
 * Scope:
 * - Requirement 4: Delivery Follow-up & 48h Google Review Watchdog
 * - Queue & Log Engine: FIFO Cap Rotation (Strictly 300 entries on 1,000-log flood)
 * - UniversalStorageAdapter: QuotaExceededError, SecurityError, and Corrupted Storage
 *
 * Usage:
 *   node tests/adversarial_r4_queue_test.js
 *   node tests/adversarial_r4_queue_test.js --verbose
 */

const assert = require('node:assert/strict');
const path = require('node:path');

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

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

class AdversarialHarness {
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
      console.log(`\n\x1b[1;35m[ADVERSARIAL SUITE]\x1b[0m \x1b[1m${name}\x1b[0m`);
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
      console.log(`\n  \x1b[31m✖ [FAIL]\x1b[0m ${name}`);
      console.log(`    \x1b[31mError:\x1b[0m ${err.message}`);
      if (err.stack) {
        console.log(`    ${err.stack.split('\n').slice(1, 4).join('\n    ')}`);
      }
    }
  }

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log('\n\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`\x1b[1m  Boubane Automations — Adversarial Stress Test Summary (m2_challenger_2)\x1b[0m`);
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`  Total Adversarial Checks : ${this.total}`);
    console.log(`  Passed                   : \x1b[32m${this.passed}\x1b[0m`);
    console.log(`  Failed                   : ${this.failed > 0 ? `\x1b[31m${this.failed}\x1b[0m` : '0'}`);
    console.log(`  Duration                 : ${duration}s`);
    console.log('───────────────────────────────────────────────────────────────────────────');
    if (this.failed === 0) {
      console.log('  \x1b[1;32mVERDICT: ALL ADVERSARIAL STRESS CHECKS PASSED (APPROVE)\x1b[0m');
      console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
      return true;
    } else {
      console.log('  \x1b[1;31mVERDICT: ADVERSARIAL VULNERABILITIES DETECTED (REQUEST_CHANGES)\x1b[0m');
      console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
      return false;
    }
  }
}

const harness = new AdversarialHarness();

async function runAdversarialTests() {
  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;35m  Running Empirical Adversarial Stress Suite (R4, Queue, Storage)\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');

  if (!isVerbose) {
    process.stdout.write('  Stress testing: ');
  }

  // =========================================================================
  // SUITE 1: Requirement 4 — Rapid Repeated Delivery & Strict Idempotency
  // =========================================================================
  harness.suite('1. Requirement 4: Delivery Rapid Triggers & Idempotency');

  await harness.test('Rapid loop: 100 sequential delivery triggers for same lead produce exactly 1 pending review task', async () => {
    const engine = new BoubaneAutomations();
    const lead = {
      id: 'lead_stress_idem_1',
      name: 'Artisan Rapide SAS',
      company: 'Rapide Rénovation',
      city: 'Segré',
      phone: '06 12 34 56 78'
    };
    const t0 = 1762800000000;

    for (let i = 0; i < 100; i++) {
      const res = engine.triggerDelivery(lead, null, { currentTime: t0 + (i * 50) });
      assert.equal(res.success, true);
      assert.match(res.deliveryMessage, /< 0\.4 seconde/);
    }

    const tasks = engine.getScheduledQueue({ type: 'GOOGLE_REVIEW_48H', leadId: 'lead_stress_idem_1' });
    assert.equal(tasks.length, 1, 'Queue must strictly contain only 1 review task for this lead');
    assert.equal(tasks[0].status, 'PENDING');
    assert.equal(tasks[0].scheduledAt, t0);
    assert.equal(tasks[0].dueAt, t0 + (48 * 3600 * 1000));

    // Audit logs should only record initial arming, not 100 duplicate arming logs
    const deliveryLogs = engine.getAutomationLogs({ module: 'R4_DELIVERY_NOTIFICATION' });
    assert.equal(deliveryLogs.length, 1, 'Only 1 delivery notification log should be generated without force');
  });

  await harness.test('Explicit force re-arming: options.force=true allows intentional replacement/re-enqueue', async () => {
    const engine = new BoubaneAutomations();
    const lead = { id: 'lead_force_rearm', name: 'Artisan Force' };
    const t0 = 1762800000000;

    engine.triggerDelivery(lead, null, { currentTime: t0 });
    assert.equal(engine.getScheduledQueue().length, 1);

    // Call with force = true and a later timestamp
    const t1 = t0 + 10000;
    engine.triggerDelivery(lead, null, { currentTime: t1, force: true });
    assert.equal(engine.getScheduledQueue().length, 2, 'With force=true, a new task is explicitly allowed');

    const tasks = engine.getScheduledQueue({ leadId: 'lead_force_rearm' });
    assert.equal(tasks.length, 2);
    assert.equal(tasks[1].scheduledAt, t1);
  });

  await harness.test('Post-REVIEW_SENT protection: triggerDelivery does NOT re-arm a task if review was already sent', async () => {
    const engine = new BoubaneAutomations();
    const lead = { id: 'lead_already_sent', name: 'Client Déjà Reçu' };
    const t0 = 1762800000000;

    engine.triggerDelivery(lead, null, { currentTime: t0 });
    // Watchdog fires review at 48h
    engine.checkAndTriggerReviewRequests({ currentTime: t0 + (49 * 3600 * 1000) });

    const beforeQueue = engine.getScheduledQueue();
    assert.equal(beforeQueue.length, 1);
    assert.equal(beforeQueue[0].status, 'REVIEW_SENT');

    // Trigger delivery again 2 days later
    engine.triggerDelivery(lead, null, { currentTime: t0 + (96 * 3600 * 1000) });

    const afterQueue = engine.getScheduledQueue();
    assert.equal(afterQueue.length, 1, 'Must NOT enqueue duplicate review follow-up after review was already sent');
    assert.equal(afterQueue[0].status, 'REVIEW_SENT');
  });

  await harness.test('Lead identifier fallback: handles numeric id, string id, and missing id (fallback to name)', async () => {
    const engine = new BoubaneAutomations();

    // Lead with numeric id 90210
    const res1 = engine.triggerDelivery({ id: 90210, name: 'Num Lead' }, 'https://site1.fr');
    assert.equal(res1.success, true);
    let q = engine.getScheduledQueue({ leadId: '90210' });
    assert.equal(q.length, 1);

    // Lead without id, only name
    const res2 = engine.triggerDelivery({ name: 'OnlyName Lead' }, 'https://site2.fr');
    assert.equal(res2.success, true);
    q = engine.getScheduledQueue({ leadId: 'OnlyName Lead' });
    assert.equal(q.length, 1);

    // Lead with empty string id -> falls back to name
    const res3 = engine.triggerDelivery({ id: '', name: 'EmptyId Lead' }, 'https://site3.fr');
    assert.equal(res3.success, true);
    q = engine.getScheduledQueue({ leadId: 'EmptyId Lead' });
    assert.equal(q.length, 1);
  });

  await harness.test('Delivery URL fallback and sanitization preserves speed guarantee and Google review URL', async () => {
    const engine = new BoubaneAutomations();
    const lead = {
      name: 'Jean Bâtisseur',
      company: 'Bâtisseur & Fils SAS',
      city: 'Château-Gontier'
    };

    // No deliveryUrl provided -> automatic slug fallback
    const res = engine.triggerDelivery(lead);
    assert.match(res.deliveryUrl, /^https:\/\/boubane\.com\/clients\/batisseur-fils-sas$/);
    assert.match(res.deliveryMessage, /https:\/\/boubane\.com\/clients\/batisseur-fils-sas/);
    assert.match(res.deliveryMessage, /< 0\.4 seconde/);
    assert.match(res.deliveryMessage, /Château-Gontier/);
    assert.match(res.deliveryMessage, /0 € de frais, aucun engagement/);

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.reviewUrl, 'https://g.page/r/boubane/review');
  });

  // =========================================================================
  // SUITE 2: Requirement 4 — PAUSED_REVISIONS Lifecycle & State Resumption
  // =========================================================================
  harness.suite('2. Requirement 4: PAUSED_REVISIONS Lifecycle & State Resumption');

  await harness.test('Complete revision cycle: PENDING -> PAUSED_REVISIONS -> resumeReviewTimer -> REVIEW_SENT', async () => {
    const engine = new BoubaneAutomations();
    const t0 = 1762800000000;
    const t48 = t0 + (48 * 3600 * 1000);

    engine.triggerDelivery({ id: 'lead_full_cycle', name: 'Cycle Complet' }, null, { currentTime: t0 });

    // Client requests revision at t0 + 10 hours
    const pauseReports = engine.checkAndTriggerReviewRequests({
      currentTime: t0 + (10 * 3600 * 1000),
      revisionReportedMap: { 'lead_full_cycle': true }
    });
    assert.equal(pauseReports.length, 1);
    assert.equal(pauseReports[0].action, 'PAUSED_REVISIONS');

    let task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'PAUSED_REVISIONS');
    assert.equal(task.pausedAt, t0 + (10 * 3600 * 1000));

    // Watchdog passes t48 original due date: MUST NOT trigger review
    const watchdogAtOriginalDue = engine.checkAndTriggerReviewRequests({ currentTime: t48 + 1000 });
    assert.equal(watchdogAtOriginalDue.length, 0, 'No review should fire while paused');
    task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'PAUSED_REVISIONS');

    // Operator finishes revisions at t0 + 60h and resumes timer for 24h
    const tResume = t0 + (60 * 3600 * 1000);
    const resumed = engine.resumeReviewTimer('lead_full_cycle', {
      currentTime: tResume,
      delayMs: 24 * 3600 * 1000
    });
    assert.ok(resumed);
    assert.equal(resumed.status, 'PENDING');
    assert.equal(resumed.resumedAt, tResume);
    assert.equal(resumed.dueAt, tResume + (24 * 3600 * 1000));

    // Watchdog at tResume + 12h: still not due
    const midReports = engine.checkAndTriggerReviewRequests({ currentTime: tResume + (12 * 3600 * 1000) });
    assert.equal(midReports.length, 0);

    // Watchdog at tResume + 24h + 1s: fires review
    const fireReports = engine.checkAndTriggerReviewRequests({ currentTime: tResume + (24 * 3600 * 1000) + 1000 });
    assert.equal(fireReports.length, 1);
    assert.equal(fireReports[0].action, 'REVIEW_SENT');
    assert.match(fireReports[0].message, /https:\/\/g\.page\/r\/boubane\/review/);

    task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'REVIEW_SENT');
    assert.equal(task.executedAt, tResume + (24 * 3600 * 1000) + 1000);
  });

  await harness.test('resumeReviewTimer rejects invalid targets and states safely without exceptions', async () => {
    const engine = new BoubaneAutomations();
    const t0 = 1762800000000;

    // Target does not exist
    assert.equal(engine.resumeReviewTimer('nonexistent_id'), null);

    // Target is PENDING (not paused)
    engine.triggerDelivery({ id: 'lead_not_paused', name: 'Pas Pausé' }, null, { currentTime: t0 });
    assert.equal(engine.resumeReviewTimer('lead_not_paused'), null);

    // Target is REVIEW_SENT
    engine.checkAndTriggerReviewRequests({ currentTime: t0 + (50 * 3600 * 1000) });
    assert.equal(engine.resumeReviewTimer('lead_not_paused'), null);

    // Target is CANCELLED_ALREADY_REVIEWED
    engine.triggerDelivery({ id: 'lead_cancelled', name: 'Annulé' }, null, { currentTime: t0 });
    engine.checkAndTriggerReviewRequests({ currentTime: t0 + 1000, reviewedLeadsMap: { 'lead_cancelled': true } });
    assert.equal(engine.resumeReviewTimer('lead_cancelled'), null);
  });

  await harness.test('resumeReviewTimer works equally by taskId or leadId', async () => {
    const engine = new BoubaneAutomations();
    const t0 = 1762800000000;

    const res1 = engine.triggerDelivery({ id: 'lead_by_lead_id', name: 'Lead 1' }, null, { currentTime: t0 });
    const res2 = engine.triggerDelivery({ id: 'lead_by_task_id', name: 'Lead 2' }, null, { currentTime: t0 });

    engine.checkAndTriggerReviewRequests({
      currentTime: t0 + 1000,
      revisionReportedMap: { 'lead_by_lead_id': true, 'lead_by_task_id': true }
    });

    // Resume lead 1 by leadId
    const resumed1 = engine.resumeReviewTimer('lead_by_lead_id', { currentTime: t0 + 2000 });
    assert.ok(resumed1);
    assert.equal(resumed1.status, 'PENDING');

    // Resume lead 2 by taskId
    const resumed2 = engine.resumeReviewTimer(res2.reviewTaskId, { currentTime: t0 + 2000 });
    assert.ok(resumed2);
    assert.equal(resumed2.status, 'PENDING');
  });

  // =========================================================================
  // SUITE 3: Requirement 4 — Client Already Reviewed Scenarios & Precedence
  // =========================================================================
  harness.suite('3. Requirement 4: Client Already Reviewed Scenarios');

  await harness.test('Early review permanently neutralizes review request task', async () => {
    const engine = new BoubaneAutomations();
    const t0 = 1762800000000;

    engine.triggerDelivery({ id: 'lead_early_review', name: 'Artisan Zélé' }, null, { currentTime: t0 });

    // Client gives 5-star review at t0 + 5h (before 48h watchdog)
    const reports = engine.checkAndTriggerReviewRequests({
      currentTime: t0 + (5 * 3600 * 1000),
      reviewedLeadsMap: { 'lead_early_review': true }
    });

    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'NEUTRALIZED_ALREADY_REVIEWED');

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'CANCELLED_ALREADY_REVIEWED');

    // Watchdog runs at 48h and 72h: must NEVER fire
    const lateReports48 = engine.checkAndTriggerReviewRequests({ currentTime: t0 + (48 * 3600 * 1000) + 1000 });
    assert.equal(lateReports48.length, 0);

    const lateReports72 = engine.checkAndTriggerReviewRequests({ currentTime: t0 + (72 * 3600 * 1000) });
    assert.equal(lateReports72.length, 0);
  });

  await harness.test('Precedence check: revisionReportedMap takes precedence over reviewedLeadsMap if both provided', async () => {
    const engine = new BoubaneAutomations();
    const t0 = 1762800000000;

    engine.triggerDelivery({ id: 'lead_both_flags', name: 'Client Double' }, null, { currentTime: t0 });

    // Both flags true in options
    const reports = engine.checkAndTriggerReviewRequests({
      currentTime: t0 + 1000,
      revisionReportedMap: { 'lead_both_flags': true },
      reviewedLeadsMap: { 'lead_both_flags': true }
    });

    assert.equal(reports.length, 1);
    // As per line 807, revisions check evaluates before alreadyReviewed
    assert.equal(reports[0].action, 'PAUSED_REVISIONS');

    const task = engine.getScheduledQueue()[0];
    assert.equal(task.status, 'PAUSED_REVISIONS');
  });

  await harness.test('Mixed queue watchdog pass handles independent statuses in single loop execution', async () => {
    const engine = new BoubaneAutomations();
    const now = 1762800000000;
    const past = now - 3600000;
    const future = now + 3600000;

    // Enqueue 6 distinct tasks
    engine._enqueueTask({ id: 'm1_future', type: 'GOOGLE_REVIEW_48H', leadId: 'm1', leadName: 'M1', status: 'PENDING', dueAt: future });
    engine._enqueueTask({ id: 'm2_due_normal', type: 'GOOGLE_REVIEW_48H', leadId: 'm2', leadName: 'M2', status: 'PENDING', dueAt: past });
    engine._enqueueTask({ id: 'm3_due_rev', type: 'GOOGLE_REVIEW_48H', leadId: 'm3', leadName: 'M3', status: 'PENDING', dueAt: past });
    engine._enqueueTask({ id: 'm4_due_done', type: 'GOOGLE_REVIEW_48H', leadId: 'm4', leadName: 'M4', status: 'PENDING', dueAt: past });
    engine._enqueueTask({ id: 'm5_paused', type: 'GOOGLE_REVIEW_48H', leadId: 'm5', leadName: 'M5', status: 'PAUSED_REVISIONS', dueAt: past });
    engine._enqueueTask({ id: 'm6_other_type', type: 'PHOTO_REMINDER_J2', leadId: 'm6', leadName: 'M6', status: 'PENDING', dueAt: past });

    const reports = engine.checkAndTriggerReviewRequests({
      currentTime: now,
      revisionReportedMap: { 'm3': true },
      reviewedLeadsMap: { 'm4': true }
    });

    assert.equal(reports.length, 3);
    assert.ok(reports.some(r => r.taskId === 'm2_due_normal' && r.action === 'REVIEW_SENT'));
    assert.ok(reports.some(r => r.taskId === 'm3_due_rev' && r.action === 'PAUSED_REVISIONS'));
    assert.ok(reports.some(r => r.taskId === 'm4_due_done' && r.action === 'NEUTRALIZED_ALREADY_REVIEWED'));

    const q = engine.getScheduledQueue();
    assert.equal(q.find(t => t.id === 'm1_future').status, 'PENDING');
    assert.equal(q.find(t => t.id === 'm2_due_normal').status, 'REVIEW_SENT');
    assert.equal(q.find(t => t.id === 'm3_due_rev').status, 'PAUSED_REVISIONS');
    assert.equal(q.find(t => t.id === 'm4_due_done').status, 'CANCELLED_ALREADY_REVIEWED');
    assert.equal(q.find(t => t.id === 'm5_paused').status, 'PAUSED_REVISIONS');
    assert.equal(q.find(t => t.id === 'm6_other_type').status, 'PENDING');
  });

  // =========================================================================
  // SUITE 4: FIFO Audit Log Engine — 1,000-Log Flood Stress Test
  // =========================================================================
  harness.suite('4. FIFO Audit Log Engine: 1,000-Log Flood & Invariants');

  await harness.test('1,000-log flood in tight loop strictly maintains maximum cap of 300 entries', async () => {
    const engine = new BoubaneAutomations();

    // Flood with 1,000 logs, asserting cap every 50 logs
    for (let i = 1; i <= 1000; i++) {
      engine._logAutomation('STRESS_MODULE', 'INFO', `Stress entry number ${i}`, { seq: i });

      if (i % 50 === 0) {
        const currentLogs = engine.getAutomationLogs();
        const expectedCount = Math.min(i, 300);
        assert.equal(
          currentLogs.length,
          expectedCount,
          `At iteration ${i}, log count should be ${expectedCount} but was ${currentLogs.length}`
        );
      }
    }

    const finalLogs = engine.getAutomationLogs();
    assert.equal(finalLogs.length, 300, 'Final log length must be strictly capped at 300');
  });

  await harness.test('FIFO rotation guarantees strict chronological order and oldest-purged invariant', async () => {
    const engine = new BoubaneAutomations();

    for (let i = 1; i <= 1000; i++) {
      engine._logAutomation('ORDER_TEST', 'INFO', `Item ${i}`, { seq: i });
    }

    const logs = engine.getAutomationLogs();
    assert.equal(logs.length, 300);

    // Oldest surviving entry must be #701 (entries 1-700 were purged in FIFO order)
    assert.equal(logs[0].details.seq, 701, 'Oldest surviving entry must be #701');
    assert.equal(logs[299].details.seq, 1000, 'Newest entry must be #1000');

    // Verify strict monotonic increment without gaps or ordering inversion
    for (let j = 0; j < 300; j++) {
      assert.equal(logs[j].details.seq, 701 + j, `Log at index ${j} must have seq ${701 + j}`);
      assert.ok(logs[j].id.startsWith('log_'));
      assert.ok(logs[j].timestamp);
      assert.equal(logs[j].status, 'SUCCESS');
    }
  });

  await harness.test('Audit log filtering operates accurately across full 300-entry capacity', async () => {
    const engine = new BoubaneAutomations();

    // Populate with 100 entries of R1, 100 of R2, 100 of R4
    for (let i = 1; i <= 100; i++) engine._logAutomation('R1_CALCOM', 'INFO', `R1 log ${i}`);
    for (let i = 1; i <= 100; i++) engine._logAutomation('R2_PHOTOS', 'INFO', `R2 log ${i}`);
    for (let i = 1; i <= 90; i++) engine._logAutomation('R4_DELIVERY', 'INFO', `R4 log ${i}`);
    for (let i = 1; i <= 10; i++) engine._logAutomation('R4_DELIVERY', 'ERROR', `R4 error ${i}`);

    const all = engine.getAutomationLogs();
    assert.equal(all.length, 300);

    const r1Logs = engine.getAutomationLogs({ modulePrefix: 'R1_' });
    assert.equal(r1Logs.length, 100);

    const r2Logs = engine.getAutomationLogs({ module: 'R2_PHOTOS' });
    assert.equal(r2Logs.length, 100);

    const r4Logs = engine.getAutomationLogs({ module: 'R4_DELIVERY' });
    assert.equal(r4Logs.length, 100);

    const errorLogs = engine.getAutomationLogs({ level: 'ERROR' });
    assert.equal(errorLogs.length, 10);
    assert.equal(errorLogs[0].status, 'FAILURE');

    const emptyFilter = engine.getAutomationLogs({ module: 'NONEXISTENT' });
    assert.equal(emptyFilter.length, 0);
  });

  // =========================================================================
  // SUITE 5: UniversalStorageAdapter — QuotaExceededError & Security Exceptions
  // =========================================================================
  harness.suite('5. UniversalStorageAdapter: QuotaExceededError & Error Resilience');

  await harness.test('QuotaExceededError during setItem switches seamlessly to in-memory store without throwing', async () => {
    // Mock browser localStorage with artificial 3-item quota
    const quotaStore = new Map();
    const mockLocalStorage = {
      getItem(k) { return quotaStore.has(k) ? quotaStore.get(k) : null; },
      setItem(k, v) {
        if (quotaStore.size >= 3) {
          const err = new DOMException('The quota has been exceeded.', 'QuotaExceededError');
          err.code = 22;
          throw err;
        }
        quotaStore.set(k, String(v));
      },
      removeItem(k) { quotaStore.delete(k); },
      clear() { quotaStore.clear(); },
      get length() { return quotaStore.size; },
      key(idx) { return Array.from(quotaStore.keys())[idx] || null; }
    };

    global.window = { localStorage: mockLocalStorage };

    try {
      const adapter = new UniversalStorageAdapter();
      assert.equal(adapter.isLocalStorageAvailable, true);

      // Writes 1 and 2 succeed in localStorage
      adapter.setItem('k1', 'val1');
      adapter.setItem('k2', 'val2');
      assert.equal(adapter.isLocalStorageAvailable, true);
      assert.equal(adapter.getItem('k1'), 'val1');

      // Write 3 fills quota (size reaches 3)
      adapter.setItem('k3', 'val3');
      assert.equal(adapter.isLocalStorageAvailable, true);

      // Write 4 triggers QuotaExceededError!
      // Adapter MUST catch it, flip isLocalStorageAvailable to false, and save to memoryStore without throwing
      let threw = false;
      try {
        adapter.setItem('k4', 'val4');
      } catch (e) {
        threw = true;
      }
      assert.equal(threw, false, 'setItem must NOT throw QuotaExceededError');
      assert.equal(adapter.isLocalStorageAvailable, false, 'Adapter must mark localStorage unavailable');

      // Seamless read-after-write verification from in-memory fallback
      assert.equal(adapter.getItem('k4'), 'val4', 'k4 must be readable from in-memory fallback');
      assert.equal(adapter.getItem('k1'), 'val1', 'k1 must still be readable from mirrored memory');
      assert.equal(adapter.length, 4, 'adapter.length must reflect all 4 stored keys');

      // Subsequent writes continue in memory without throwing
      adapter.setItem('k5', 'val5');
      assert.equal(adapter.getItem('k5'), 'val5');
      assert.equal(adapter.length, 5);

      // removeItem operates cleanly
      adapter.removeItem('k1');
      assert.equal(adapter.getItem('k1'), null);
      assert.equal(adapter.length, 4);

      // clear operates cleanly
      adapter.clear();
      assert.equal(adapter.length, 0);
      assert.equal(adapter.getItem('k5'), null);
    } finally {
      delete global.window;
    }
  });

  await harness.test('BoubaneAutomations workflow executes completely under simulated QuotaExceededError', async () => {
    // Quota fails specifically when boubane_automations_log reaches 50 entries
    const store = new Map();
    const mockLocalStorage = {
      getItem(k) { return store.has(k) ? store.get(k) : null; },
      setItem(k, v) {
        if (k === 'boubane_automations_log' && store.has(k) && store.get(k).length > 500) {
          const err = new DOMException('Storage quota exceeded', 'QuotaExceededError');
          err.code = 22;
          throw err;
        }
        store.set(k, String(v));
      },
      removeItem(k) { store.delete(k); },
      clear() { store.clear(); },
      get length() { return store.size; }
    };

    global.window = { localStorage: mockLocalStorage };

    try {
      const engine = new BoubaneAutomations();
      assert.equal(engine.storage.isLocalStorageAvailable, true);

      // 1. Trigger Delivery
      const delivRes = engine.triggerDelivery(
        { id: 'lead_quota_e2e', name: 'Quota E2E Client', company: 'BTP Quota' },
        'https://boubane.com/clients/btp-quota'
      );
      assert.equal(delivRes.success, true);

      // 2. Flood logs to trigger QuotaExceededError on localStorage
      for (let i = 0; i < 30; i++) {
        engine._logAutomation('QUOTA_BURST', 'INFO', `Burst log ${i}`);
      }

      // Storage should have transitioned to memory fallback
      assert.equal(engine.storage.isLocalStorageAvailable, false);

      // 3. Queue operations must continue reliably
      const queue = engine.getScheduledQueue();
      assert.equal(queue.length, 1);
      assert.equal(queue[0].leadId, 'lead_quota_e2e');

      // 4. Watchdog execution must continue reliably
      const reports = engine.checkAndTriggerReviewRequests({
        currentTime: delivRes.reviewDueAt + 1000
      });
      assert.equal(reports.length, 1);
      assert.equal(reports[0].action, 'REVIEW_SENT');

      const updatedQueue = engine.getScheduledQueue();
      assert.equal(updatedQueue[0].status, 'REVIEW_SENT');

      // 5. Audit logs must still be retrievable
      const logs = engine.getAutomationLogs();
      assert.ok(logs.length >= 30);
    } finally {
      delete global.window;
    }
  });

  await harness.test('SecurityError in private browsing sandbox initializes Level 3 in-memory store smoothly', async () => {
    // Simulate window.localStorage getter throwing SecurityError (e.g. cross-origin iframe / Safari Private Mode)
    global.window = {};
    Object.defineProperty(global.window, 'localStorage', {
      get() {
        const err = new DOMException('The operation is insecure.', 'SecurityError');
        err.code = 18;
        throw err;
      }
    });

    try {
      const adapter = new UniversalStorageAdapter();
      assert.equal(adapter.isLocalStorageAvailable, false, 'Must detect as unavailable');

      // Set, get, remove, clear must operate purely in memory without throwing
      adapter.setItem('private_key', 'private_val');
      assert.equal(adapter.getItem('private_key'), 'private_val');
      assert.equal(adapter.length, 1);

      adapter.removeItem('private_key');
      assert.equal(adapter.getItem('private_key'), null);
      assert.equal(adapter.length, 0);

      // BoubaneAutomations initialization in private mode
      const engine = new BoubaneAutomations();
      engine._logAutomation('PRIVACY_TEST', 'INFO', 'Tested private mode');
      assert.equal(engine.getAutomationLogs().length, 1);
    } finally {
      delete global.window;
    }
  });

  await harness.test('Storage length and key() bounds handling', async () => {
    const adapter = new UniversalStorageAdapter();
    assert.equal(adapter.length, 0);
    assert.equal(adapter.key(0), null);
    assert.equal(adapter.key(-1), null);
    assert.equal(adapter.key(999), null);

    adapter.setItem('alpha', '1');
    adapter.setItem('beta', '2');
    assert.equal(adapter.length, 2);
    assert.equal(adapter.key(0), 'alpha');
    assert.equal(adapter.key(1), 'beta');
    assert.equal(adapter.key(2), null);
  });

  // =========================================================================
  // SUITE 6: Adversarial Vulnerability Probing (Failure Modes & Edge Cases)
  // =========================================================================
  harness.suite('6. Adversarial Vulnerability Probing');

  await harness.test('[VULNERABILITY 1] Malformed JSON in log storage causes permanent logging lockout (fails to self-heal)', async () => {
    const customStore = new MockStorage();
    const engine = new BoubaneAutomations(customStore);

    // Corrupt log storage with malformed JSON
    customStore.setItem('boubane_automations_log', 'MALFORMED_JSON_STRING{{{');

    // getAutomationLogs catches SyntaxError and returns []
    assert.deepEqual(engine.getAutomationLogs(), []);

    // Attempting to log a new entry: _logAutomation throws SyntaxError on JSON.parse(raw)
    // inside its single outer try/catch, returning null and leaving the corrupted key untouched!
    const logRes = engine._logAutomation('TEST_MOD', 'INFO', 'New entry');
    
    // Expectation for a robust self-healing system: logRes should be an entry, and logs should contain 1 item
    // In current code: logRes is null and logs.length is 0!
    assert.notEqual(logRes, null, 'Vulnerability: _logAutomation returns null and fails to self-heal corrupted logs');
    assert.equal(engine.getAutomationLogs().length, 1, 'Vulnerability: Log entry was not persisted after storage corruption');
  });

  await harness.test('[VULNERABILITY 2] Non-array JSON in boubane_automations_queue crashes checkAndTriggerReviewRequests with TypeError', async () => {
    const customStore = new MockStorage();
    // Valid JSON number instead of an array
    customStore.setItem('boubane_automations_queue', '123');

    const engine = new BoubaneAutomations(customStore);

    // _getQueue() returns 123 because it does not check Array.isArray(parsed)
    // checkAndTriggerReviewRequests calls queue.forEach and throws TypeError: queue.forEach is not a function
    let threwTypeError = false;
    try {
      engine.checkAndTriggerReviewRequests();
    } catch (e) {
      if (e instanceof TypeError && e.message.includes('forEach is not a function')) {
        threwTypeError = true;
      }
    }

    assert.equal(threwTypeError, false, 'Vulnerability: Non-array JSON in queue crashes watchdog with TypeError');
  });

  await harness.test('[VULNERABILITY 3] Null task element in queue crashes watchdog with TypeError', async () => {
    const customStore = new MockStorage();
    // Queue array containing a null element
    customStore.setItem('boubane_automations_queue', JSON.stringify([null, { id: 't1', type: 'GOOGLE_REVIEW_48H', status: 'PENDING' }]));

    const engine = new BoubaneAutomations(customStore);

    let threwNullTypeError = false;
    try {
      engine.checkAndTriggerReviewRequests();
    } catch (e) {
      if (e instanceof TypeError && e.message.includes("reading 'type'")) {
        threwNullTypeError = true;
      }
    }

    assert.equal(threwNullTypeError, false, 'Vulnerability: Null element in queue array crashes watchdog with TypeError');
  });

  await harness.test('[VULNERABILITY 4] Passing options=null to triggerDelivery throws TypeError: Cannot read properties of null', async () => {
    const engine = new BoubaneAutomations();
    const lead = { id: 'lead_null_opts', name: 'Null Opts Lead' };

    let threwNullOpts = false;
    try {
      engine.triggerDelivery(lead, null, null);
    } catch (e) {
      if (e instanceof TypeError && e.message.includes("reading 'currentTime'")) {
        threwNullOpts = true;
      }
    }

    assert.equal(threwNullOpts, false, 'Vulnerability: Explicit null options throws TypeError instead of defaulting');
  });

  await harness.test('[VULNERABILITY 5] Re-triggering delivery during PAUSED_REVISIONS enqueues duplicate pending task', async () => {
    const engine = new BoubaneAutomations();
    const lead = { id: 'lead_pause_dup', name: 'Artisan Pause' };
    const t0 = 1762800000000;

    engine.triggerDelivery(lead, null, { currentTime: t0 });
    engine.checkAndTriggerReviewRequests({ currentTime: t0 + 1000, revisionReportedMap: { 'lead_pause_dup': true } });

    assert.equal(engine.getScheduledQueue()[0].status, 'PAUSED_REVISIONS');

    // Operator triggers delivery again after revising site
    engine.triggerDelivery(lead, null, { currentTime: t0 + 5000 });

    const tasks = engine.getScheduledQueue({ leadId: 'lead_pause_dup' });
    // Robust behavior: Should either resume/update the paused task or avoid duplicate tasks for the same lead
    // Vulnerability: Creates 2 coexisting tasks (1 PAUSED_REVISIONS, 1 PENDING)
    assert.equal(tasks.length, 1, 'Vulnerability: Re-triggering delivery while paused creates duplicate coexisting task');
  });

  const success = harness.summary();
  process.exit(success ? 0 : 1);
}

runAdversarialTests().catch(err => {
  console.error('\nFatal adversarial runner crash:', err);
  process.exit(1);
});
