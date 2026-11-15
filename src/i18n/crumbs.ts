import type { Translator } from "./translate";

/** 이동 경로(빵 부스러기). 이름은 번역하고 주소에는 언어 앞머리를 붙인다. 화면(Breadcrumbs)과 구조화 데이터(breadcrumbLd)가 같이 쓴다. */
export function crumbs(t: Translator, items: [name: string, path: string][]): { name: string; path: string }[] {
  return items.map(([name, path]) => ({ name: t(name), path: t.href(path) }));
}
