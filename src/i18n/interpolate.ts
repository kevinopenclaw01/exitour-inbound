// 자리 표시 채우기. 브라우저 쪽 조각(폼)에서도 쓰므로 번역 사전을 불러오지 않는 따로 된 파일이다.

export type Vars = Record<string, string | number>;

/** "Up to {n} passengers" + { n: 7 } → "Up to 7 passengers". 값이 없는 자리 표시는 그대로 둔다. */
export function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}

/** 브라우저 쪽 조각에 넘기는 작은 사전(영어 원문 → 그 언어). */
export type Messages = Record<string, string>;

export function messageTranslator(messages: Messages) {
  return (text: string, vars?: Vars) => interpolate(messages[text] ?? text, vars);
}
