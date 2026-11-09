# BOUBANE — Master Project Reference & Autonomous LLM Handover Guide

> **Document Version**: 2.0.0 (Production Verified)  
> **Target Audience**: Autonomous AI Agents, LLMs (Gemini, Claude, GPT, Cursor, Copilot), and Human Engineers  
> **Last Updated**: November 2026  
> **Status**: 100% Operational, 155/155 Tests Passing, Production Live

---

## 1. Executive Summary & Brand Identity

### The Business Model
**Boubane** is a specialized web agency and AI automation studio for construction craftspeople and SMEs (*artisans du bâtiment & PME*).
- **Flagship Hook (Acquisition)**: 100% bespoke, ultra-fast (<0.4s) vitrine website created with **0 € build fee** for the client, guaranteed for life. The client has total sovereign ownership of their domain and code, paying only real hosting expenses (~15 €/year via Stripe).
- **Monetization Engine**: High-margin recurring AI automations (Autonomous Gmail/IMAP Copilot, CRM lead enrichment, automated quoting, local prospection, voice/chat agents).

### Absolute Brand & Signature Rules (DO NOT BREAK)
- **Brand Name**: Strictly **Boubane** (never *"Boubane Studio"*, never *"Agence Boubane"* in code identifiers).
- **Founder Signature**: **Léo Saillour** (`leo@boubane.com` | `07 78 31 03 46` | `@saillle` on Telegram).
- **Design Aesthetic**: **Stripe Design System standard** (Navy `#0A2540`, Canvas `#F6F9FC`, Card `#FFFFFF`, Borders `#E3E8EE`, Primary `#ED5B04`). No juvenile emojis in functional UI controls — strictly crisp Lucide-style SVG icons.

---

## 2. Global Architecture & Infrastructure Topology

The Boubane technical stack operates across two synchronized environments:
1. **Frontend & Cockpit Delivery (Vercel CDN)**
2. **Backend Services & Databases (Ubuntu Host / Docker VPS)**

```
                                  [ USER BROWSER ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      [ Vercel Edge Global CDN ]                  [ Caddy SSL Reverse Proxy ]
      https://www.boubane.com                     https://*.boubane.com (Port 443)
      - index.html (Showcase vitrine)                          │
      - dashboard.html (Cockpit exécutif)                      │
      - blog.html, commander.html, hebergement.html            │
                                                               │
                 ┌─────────────────────────────────────────────┼──────────────────────────────┐
                 ▼                                             ▼                              ▼
      [ Twenty CRM ]                              [ Cal.com Scheduler ]               [ n8n Workflows ]
      https://crm.boubane.com                     https://rdv.boubane.com             https://workflow.boubane.com
      Port 3004 (twenty-server-1)                 Port 3002 (calcom-app)              Port 5678 (n8n container)
      Postgres: workspace_4afa...                 Postgres: calcom-db                 Webhook /calcom-booking
                 │                                             │                              │
                 ├─────────────────────────────────────────────┴──────────────────────────────┤
                 ▼
      [ Python Host Daemons (Systemd/Background) ]
      - lead_webhook.py (Port 3005) -> Ingestion temps réel + SIRENE API + Twenty direct SQL
      - outreach_engine.py -> Prospection locale SMS/WhatsApp/Telegram
      - inbox_copilot.py -> Gestion IA 24/7 boîte leo@boubane.com (IMAP/SMTP)
```

### VPS Host Identity (`home-leo`)
- **Host / IP**: Ubuntu (`192.168.1.164`), user `leo`.
- **SSH Connectivity**: `ssh -o BatchMode=yes leo@192.168.1.164`.
- **Reverse Proxy**: Caddy (`/home/leo/Caddyfile`) with automatic SSL termination.
- **Active Docker Containers**:
  - `caddy` : Ports 80, 443
  - `twenty-server-1` & `twenty-worker-1` : Port 3004 -> `https://crm.boubane.com`
  - `twenty-db-1` : PostgreSQL 16 (Port 5432 internal, database `default`, schema `workspace_4afa97ewunu3hydfohpozj1e3`)
  - `twenty-redis-1` : Redis 7 cache
  - `calcom-app` & `calcom-postgres` : Port 3002 -> `https://rdv.boubane.com`
  - `n8n` : Port 5678 -> `https://workflow.boubane.com`
  - `umami` & `umami-db` : Port 3001 -> `https://analytics.boubane.com`

---

## 3. The 5 Core Automation Engines (R1 to R5)

### Requirement 1 (R1): Telegram Pre-Call Briefing Engine
- **Trigger**: Webhook Cal.com (`POST https://workflow.boubane.com/webhook/calcom-booking` or internal simulateur).
- **Core Logic**:
  - `BoubaneAutomations.parseCalcomBooking(payload)`: Tolerant extraction of name, craft, city, phone (normalizing French `0033`/`+33`), email and notes up to 5,000 characters without ReDoS.
  - `BoubaneAutomations.generateProspectDiagnosis(booking)`: Online presence audit, Google Maps claim check, 2 local competitors with rating, and tailored 10-minute call pitch.
  - `BoubaneAutomations.formatTelegramMessage(diagnostic)`: Sanitized Markdown preventing broken syntax, capped strictly under 4,096 characters.
  - `BoubaneAutomations.sendTelegramBriefing(diagnostic)`: Dispatches to Telegram Bot `@Boubane_prospect_bot` (Chat ID `8036535453`) with 5 inline buttons (*Appeler*, *WhatsApp*, *Twenty CRM*, *Google Maps*, *Lancer Onboarding*).

### Requirement 2 (R2): Photo Onboarding & J+2 Watchdog
- **Trigger**: 1-click button on Kanban lead card or Telegram inline callback.
- **Core Logic**:
  - `BoubaneAutomations.triggerPhotoOnboarding(lead, channel)`: Formats tailored framing message requesting 4 to 5 photos (angles, before/after, natural lighting, company vehicle/logo).
  - Multi-channel dispatch: WhatsApp (`https://wa.me/33...`), SMS (`sms:...`), or Telegram.
  - `BoubaneAutomations.checkAndTriggerPhotoReminders(options)`: Watchdog checks scheduled queue (`boubane_automations_queue`). If `leadPhotoStatusMap` reports photos received, reminder is neutralized. If overdue (+48h), sends automated friendly reminder. Idempotent guard prevents duplicate tasks.

### Requirement 3 (R3): Client-Side Canvas 2D WebP Media Optimizer
- **Location**: [`scripts/media_optimizer.js`](scripts/media_optimizer.js) and Cockpit tab `#tab-media`.
- **Target Constraint**: Strictly **< 80 Ko** per image, responsive resize (max 1400px), 100% in-browser processing.
- **Capabilities**:
  - Supports JPEG, PNG, WebP, and iPhone HEIC/HEIF (lazy-loaded `heic2any` library).
  - Adaptive canvas compression loop dynamically tuning WebP quality from 0.85 down to 0.40 until the file size is strictly under 80 Ko.
  - Automated SEO renaming: `metier-ville-chantier-XX.webp` (slugified).
  - Batch packaging: exports all processed WebP files into a single `.zip` using JSZip.

### Requirement 4 (R4): Delivery Follow-up & 48h Google Review Watchdog
- **Trigger**: Moving a Kanban card to column 4 (*CLÔTURÉ & LIVRÉ* / Twenty CRM stage `CUSTOMER`).
- **Core Logic**:
  - `BoubaneAutomations.triggerDelivery(lead, deliveryUrl)`: Sends official delivery notice emphasizing ultra-fast loading speed (<0.4s) and 0 € build fee.
  - Arms a 48h watchdog task (`GOOGLE_REVIEW_48H`) for 5-star Google review collection (`https://g.page/r/boubane/review`).
  - Supports pause/resume workflow if client requests revisions (`PAUSED_REVISIONS` status).

### Requirement 5 (R5): Unified Executive Cockpit
- **Files**: [`dashboard.html`](dashboard.html) and its production mirror [`site/dashboard.html`](site/dashboard.html).
- **Stripe Design System**:
  - Navigation: Segmented pill tabs with SVG icons.
  - Traffic Spline: Full-width responsive HTML5 Canvas 2D spline with smooth vertical gradient area.
  - Lower Analytics: CSS horizontal gauges for acquisition channels, user interactions, and device breakdown.
  - TCO Commercial Simulator: Interactive slider with custom orange thumb thumbing against traditional agencies (saving clients 8,000+ € over 3 years).
  - Command Palette: Accessible via `⌘K` or top search bar.

---

## 4. Codebase Directory Structure & File Map

```
Boubane/
├── dashboard.html               # Master Executive Cockpit (Single-page app, Stripe design)
├── site/
│   ├── dashboard.html           # Production mirror of dashboard.html (MUST BE KEPT IN SYNC)
│   ├── index.html               # Main public showcase site
│   ├── blog.html                # Public SEO blog
│   ├── commander.html           # Free site ordering funnel
│   └── hebergement.html         # 15 €/yr Stripe hosting page
├── scripts/
│   ├── media_optimizer.js       # R3: Canvas 2D WebP image compression engine (<80 Ko, HEIC, JSZip)
│   ├── boubane_automations.js   # R1, R2, R4, R5: Core automation workflows & queue engine
│   └── scraper_artisans.py      # Lead enrichment and local artisan scraper
├── tests/
│   ├── e2e_runner.js            # Official E2E test suite (45 tests, Tiers 1-4)
│   ├── adversarial_automations_r1_r2.js       # 32 stress checks on R1/R2 (ReDoS, Markdown, phone)
│   ├── adversarial_r4_queue_test.js           # 23 stress checks on R4 and queue self-healing
│   ├── adversarial_automations_audit.js       # 10 independent forensic checks
│   ├── adversarial_boubane_automations.test.js# 19 storage resilience and interface tests
│   ├── test_boubane_automations.js            # 26 unit tests for automations engine
│   └── fixtures/                # Validated mock JSON payloads (Cal.com, Twenty, Telegram)
├── inbox_copilot.py             # 24/7 IMAP/Gmail AI assistant daemon (gpt-oss-120b)
├── outreach_engine.py           # Local artisan SMS/WhatsApp outreach machine
├── PROJECT.md                   # This master handover file
├── vercel.json                  # Vercel deployment routes and security headers
└── package.json                 # Project configuration
```

---

## 5. Verification & Test Suite Runbook

Any LLM modifying code **MUST** run and pass the full test suite before committing:

```bash
# 1. Run the official E2E test suite (45 tests, Tiers 1 to 4)
node tests/e2e_runner.js

# 2. Run the adversarial stress suites (R1, R2, R4, Storage corruption, Queue self-healing)
node tests/adversarial_automations_r1_r2.js
node tests/adversarial_r4_queue_test.js
node tests/adversarial_automations_audit.js
node tests/adversarial_boubane_automations.test.js
node tests/test_boubane_automations.js

# One-liner to verify all 155 checks:
node tests/e2e_runner.js && node tests/adversarial_automations_r1_r2.js && node tests/adversarial_r4_queue_test.js && node tests/adversarial_automations_audit.js && node tests/adversarial_boubane_automations.test.js && node tests/test_boubane_automations.js
```

### Expected Output
- **Passed**: 155 / 155 tests (100% success rate).
- **Execution Time**: < 1 second total.

---

## 6. Critical Invariants & Rules for Incoming LLMs

1. **Dual Dashboard Synchronization**:
   Whenever you edit `dashboard.html`, you **MUST** mirror the change to `site/dashboard.html` (`cp dashboard.html site/dashboard.html`).
2. **CSS Token Contract**:
   `tests/e2e_runner.js` asserts the existence of `:root` CSS variables via regex (`/--primary:\s*#ED5B04/` and `/--bg-body:\s*#FAFAFA/`). Always preserve `--bg-body: #FAFAFA;` in `:root` alongside `--bg-stripe: #F6F9FC;`.
3. **No External Frontend Build Tools**:
   `dashboard.html` is a monolithic client-side HTML5/ES6 application. Do **NOT** introduce a Vite/Webpack/Tailwind CLI build step that would break direct browser opening or Vercel static routing.
4. **FIFO Audit Log Capacity**:
   Audit logs stored in `boubane_automations_log` must be strictly capped at **300 entries** maximum using FIFO rotation.
5. **Universal Storage Adapter**:
   `scripts/boubane_automations.js` uses a 3-tier storage fallback (Custom MockStorage -> window.localStorage -> in-memory Map) to ensure 100% crash-free execution in headless tests, Safari private browsing, or sandboxed environments.
6. **Git Branch & Push**:
   All work must be committed to branch `main` and pushed cleanly to `git@github.com:PicsouTheOwl/Boubane.git`. Working tree must remain clean.

---

*Authored for the Boubane Engineering Core. Handover ready for all autonomous AI agents.*
