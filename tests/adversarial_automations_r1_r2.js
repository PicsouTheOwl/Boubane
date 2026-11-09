#!/usr/bin/env node

/**
 * ============================================================================
 * Boubane Automations Engine — Adversarial Stress Test Suite (R1 & R2)
 * ============================================================================
 * 
 * Adversarial challenger harness for Requirement 1 and Requirement 2:
 * 1. Malformed & hostile Cal.com booking payloads (non-string notes, type confusion,
 *    deeply corrupted responses, SQLi/XSS, ReDoS stress).
 * 2. Telegram briefing robustness (Markdown character escaping, 4096-char ceiling,
 *    HTTP 429 rate limit backoff, network failure modes).
 * 3. Photo onboarding & J+2 watchdog (rapid status toggling, duplicate triggers,
 *    clock skew, temporal anomalies, multi-channel URL formatting).
 *
 * Usage:
 *   node tests/adversarial_automations_r1_r2.js
 *   node tests/adversarial_automations_r1_r2.js --verbose
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

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

class AdversarialHarness {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.findings = [];
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

  async test(name, category, fn) {
    this.total++;
    try {
      await fn();
      this.passed++;
      this.currentSuite.tests.push({ name, category, pass: true });
      if (isVerbose) {
        console.log(`  \x1b[32m✔ [PASS]\x1b[0m [${category}] ${name}`);
      } else {
        process.stdout.write('\x1b[32m.\x1b[0m');
      }
    } catch (err) {
      this.failed++;
      const finding = {
        name,
        category,
        error: err.message,
        stack: err.stack,
        suite: this.currentSuite.name
      };
      this.findings.push(finding);
      this.currentSuite.tests.push({ name, category, pass: false, error: err });
      console.log(`\n  \x1b[31m✖ [FAIL]\x1b[0m [${category}] ${name}`);
      console.log(`    \x1b[31mError:\x1b[0m ${err.message}`);
      if (isVerbose && err.stack) {
        console.log(`    ${err.stack.split('\n').slice(1, 4).join('\n    ')}`);
      }
    }
  }

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log('\n\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`\x1b[1;35m  Adversarial Stress Test Suite Summary (R1 & R2)\x1b[0m`);
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
    console.log(`  Total Checks : ${this.total}`);
    console.log(`  Passed       : \x1b[32m${this.passed}\x1b[0m`);
    console.log(`  Failed       : ${this.failed > 0 ? `\x1b[31m${this.failed}\x1b[0m` : '0'}`);
    console.log(`  Duration     : ${duration}s`);
    console.log('───────────────────────────────────────────────────────────────────────────');
    if (this.failed === 0) {
      console.log('  \x1b[1;32mVERDICT: APPROVE (ALL ADVERSARIAL CHALLENGES WITHSTOOD)\x1b[0m');
    } else {
      console.log(`  \x1b[1;31mVERDICT: REQUEST_CHANGES (${this.failed} CRITICAL FAILURES DETECTED)\x1b[0m`);
      console.log('\n  \x1b[1mDetailed Findings:\x1b[0m');
      this.findings.forEach((f, idx) => {
        console.log(`  ${idx + 1}. [${f.category}] ${f.name}`);
        console.log(`     -> Error: ${f.error}`);
      });
    }
    console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m\n');
    return {
      total: this.total,
      passed: this.passed,
      failed: this.failed,
      findings: this.findings,
      duration
    };
  }
}

/**
 * Validate Telegram Markdown syntax:
 * Ensures entities like *, _, `, [ are correctly paired and not leaving unclosed spans
 */
function validateTelegramMarkdownSyntax(text) {
  // Check code spans `` ` `` (ignoring escaped backticks)
  const backticks = (text.match(/(?<!\\)`/g) || []).length;
  if (backticks % 2 !== 0) {
    return { valid: false, reason: `Unbalanced backticks: count=${backticks}` };
  }

  // Remove code spans before checking *, _ and [
  const strippedCode = text.replace(/`[^`]*`/g, '');

  // Check asterisks * (bold) (ignoring escaped asterisks)
  const asterisks = (strippedCode.match(/(?<!\\)\*/g) || []).length;
  if (asterisks % 2 !== 0) {
    return { valid: false, reason: `Unbalanced bold asterisks: count=${asterisks}` };
  }

  // Check underscores _ (italic) (ignoring escaped underscores)
  const underscores = (strippedCode.match(/(?<!\\)_/g) || []).length;
  if (underscores % 2 !== 0) {
    return { valid: false, reason: `Unbalanced italic underscores: count=${underscores}` };
  }

  // Check unescaped brackets [ without closing ]
  let bracketDepth = 0;
  for (let i = 0; i < strippedCode.length; i++) {
    if (strippedCode[i] === '[' && (i === 0 || strippedCode[i - 1] !== '\\')) bracketDepth++;
    if (strippedCode[i] === ']' && (i === 0 || strippedCode[i - 1] !== '\\')) bracketDepth--;
    if (bracketDepth < 0) {
      return { valid: false, reason: 'Unmatched closing bracket ]' };
    }
  }
  if (bracketDepth !== 0) {
    return { valid: false, reason: `Unclosed open bracket [: unclosed count=${bracketDepth}` };
  }

  return { valid: true };
}

async function runAdversarialSuite() {
  const h = new AdversarialHarness();

  console.log('\n\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1;35m  Starting Adversarial Stress Testing on scripts/boubane_automations.js\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════════════════════════════════\x1b[0m');

  if (!isVerbose) {
    process.stdout.write('  Running adversarial checks: ');
  }

  // =========================================================================
  // SUITE 1: Malformed & Hostile Cal.com Booking Payloads (R1)
  // =========================================================================
  h.suite('SUITE 1: Malformed & Hostile Cal.com Booking Payloads (R1)');

  // 1.1 Non-string notes type confusion
  await h.test('Payload with integer notes (payload.description = 12345)', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const payload = {
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        id: 7001,
        description: 12345, // Number instead of string
        attendees: [{ name: 'Marc Leblanc' }]
      }
    };
    const parsed = engine.parseCalcomBooking(payload);
    assert.equal(parsed.name, 'Marc Leblanc');
    assert.ok(parsed.notes !== undefined);
  });

  await h.test('Payload with object notes in responses.notes.value', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const payload = {
      payload: {
        id: 7002,
        responses: {
          notes: { value: { custom: 'notes-as-object' } }
        },
        attendees: [{ name: 'Marc Leblanc' }]
      }
    };
    const parsed = engine.parseCalcomBooking(payload);
    assert.equal(parsed.name, 'Marc Leblanc');
  });

  await h.test('Payload with boolean notes (payload.additionalNotes = true)', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const payload = {
      payload: {
        id: 7003,
        additionalNotes: true,
        attendees: [{ name: 'Jean Dupont' }]
      }
    };
    const parsed = engine.parseCalcomBooking(payload);
    assert.equal(parsed.name, 'Jean Dupont');
  });

  await h.test('Payload with array notes (payload.description = ["a", "b"])', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const payload = {
      payload: {
        id: 7004,
        description: ['renovation', 'toiture'],
        attendees: [{ name: 'Paul Ardoise' }]
      }
    };
    const parsed = engine.parseCalcomBooking(payload);
    assert.equal(parsed.name, 'Paul Ardoise');
  });

  // 1.2 Corrupted structures
  await h.test('Array payload [] instead of object', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    // In JS typeof [] === 'object', but array is not a valid booking
    // It should either throw cleanly or return fallback object without crashing
    const parsed = engine.parseCalcomBooking([]);
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  await h.test('Nested payload is primitive: { payload: "invalid-string" }', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({ payload: 'invalid-string' });
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  await h.test('Corrupted attendees: attendees is a string "John"', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7005,
        attendees: 'John Doe'
      }
    });
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  await h.test('Corrupted attendees: attendees has null elements [{ name: null }]', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7006,
        attendees: [{ name: null, email: null }]
      }
    });
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  await h.test('Corrupted attendees: attendees = [null]', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7007,
        attendees: [null]
      }
    });
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  await h.test('Corrupted responses: responses is primitive string', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7008,
        responses: 'not-an-object'
      }
    });
    assert.equal(parsed.name, 'Prospect Inconnu');
  });

  // 1.3 SQL Injection & XSS Payloads in Attendee Fields
  await h.test('SQL injection in attendee name, company, notes', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const sqliPayload = {
      payload: {
        id: "7009'; DROP TABLE opportunity;--",
        attendees: [{
          name: "Robert'); DROP TABLE opportunity;--",
          email: "robert@injection.com"
        }],
        description: "Entreprise: BTP_RENVOI_SQLI\nMétier: Maçon\nVille: Segré"
      }
    };
    const parsed = engine.parseCalcomBooking(sqliPayload);
    assert.equal(parsed.name, "Robert'); DROP TABLE opportunity;--");
    assert.equal(parsed.company, "BTP_RENVOI_SQLI");
    const diag = engine.generateProspectDiagnosis(parsed);
    assert.ok(diag.contact.name.includes("Robert'); DROP TABLE"));
  });

  await h.test('XSS script tags in company name and notes', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const xssPayload = {
      payload: {
        id: 7010,
        attendees: [{ name: '<script>alert("XSS")</script>' }],
        description: 'Entreprise: XSS_COMP\nMétier: Plomberie'
      }
    };
    const parsed = engine.parseCalcomBooking(xssPayload);
    assert.equal(parsed.name, '<script>alert("XSS")</script>');
    assert.equal(parsed.company, 'XSS_COMP');
  });

  // 1.4 Extreme Notes & ReDoS Stress Testing
  await h.test('ReDoS vulnerability detection on overlapping whitespace regex (entreprise \\s*[:=]?\\s*)', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    // Empirical quadratic scaling test on ReDoS pattern:
    // When a note has 'entreprise' followed by whitespace and a newline without match,
    // the two overlapping \\s* cause catastrophic backtracking.
    const runReDoSProbe = (spaceCount) => {
      const probe = 'entreprise ' + ' '.repeat(spaceCount) + ':\n';
      const t0 = process.hrtime.bigint();
      engine.parseCalcomBooking({
        payload: {
          id: 7011,
          description: probe,
          attendees: [{ name: 'Marc' }]
        }
      });
      const t1 = process.hrtime.bigint();
      return Number(t1 - t0) / 1e6; // ms
    };

    const tSmall = runReDoSProbe(200);
    const tMedium = runReDoSProbe(2000);
    const tLarge = runReDoSProbe(10000);

    // If time scales superlinearly or exceeds 100ms for just 10k spaces, it's vulnerable to ReDoS
    if (tLarge > 100 || (tMedium > 5 && tLarge > tMedium * 5)) {
      throw new Error(`Catastrophic ReDoS backtracking confirmed: 200 spaces=${tSmall.toFixed(2)}ms, 2000 spaces=${tMedium.toFixed(2)}ms, 10000 spaces=${tLarge.toFixed(2)}ms`);
    }
  });

  await h.test('Massive 100,000 characters description note without regex backtracking', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const massiveText = 'Notes de chantier : ' + 'X'.repeat(100000);
    const t0 = Date.now();
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7012,
        description: massiveText,
        attendees: [{ name: 'Marc Leblanc' }]
      }
    });
    const elapsed = Date.now() - t0;
    assert.ok(elapsed < 1000, `Massive string processing took too long: ${elapsed}ms`);
    assert.equal(parsed.name, 'Marc Leblanc');
  });

  // 1.5 International Phone Number Extraction
  await h.test('International phone with parenthesized zero (+33 (0)6 12 34 56 78)', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7013,
        description: 'Contact au +33 (0)6 12 34 56 78 pour le chantier',
        attendees: [{ name: 'Marc' }]
      }
    });
    // Should extract or preserve a usable phone string
    assert.ok(parsed.phone !== '', 'Phone should be extracted');
  });

  await h.test('French phone dot-separated (06.12.34.56.78) regex extraction', 'R1_PARSER', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const parsed = engine.parseCalcomBooking({
      payload: {
        id: 7014,
        description: 'Tél: 06.12.34.56.78',
        attendees: [{ name: 'Marc' }]
      }
    });
    assert.equal(parsed.phone, '06.12.34.56.78');
  });

  // =========================================================================
  // SUITE 2: Telegram Pre-Call Briefing Robustness (R1)
  // =========================================================================
  h.suite('SUITE 2: Telegram Pre-Call Briefing Robustness (R1)');

  // 2.1 Telegram Markdown Syntax Escaping
  await h.test('Markdown escaping: Unclosed underscore in company name (Leblanc_Ardoise)', 'R1_TELEGRAM', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Marc Leblanc',
      company: 'Leblanc_Ardoise', // Single unclosed underscore
      craft: 'Couvreur',
      city: 'Segré',
      phone: '0612345678'
    });
    const text = engine.formatTelegramMessage(diag);
    const syntax = validateTelegramMarkdownSyntax(text);
    assert.ok(syntax.valid, `Telegram Markdown syntax broken by single underscore: ${syntax.reason}\nMessage text:\n${text}`);
  });

  await h.test('Markdown escaping: Single asterisk in prospect name (Marc * Couvreur)', 'R1_TELEGRAM', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Marc * Couvreur',
      company: 'Leblanc SAS',
      craft: 'Couvreur',
      city: 'Segré',
      phone: '0612345678'
    });
    const text = engine.formatTelegramMessage(diag);
    const syntax = validateTelegramMarkdownSyntax(text);
    assert.ok(syntax.valid, `Telegram Markdown syntax broken by single asterisk: ${syntax.reason}`);
  });

  await h.test('Markdown escaping: Reserved square brackets in company without URL (Atelier [49] Bois)', 'R1_TELEGRAM', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Marc Leblanc',
      company: 'Atelier [49] Bois',
      craft: 'Menuisier',
      city: 'Segré',
      phone: '0612345678'
    });
    const text = engine.formatTelegramMessage(diag);
    // In Telegram Markdown, literal square brackets must be escaped as \[
    const hasUnescapedBracket = /(?<!\\)\[/.test(text);
    assert.ok(!hasUnescapedBracket, 'Telegram Markdown contains unescaped bracket [ which triggers Bad Request');
  });

  await h.test('Markdown escaping: Single backtick in prospect email (marc`email@domain.com)', 'R1_TELEGRAM', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const diag = engine.generateProspectDiagnosis({
      name: 'Marc Leblanc',
      company: 'Leblanc SAS',
      craft: 'Couvreur',
      city: 'Segré',
      phone: '0612345678',
      email: 'marc`email@domain.com'
    });
    const text = engine.formatTelegramMessage(diag);
    const syntax = validateTelegramMarkdownSyntax(text);
    assert.ok(syntax.valid, `Telegram Markdown syntax broken by backticks: ${syntax.reason}`);
  });

  // 2.2 Telegram 4096-Character Limit Enforcement
  await h.test('Telegram 4096-character ceiling enforcement on extreme inputs', 'R1_TELEGRAM', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const hugeDiagnosis = engine.generateProspectDiagnosis({
      name: 'Artisan avec un nom excessivement long ' + 'X'.repeat(2000),
      company: 'Entreprise avec une raison sociale démesurée ' + 'Y'.repeat(2000),
      craft: 'Multi-spécialiste de la rénovation intégrale',
      city: 'Segré-en-Anjou Bleu',
      phone: '0612345678'
    });
    const text = engine.formatTelegramMessage(hugeDiagnosis);
    assert.ok(text.length <= 4096, `Telegram message exceeds 4096 character ceiling: length=${text.length}`);
  });

  // 2.3 HTTP 429 Rate Limiting with Retry-After Handling
  await h.test('HTTP 429 Rate Limit returned with Retry-After header', 'R1_TELEGRAM', async () => {
    const network = new MockNetwork();
    network.setFailMode('rate_limit');
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, network);

    const diag = engine.generateProspectDiagnosis({
      name: 'Marc Leblanc',
      company: 'Leblanc SAS',
      craft: 'Couvreur',
      city: 'Segré',
      phone: '0612345678'
    });

    const res = await engine.sendTelegramBriefing(diag);
    assert.equal(res.success, false);
    assert.equal(res.status, 429);
    // Verify audit log captured the 429 failure
    const logs = engine.getAutomationLogs({ module: 'R1_TELEGRAM_DISPATCH' });
    assert.ok(logs.length >= 1);
    assert.equal(logs[0].status, 'FAILURE');
    assert.ok(logs[0].message.includes('HTTP 429'));
  });

  // 2.4 Simulated Network Drops & Timeouts
  await h.test('Network unreachable (TypeError: Failed to fetch) logs failure and handles gracefully', 'R1_TELEGRAM', async () => {
    const network = new MockNetwork();
    network.setFailMode('network_error');
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, network);

    const diag = engine.generateProspectDiagnosis({
      name: 'Marc Leblanc',
      company: 'Leblanc SAS',
      craft: 'Couvreur',
      city: 'Segré',
      phone: '0612345678'
    });

    await assert.rejects(
      async () => engine.sendTelegramBriefing(diag),
      /Failed to fetch/
    );

    const logs = engine.getAutomationLogs({ module: 'R1_TELEGRAM_DISPATCH' });
    assert.ok(logs.length >= 1);
    assert.equal(logs[0].status, 'FAILURE');
    assert.ok(logs[0].message.includes('network error'));
  });

  // 2.5 Button URL Validity with Accented Characters & Symbols
  await h.test('Interactive button URLs encode French accents and special characters', 'R1_TELEGRAM', async () => {
    const network = new MockNetwork();
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, network);

    const diag = engine.generateProspectDiagnosis({
      name: 'Sébastien d’Anjou',
      company: 'Maçonnerie & Ébénisterie de l’Oudon',
      craft: 'Maçon & Plâtrier',
      city: 'Segré-en-Anjou Bleu',
      phone: '06 12 34 56 78'
    });

    await engine.sendTelegramBriefing(diag);
    assert.equal(network.calls.length, 1);
    const sentPayload = JSON.parse(network.calls[0].options.body);
    const buttons = sentPayload.reply_markup.inline_keyboard.flat();

    // Verify WhatsApp URL
    const waBtn = buttons.find(b => b.text.includes('WhatsApp'));
    assert.ok(waBtn);
    assert.match(waBtn.url, /^https:\/\/wa\.me\/33612345678$/);

    // Verify Google Maps URL is URI-encoded
    const mapsBtn = buttons.find(b => b.text.includes('Google Maps'));
    assert.ok(mapsBtn);
    assert.ok(!mapsBtn.url.includes(' '), 'Maps URL should not contain raw unencoded spaces');
    assert.ok(!mapsBtn.url.includes('&'), 'Maps URL should encode ampersand in query');
  });

  // =========================================================================
  // SUITE 3: Photo Onboarding & J+2 Reminder Watchdog (R2)
  // =========================================================================
  h.suite('SUITE 3: Photo Onboarding Pipeline & J+2 Watchdog (R2)');

  // 3.1 Rapid Status Toggling
  await h.test('Rapid photo status toggling (requested -> received -> reset -> received)', 'R2_ONBOARDING', async () => {
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, new MockNetwork());
    const lead = { id: 'lead_toggle_101', name: 'Pierre Durand', phone: '0611223344' };
    const baseTime = Date.now();

    // 1. Initial 1-click trigger
    const initial = engine.triggerPhotoOnboarding(lead, 'whatsapp', { currentTime: baseTime });
    assert.equal(initial.success, true);
    let queue = engine.getScheduledQueue({ leadId: 'lead_toggle_101' });
    assert.equal(queue.length, 1);
    assert.equal(queue[0].status, 'PENDING');

    // 2. Photos received -> should cancel pending reminder
    const markRes = engine.markPhotosReceived('lead_toggle_101');
    assert.equal(markRes.success, true);
    assert.equal(markRes.neutralizedTasks, 1);

    queue = engine.getScheduledQueue({ leadId: 'lead_toggle_101' });
    assert.equal(queue[0].status, 'CANCELLED_RECEIVED');

    // 3. Watchdog runs at J+2 -> must NOT fire reminder
    const reports1 = engine.checkAndTriggerPhotoReminders({
      currentTime: baseTime + (49 * 3600 * 1000),
      leadPhotoStatusMap: { lead_toggle_101: 'received' }
    });
    assert.equal(reports1.length, 0, 'Cancelled reminder must not fire');

    // 4. Client resets or asks for new project photos
    const secondTrigger = engine.triggerPhotoOnboarding(lead, 'sms', { currentTime: baseTime + 1000 });
    queue = engine.getScheduledQueue({ leadId: 'lead_toggle_101', status: 'PENDING' });
    assert.equal(queue.length, 1);

    // 5. Watchdog runs with status 'received' -> auto-neutralization
    const reports2 = engine.checkAndTriggerPhotoReminders({
      currentTime: baseTime + (50 * 3600 * 1000),
      leadPhotoStatusMap: { lead_toggle_101: 'received' }
    });
    assert.equal(reports2.length, 1);
    assert.equal(reports2[0].action, 'NEUTRALIZED_RECEIVED');
  });

  // 3.2 Duplicate Onboarding Triggers (Idempotency)
  await h.test('Duplicate onboarding triggers for same lead do not cause duplicate active reminders', 'R2_ONBOARDING', async () => {
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, new MockNetwork());
    const lead = { id: 'lead_dup_202', name: 'Antoine Morel', phone: '0622334455' };
    const baseTime = Date.now();

    // Rapid double-click trigger within 50ms
    engine.triggerPhotoOnboarding(lead, 'whatsapp', { currentTime: baseTime });
    engine.triggerPhotoOnboarding(lead, 'whatsapp', { currentTime: baseTime + 50 });

    const activeTasks = engine.getScheduledQueue({
      leadId: 'lead_dup_202',
      status: 'PENDING'
    });

    // Idempotency check: should only have 1 pending reminder for this lead
    assert.equal(activeTasks.length, 1, `Expected 1 active pending task, got ${activeTasks.length}`);
  });

  // 3.3 Clock Skew & Temporal Anomalies
  await h.test('Watchdog handles clock skew (time jumping backward then forward)', 'R2_ONBOARDING', async () => {
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, new MockNetwork());
    const lead = { id: 'lead_skew_303', name: 'Thierry Renard', phone: '0633445566' };
    const baseTime = 1763000000000;

    engine.triggerPhotoOnboarding(lead, 'whatsapp', { currentTime: baseTime });

    // Clock jumps backward 10 days
    const pastReports = engine.checkAndTriggerPhotoReminders({
      currentTime: baseTime - (10 * 86400 * 1000),
      leadPhotoStatusMap: { lead_skew_303: 'none' }
    });
    assert.equal(pastReports.length, 0, 'No reminder should fire in the past');

    // Task should remain PENDING
    let queue = engine.getScheduledQueue({ leadId: 'lead_skew_303' });
    assert.equal(queue[0].status, 'PENDING');

    // Clock jumps forward past J+2 (+48h + 10s)
    const dueReports = engine.checkAndTriggerPhotoReminders({
      currentTime: baseTime + (48 * 3600 * 1000) + 10000,
      leadPhotoStatusMap: { lead_skew_303: 'none' }
    });
    assert.equal(dueReports.length, 1);
    assert.equal(dueReports[0].action, 'REMINDER_SENT');
  });

  await h.test('Past due date on creation triggers reminder on next watchdog run', 'R2_ONBOARDING', async () => {
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, new MockNetwork());
    const lead = { id: 'lead_past_404', name: 'Julien Blanc', phone: '0644556677' };
    const baseTime = Date.now();

    // Created with dueAt in the past
    engine.triggerPhotoOnboarding(lead, 'whatsapp', {
      currentTime: baseTime,
      dueAt: baseTime - 1000
    });

    const reports = engine.checkAndTriggerPhotoReminders({
      currentTime: baseTime,
      leadPhotoStatusMap: { lead_past_404: 'none' }
    });
    assert.equal(reports.length, 1);
    assert.equal(reports[0].action, 'REMINDER_SENT');
  });

  // 3.4 Multi-Channel Dispatch URLs with Complex Formatting
  await h.test('Multi-channel dispatch handles French international numbers (+33 6 12 34 56 78)', 'R2_ONBOARDING', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const msg = 'Bonjour!';
    
    // Test with +33
    const urlWa1 = engine.formatMultiChannelUrl('whatsapp', '+33 6 12 34 56 78', msg);
    assert.ok(urlWa1.startsWith('https://wa.me/33612345678?text=Bonjour!'));

    // Test with leading 0 (0612345678)
    const urlWa2 = engine.formatMultiChannelUrl('whatsapp', '06 12 34 56 78', msg);
    assert.ok(urlWa2.startsWith('https://wa.me/33612345678?text=Bonjour!'));

    // Test with double zero international notation (0033 6 12 34 56 78)
    const urlWa3 = engine.formatMultiChannelUrl('whatsapp', '0033 6 12 34 56 78', msg);
    assert.ok(urlWa3.startsWith('https://wa.me/33612345678?text=Bonjour!'), `WhatsApp URL must not contain leading 00: got ${urlWa3}`);

    // Test SMS protocol
    const urlSms = engine.formatMultiChannelUrl('sms', '+33 6 12 34 56 78', msg);
    assert.ok(urlSms.startsWith('sms:+33612345678?body=Bonjour!'));

    // Test Telegram protocol
    const urlTg = engine.formatMultiChannelUrl('telegram', '+33 6 12 34 56 78', msg);
    assert.ok(urlTg.startsWith('https://t.me/share/url?url=&text=Bonjour!'));
  });

  await h.test('Multi-channel dispatch handles international number (+44 7911 123456)', 'R2_ONBOARDING', async () => {
    const engine = new BoubaneAutomations(new MockStorage(), new MockNetwork());
    const urlWa = engine.formatMultiChannelUrl('whatsapp', '+44 7911 123456', 'Hello');
    assert.ok(urlWa.startsWith('https://wa.me/447911123456?text=Hello'));
  });

  // 3.5 Storage Corruption & Recovery
  await h.test('Queue recovery from corrupt JSON in storage', 'R2_STORAGE', async () => {
    const storage = new MockStorage({
      boubane_automations_queue: '{{Corrupted JSON string'
    });
    const engine = new BoubaneAutomations(storage, new MockNetwork());

    // Should not throw, should return empty queue gracefully
    const queue = engine.getScheduledQueue();
    assert.ok(Array.isArray(queue));
    assert.equal(queue.length, 0);

    // Enqueueing a new task should succeed and overwrite corrupt data cleanly
    const lead = { id: 'lead_rec_505', name: 'Alain Vert', phone: '0655667788' };
    const res = engine.triggerPhotoOnboarding(lead, 'whatsapp');
    assert.equal(res.success, true);
    assert.equal(engine.getScheduledQueue().length, 1);
  });

  await h.test('FIFO audit log rotates strictly at 300 entries under stress (500 logs)', 'R2_STORAGE', async () => {
    const storage = new MockStorage();
    const engine = new BoubaneAutomations(storage, new MockNetwork());

    for (let i = 0; i < 500; i++) {
      engine._logAutomation('STRESS_TEST', 'INFO', `Log entry #${i}`);
    }

    const logs = engine.getAutomationLogs();
    assert.equal(logs.length, 300, `Logs length should be strictly 300, got ${logs.length}`);
    // Oldest entry should be #200, newest should be #499
    assert.equal(logs[0].message, 'Log entry #200');
    assert.equal(logs[299].message, 'Log entry #499');
  });

  return h.summary();
}

runAdversarialSuite().then(results => {
  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch(err => {
  console.error('\x1b[31mFATAL TEST RUNNER ERROR:\x1b[0m', err);
  process.exit(2);
});
