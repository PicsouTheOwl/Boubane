import { NextResponse } from "next/server";

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1600);
  try {
    const res = await fetch("https://rdv.boubane.com/boubane/30min", {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });
    return NextResponse.json({ online: res.ok });
  } catch {
    return NextResponse.json({ online: false });
  } finally {
    clearTimeout(timer);
  }
}
