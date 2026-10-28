import "server-only";

// Supabase REST(PostgREST)로 행을 넣는다. 라이브러리 없이 fetch만 쓴다.
// 키는 publishable(넣기만 허용된 공개용)이며 서버에서만 읽는다. service_role 키는 이 앱에서 쓰지 않는다.
// 변수 이름에 EXITOUR_ 접두어를 붙인 이유: 사장님 PC의 사용자 환경변수에 다른 프로젝트(오픈클로)의 SUPABASE_URL이
// 남아 있고, Next.js는 .env.local보다 PC 환경변수를 우선하므로 이름이 겹치면 엉뚱한 프로젝트로 저장을 시도한다(2026-10-28 실측).

export function supabaseConfigured(): boolean {
  return Boolean(process.env.EXITOUR_SUPABASE_URL && process.env.EXITOUR_SUPABASE_PUBLISHABLE_KEY);
}

export async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
  const url = process.env.EXITOUR_SUPABASE_URL;
  const key = process.env.EXITOUR_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured");
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed: ${res.status} ${detail.slice(0, 300)}`);
  }
}
