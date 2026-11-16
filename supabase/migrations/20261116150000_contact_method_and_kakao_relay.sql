-- 2026-11-16 사장님 지시: 여행 요청 폼에서 연락 방법(Email·WhatsApp·LINE·KakaoTalk)을 고르게 하고,
-- 새 요청을 사장님 카톡(예약 알림과 같은 방)으로 보낸다.
--
-- 카톡은 사장님 PC에서만 보낼 수 있어서, PC의 중계 프로그램(자동화\entour\Relay-EntourInquiries.mjs)이
-- 몇 분마다 "아직 알리지 않은 요청"을 가져가 카톡으로 보내고 알림 표시를 한다.
-- 중계는 공개 키(anon)로 아래 두 함수만 부른다. 함수는 PC에 있는 열쇠(relay.env)의 sha256이 private.relay_keys에
-- 있을 때만 행을 돌려준다. 열쇠 원문은 DB·저장소 어디에도 없다.
-- Supabase 프로젝트 exitour-inbound(imzbtkzmbkblvtdmkxnk)에 2026-11-16 적용함. 열쇠 해시는 따로 넣었다(이 파일에 없음).

alter table public.inquiries
  add column contact_method text not null default ''
    check (contact_method in ('', 'email', 'whatsapp', 'line', 'kakaotalk')),
  add column notified_at timestamptz;

-- LINE·카카오톡 ID는 5자보다 짧을 수 있다.
alter table public.inquiries drop constraint inquiries_contact_check;
alter table public.inquiries add constraint inquiries_contact_check check (char_length(contact) between 2 and 200);

-- 손님이 알림 표시를 미리 채워 넣지 못하게 한다.
drop policy "Anyone can submit a new inquiry" on public.inquiries;
create policy "Anyone can submit a new inquiry"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (status = 'new' and admin_note = '' and notified_at is null);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.relay_keys (
  key_hash text primary key,
  label text not null default '',
  created_at timestamptz not null default now()
);
revoke all on private.relay_keys from public, anon, authenticated;

create or replace function private.relay_key_ok(p_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.relay_keys
    where key_hash = encode(sha256(convert_to(coalesce(p_key, ''), 'UTF8')), 'hex')
  );
$$;

-- 아직 알리지 않은 요청(오래된 것부터 20건).
create or replace function public.inquiry_relay_pending(p_key text)
returns setof public.inquiries
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.relay_key_ok(p_key) then
    raise exception 'relay key rejected' using errcode = '42501';
  end if;
  return query
    select * from public.inquiries
    where notified_at is null and status <> 'spam'
    order by created_at
    limit 20;
end;
$$;

-- 카톡을 보낸 요청에 알림 표시를 한다. 표시한 건수를 돌려준다.
create or replace function public.inquiry_relay_mark(p_key text, p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  if not private.relay_key_ok(p_key) then
    raise exception 'relay key rejected' using errcode = '42501';
  end if;
  update public.inquiries set notified_at = now()
  where id = any(p_ids) and notified_at is null;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function private.relay_key_ok(text) from public, anon, authenticated;
revoke all on function public.inquiry_relay_pending(text) from public;
revoke all on function public.inquiry_relay_mark(text, uuid[]) from public;
grant execute on function public.inquiry_relay_pending(text) to anon;
grant execute on function public.inquiry_relay_mark(text, uuid[]) to anon;

-- 이미 있던 요청은 알린 것으로 친다(시험 건이 카톡으로 가지 않게).
update public.inquiries set notified_at = now() where notified_at is null;
