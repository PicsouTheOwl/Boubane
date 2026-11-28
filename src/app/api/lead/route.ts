import { NextResponse } from "next/server";

interface LeadPayload {
  id?: string;
  type?: "commande" | "rdv" | "contact";
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  city?: string;
  craft?: string;
  situation?: string;
  modules?: string[];
  totalPrice?: number;
  preferredSlot?: string;
  message?: string;
  sourceAcquisition?: string;
  website?: string; // honeypot
}

function clean(val: unknown, max = 500): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, max);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 3500
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as LeadPayload & {
      lead?: LeadPayload;
    };
    const data: LeadPayload = raw.lead ? { ...raw, ...raw.lead } : raw;

    // Anti-bot honeypot: silently accept without relaying
    if (clean(data.website, 120)) {
      return NextResponse.json({ ok: true, relayed: false });
    }

    const name = clean(data.name, 140);
    const company = clean(data.company, 140);
    const email = clean(data.email, 160);
    const phone = clean(data.phone, 60);
    const city = clean(data.city, 120);
    const craft = clean(data.craft, 160);
    const situation = clean(data.situation, 200);
    const preferredSlot = clean(data.preferredSlot, 160);
    const message = clean(data.message, 4000);
    const leadType = data.type === "rdv" ? "rdv" : data.type === "contact" ? "contact" : "commande";
    const modules = Array.isArray(data.modules)
      ? data.modules.map((m) => clean(m, 100)).filter(Boolean).slice(0, 12)
      : [];
    const totalPrice =
      typeof data.totalPrice === "number" && Number.isFinite(data.totalPrice)
        ? Math.max(0, Math.round(data.totalPrice))
        : undefined;

    if (!name && !email && !phone) {
      return NextResponse.json(
        { ok: false, error: "Coordonnées manquantes." },
        { status: 400 }
      );
    }

    const leadRecord = {
      id: clean(data.id, 64) || `lead_${Date.now().toString(36)}`,
      type: leadType,
      timestamp: new Date().toISOString(),
      name: name || "Prospect",
      company: company || name || "Non précisé",
      email,
      phone,
      city,
      craft,
      situation,
      preferredSlot,
      modules,
      totalPrice,
      message,
      sourceAcquisition: clean(data.sourceAcquisition, 120) || "boubane.com",
    };

    // Structured Vercel runtime log (durable audit trail even if external webhooks are offline)
    console.info("[BOUBANE_LEAD]", JSON.stringify(leadRecord));

    const tasks: Array<Promise<boolean>> = [];

    // 1. Primary CRM Webhook (env override or Boubane Twenty CRM)
    const crmUrl =
      process.env.CRM_WEBHOOK_URL?.trim() ||
      "https://crm.boubane.com/api/webhook/lead";
    tasks.push(
      fetchWithTimeout(crmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "lead_captured",
          timestamp: leadRecord.timestamp,
          source: "Boubane (boubane.com)",
          lead: leadRecord,
        }),
      })
        .then((res) => res.ok)
        .catch(() => false)
    );

    // 2. Optional Telegram instant notification if configured in Vercel env
    const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const tgChatId = process.env.TELEGRAM_CHAT_ID?.trim();
    if (tgToken && tgChatId) {
      const lines = [
        leadType === "rdv"
          ? "📅 NOUVELLE DEMANDE DE RDV — BOUBANE"
          : "🔥 NOUVEAU PROJET ENTRANT — BOUBANE",
        `• Nom : ${leadRecord.name}${company ? ` (${company})` : ""}`,
        city ? `• Ville : ${city}` : "",
        phone ? `• Tél : ${phone}` : "",
        email ? `• Email : ${email}` : "",
        craft ? `• Secteur : ${craft}` : "",
        preferredSlot ? `• Créneau souhaité : ${preferredSlot}` : "",
        modules.length ? `• Modules : ${modules.join(", ")}` : "",
        totalPrice !== undefined ? `• Total : ${totalPrice} € HT` : "",
        message ? `\n${message}` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 3900);

      tasks.push(
        fetchWithTimeout(
          `https://api.telegram.org/bot${tgToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: lines,
              disable_web_page_preview: true,
            }),
          }
        )
          .then((res) => res.ok)
          .catch(() => false)
      );
    }

    // 3. Optional Resend transactional email if configured in Vercel env
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL?.trim() || "leo@boubane.com";
    if (resendKey) {
      tasks.push(
        fetchWithTimeout("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Boubane <notifications@boubane.com>",
            to: [notifyEmail],
            reply_to: email || undefined,
            subject:
              leadType === "rdv"
                ? `[RDV Boubane] ${leadRecord.name}${company ? ` · ${company}` : ""}`
                : `[Projet Boubane] ${leadRecord.name}${company ? ` · ${company}` : ""}`,
            text: [
              `Type : ${leadType.toUpperCase()}`,
              `Nom : ${leadRecord.name}`,
              `Entreprise : ${leadRecord.company}`,
              `Téléphone : ${phone || "Non renseigné"}`,
              `Email : ${email || "Non renseigné"}`,
              `Ville : ${city || "Non renseignée"}`,
              craft ? `Secteur : ${craft}` : "",
              preferredSlot ? `Créneau : ${preferredSlot}` : "",
              modules.length ? `Modules : ${modules.join(", ")}` : "",
              totalPrice !== undefined ? `Total : ${totalPrice} € HT` : "",
              "",
              message,
            ]
              .filter(Boolean)
              .join("\n"),
          }),
        })
          .then((res) => res.ok)
          .catch(() => false)
      );
    }

    // 4. Optional Discord / Slack incoming webhook
    const chatWebhook =
      process.env.DISCORD_WEBHOOK_URL?.trim() ||
      process.env.SLACK_WEBHOOK_URL?.trim();
    if (chatWebhook) {
      const summary = `**[Boubane · ${leadType.toUpperCase()}]** ${leadRecord.name} (${leadRecord.company}) — ${phone || email} ${preferredSlot ? `· Créneau: ${preferredSlot}` : ""}`;
      tasks.push(
        fetchWithTimeout(chatWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: summary, text: summary }),
        })
          .then((res) => res.ok)
          .catch(() => false)
      );
    }

    const results = await Promise.all(tasks);
    const relayed = results.some(Boolean);

    return NextResponse.json({
      ok: true,
      id: leadRecord.id,
      relayed,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 }
    );
  }
}
