-- 여행 요청(문의). 사이트 폼에서 들어온다. 손님 연락처가 있어 공개 조회는 막고 넣기만 허용한다.
-- Supabase 프로젝트 exitour-inbound(imzbtkzmbkblvtdmkxnk)에 2026-10-25 적용함.
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service text not null check (service in ('private-driver', 'driver-guide', 'guide-tour', 'not-sure')),
  start_date date not null,
  days integer not null check (days between 1 and 30),
  group_size integer not null check (group_size between 1 and 40),
  language text not null check (char_length(language) between 2 and 60),
  pickup text not null default '' check (char_length(pickup) <= 200),
  interests text not null default '' check (char_length(interests) <= 2000),
  name text not null check (char_length(name) between 1 and 100),
  contact text not null check (char_length(contact) between 5 and 200),
  heard_from text not null default '' check (char_length(heard_from) <= 60),
  source_page text not null default '' check (char_length(source_page) <= 200),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'booked', 'closed', 'spam')),
  admin_note text not null default ''
);

comment on table public.inquiries is '사이트 여행 요청. anon은 status=new 넣기만 가능, 조회·수정은 대시보드(서비스 역할)에서만.';

create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;

create policy "Anyone can submit a new inquiry"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (status = 'new' and admin_note = '');

revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
