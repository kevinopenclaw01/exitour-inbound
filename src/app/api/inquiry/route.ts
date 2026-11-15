import { after } from "next/server";
import { todayKst } from "@/lib/dates";
import { inquiryMessage, inquiryRow, parseInquiry, referenceCode, validateInquiry, type Inquiry } from "@/lib/inquiry";
import { notifyConfigured, notifyOwner } from "@/lib/notify";
import { insertRow, supabaseConfigured } from "@/lib/supabase";

// 여행 요청 저장. 성공하면 요청 번호를 돌려준다. 저장이 안 되면 손님은 WhatsApp·복사로 보낼 수 있다(폼이 안내).
// 저장한 뒤(또는 저장에 실패했을 때) 사장님께 알림을 보낸다(src/lib/notify.ts — 환경변수가 있을 때만).

/** 응답을 보낸 뒤에 알림을 보낸다. 알림이 느리거나 실패해도 손님 화면은 기다리지 않는다. */
function notifyAfterResponse(subject: string, inquiry: Inquiry, reference?: string) {
  if (!notifyConfigured()) return;
  after(async () => {
    const results = await notifyOwner(subject, inquiryMessage(inquiry, reference));
    for (const r of results) if (!r.ok) console.error(`Inquiry notification failed (${r.channel}): ${r.detail ?? ""}`);
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 스팸 봇용 숨은 칸. 사람이 채울 일이 없으니 채워져 있으면 저장하지 않고 성공처럼 답한다.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true, reference: null });
  }

  const inquiry = parseInquiry(body);
  const errors = validateInquiry(inquiry, todayKst());
  if (Object.keys(errors).length > 0) return Response.json({ ok: false, errors }, { status: 422 });

  if (!supabaseConfigured()) {
    // 저장소가 연결되지 않았어도 알림 통로가 있으면 요청을 사장님께 넘긴다(손님에게는 WhatsApp으로도 보내라고 안내한다).
    notifyAfterResponse("[Entour Korea] 새 여행 요청 — DB 미연결, 저장되지 않음", inquiry);
    return Response.json({ ok: false, error: "Online requests are not connected yet." }, { status: 503 });
  }

  const id = crypto.randomUUID();
  const reference = referenceCode(id);
  const sourcePage = request.headers.get("referer") ?? "";
  try {
    await insertRow("inquiries", inquiryRow(inquiry, id, sourcePage));
  } catch (e) {
    console.error(e);
    notifyAfterResponse("[Entour Korea] 새 여행 요청 — 저장 실패, 이 알림이 유일한 기록", inquiry);
    return Response.json({ ok: false, error: "We could not save your request." }, { status: 502 });
  }
  notifyAfterResponse(`[Entour Korea] 새 여행 요청 ${reference}`, inquiry, reference);
  return Response.json({ ok: true, reference });
}
