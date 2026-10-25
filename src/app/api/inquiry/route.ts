import { insertRow, supabaseConfigured } from "@/lib/supabase";
import { todayKst } from "@/lib/dates";
import { inquiryRow, parseInquiry, referenceCode, validateInquiry } from "@/lib/inquiry";

// 여행 요청 저장. 성공하면 요청 번호를 돌려준다. 저장이 안 되면 손님은 WhatsApp·복사로 보낼 수 있다(폼이 안내).

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
    return Response.json({ ok: false, error: "Online requests are not connected yet." }, { status: 503 });
  }

  const id = crypto.randomUUID();
  const sourcePage = request.headers.get("referer") ?? "";
  try {
    await insertRow("inquiries", inquiryRow(inquiry, id, sourcePage));
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "We could not save your request." }, { status: 502 });
  }
  return Response.json({ ok: true, reference: referenceCode(id) });
}
