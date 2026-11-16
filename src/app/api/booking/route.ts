import { after } from "next/server";
import { bookingMessage, bookingQuote, bookingRow, parseBooking, validateBooking, type Booking } from "@/lib/booking";
import { todayKst } from "@/lib/dates";
import { referenceCode } from "@/lib/inquiry";
import type { DayQuote } from "@/lib/pricing";
import { notifyConfigured, notifyOwner } from "@/lib/notify";
import { insertRow, supabaseConfigured } from "@/lib/supabase";

// 구매(/book) 저장. 금액은 여기서 src/content/pricing.ts로 다시 계산한다(브라우저가 보낸 금액은 받지 않는다).
// 저장되면 사장님 PC의 중계 프로그램이 카톡으로 보낸다(semi ochestra\자동화\entour\Relay-EntourInquiries.mjs).

function notifyAfterResponse(subject: string, booking: Booking, quote: DayQuote, reference?: string) {
  if (!notifyConfigured()) return;
  after(async () => {
    const results = await notifyOwner(subject, bookingMessage(booking, quote, reference));
    for (const r of results) if (!r.ok) console.error(`Booking notification failed (${r.channel}): ${r.detail ?? ""}`);
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 스팸 봇용 숨은 칸.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true, reference: null });
  }

  const booking = parseBooking(body);
  const errors = validateBooking(booking, todayKst());
  if (Object.keys(errors).length > 0) return Response.json({ ok: false, errors }, { status: 422 });

  const quote = bookingQuote(booking);
  if (!quote) return Response.json({ ok: false, error: "This product is not open for online booking yet." }, { status: 409 });

  if (!supabaseConfigured()) {
    notifyAfterResponse("[Entour Korea] 새 예약 — DB 미연결, 저장되지 않음", booking, quote);
    return Response.json({ ok: false, error: "Online booking is not connected yet." }, { status: 503 });
  }

  const id = crypto.randomUUID();
  const reference = referenceCode(id);
  const sourcePage = request.headers.get("referer") ?? "";
  try {
    await insertRow("inquiries", bookingRow(booking, quote, id, sourcePage));
  } catch (e) {
    console.error(e);
    notifyAfterResponse("[Entour Korea] 새 예약 — 저장 실패, 이 알림이 유일한 기록", booking, quote);
    return Response.json({ ok: false, error: "We could not save your booking." }, { status: 502 });
  }
  notifyAfterResponse(`[Entour Korea] 새 예약 ${reference}`, booking, quote, reference);
  return Response.json({ ok: true, reference, totalKrw: quote.totalKrw, totalUsd: quote.totalUsd });
}
