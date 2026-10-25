import "server-only";

// Supabase REST(PostgREST)로 행을 넣는다. 라이브러리 없이 fetch만 쓴다.
// 키는 publishable(넣기만 허용된 공개용)이며 서버에서만 읽는다. service_role 키는 이 앱에서 쓰지 않는다.

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
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
