// 검색 로봇과 AI 수집·검색 로봇 모두 공개 페이지를 읽어 가도록 허용한다(docs/04_ai-search-strategy.md).
// 이름을 따로 적은 로봇은 "*" 묶음을 보지 않으므로 같은 규칙을 묶음마다 되풀이한다.
// 2026-11-15 각 회사 공식 문서에서 철자를 확인한 이름만 적었다(EXITour 한국어 사이트와 같은 목록).
// 구글봇·빙봇·네이버 Yeti·애플봇은 "*"에 들어 있다. 숨긴 쪽(/guide-tour 등)은 막지 않는다: 막으면 로봇이 noindex 표시를 읽지 못한다.
export const aiCrawlers = [
  // OpenAI — ChatGPT 검색 노출은 OAI-SearchBot
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic — Claude 검색 노출은 Claude-SearchBot
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini 학습·그라운딩(구글 검색 노출과는 무관), Apple 학습
  "Google-Extended",
  "Applebot-Extended",
  // Amazon(Alexa 등)
  "Amzn-SearchBot",
  "Amzn-User",
  "Amazonbot",
  // Meta AI
  "meta-webindexer",
  "meta-externalfetcher",
  "meta-externalagent",
  // Mistral
  "MistralAI-Index",
  "MistralAI-User",
  "MistralAI-Training",
  // DuckDuckGo AI 답변, Common Crawl
  "DuckAssistBot",
  "CCBot",
];
