/**
 * 번역할 영어 문장이라는 표시(값은 그대로 돌려준다). 쪽 파일 맨 위의 상수 목록처럼 t('…')로 바로 감쌀 수 없는 문장에 쓴다.
 * src/i18n/extract.ts가 t('…')·t.rich('…')·msg('…') 안의 문장을 모아 번역 열쇠 목록(source.json)을 만든다.
 */
export const msg = (text: string): string => text;
