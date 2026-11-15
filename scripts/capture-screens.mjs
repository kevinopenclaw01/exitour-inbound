// 화면 캡처: 켜져 있는 사이트를 데스크톱 폭과 휴대폰 폭으로 열어 쪽 전체를 PNG로 저장한다.
// 설치된 Edge(없으면 Chrome)를 창 없이 띄워 개발자 도구 통신(CDP)으로 찍는다. 따로 설치할 것이 없다(Node 22 이상).
//
// 사용(사이트를 먼저 켠다: npm.cmd run build 다음 npm.cmd run start -- -p 3210):
//   node scripts/capture-screens.mjs http://localhost:3210 "C:\저장할\폴더"
//   node scripts/capture-screens.mjs http://localhost:3210 "C:\저장할\폴더" home prices day-plans   ← 쪽을 골라서
// 결과 파일 이름: <쪽>_desktop-1440.png, <쪽>_mobile-390.png, 그리고 휴대폰 첫 화면만 찍은 <쪽>_mobile-390_first-screen.png
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base, outDir, ...only] = process.argv.slice(2);
if (!base || !outDir) {
  console.error('사용: node scripts/capture-screens.mjs http://localhost:3210 "저장 폴더" [쪽 주소...]');
  process.exit(1);
}
// 쪽 주소는 "prices"처럼 앞의 /를 빼고 적어도 된다(Git Bash는 /로 시작하는 인자를 파일 경로로 바꿔 버린다).
const paths = (only.length > 0 ? only : ["/", "/private-driver", "/driver-guide", "/prices", "/plan"]).map((p) => (p === "home" ? "/" : p.startsWith("/") ? p : `/${p}`));
const viewports = [
  { name: "desktop-1440", width: 1440, height: 900, scale: 1, mobile: false },
  { name: "mobile-390", width: 390, height: 844, scale: 2, mobile: true },
];

const browser = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => existsSync(p));
if (!browser) throw new Error("Edge나 Chrome을 찾지 못했습니다.");

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "entour-capture-"));
const port = 9300 + Math.floor(Math.random() * 500);
const child = spawn(
  browser,
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "--disable-gpu", "about:blank"],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForBrowser() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      // 아직 뜨는 중
    }
    await sleep(200);
  }
  throw new Error("브라우저가 뜨지 않았습니다.");
}

/** 탭 하나에 붙어 명령을 보내는 작은 CDP 클라이언트. */
async function openTab() {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let nextId = 1;
  const pending = new Map();
  const waiters = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method) {
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (waiters[i].method === message.method) waiters.splice(i, 1)[0].resolve(message.params);
      }
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const once = (method) => new Promise((resolve) => waiters.push({ method, resolve }));
  const close = async () => {
    ws.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
  };
  return { send, once, close };
}

const fileName = (path) => (path === "/" ? "home" : path.replace(/^\//, "").replace(/[^a-z0-9-]+/gi, "_"));

try {
  await waitForBrowser();
  for (const path of paths) {
    for (const vp of viewports) {
      const tab = await openTab();
      await tab.send("Page.enable");
      await tab.send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: vp.scale, mobile: vp.mobile });
      if (vp.mobile) await tab.send("Emulation.setTouchEmulationEnabled", { enabled: true });
      const loaded = tab.once("Page.loadEventFired");
      await tab.send("Page.navigate", { url: `${base.replace(/\/$/, "")}${path}` });
      await loaded;
      await sleep(600);

      if (vp.mobile) {
        const first = await tab.send("Page.captureScreenshot", { format: "png" });
        const firstFile = join(outDir, `${fileName(path)}_${vp.name}_first-screen.png`);
        writeFileSync(firstFile, Buffer.from(first.data, "base64"));
        console.log(firstFile);
      }

      // 아래까지 한 번 내려 늦게 뜨는 그림을 불러온 뒤 맨 위로 돌아온다.
      await tab.send("Runtime.evaluate", {
        expression: "(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);})()",
        awaitPromise: true,
      });
      await sleep(300);
      const metrics = await tab.send("Page.getLayoutMetrics");
      const size = metrics.cssContentSize ?? metrics.contentSize;
      const overflow = Math.round(size.width) > vp.width;
      const shot = await tab.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: vp.width, height: Math.ceil(size.height), scale: 1 },
      });
      const file = join(outDir, `${fileName(path)}_${vp.name}.png`);
      writeFileSync(file, Buffer.from(shot.data, "base64"));
      console.log(`${file}  (${vp.width}×${Math.ceil(size.height)}${overflow ? `, 가로 넘침: 내용 폭 ${Math.round(size.width)}px` : ""})`);
      await tab.close();
    }
  }
} finally {
  child.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}
