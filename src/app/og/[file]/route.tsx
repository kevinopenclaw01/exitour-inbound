import { ImageResponse } from "next/og";
import { dayProduct } from "@/content/pricing";
import { site } from "@/content/site";
import { ogEntries, OG_SIZE } from "@/lib/meta";

// 쪽별 공유 그림(1200×630 PNG). WhatsApp·LINE·카카오톡·SNS에 링크를 붙였을 때 나오는 그림이다.
// 빌드 때 src/content/pages.ts와 안내 글 제목에서 한 장씩 굽는다(/og/<key>.png). 값·후기 같은 확정되지 않은 내용은 넣지 않는다.
// 흰 바탕에 글자만 쓴다(사진을 넣지 않는다: AI로 만든 풍경을 공유 그림에서 실제 상품처럼 보이게 하지 않으려고).

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogEntries().map((entry) => ({ file: `${entry.key}.png` }));
}

const green = "#0d6a4b";
const deep = "#08442f";
const ink = "#15201b";
const muted = "#56645c";
const line = "#d8e0da";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const entry = ogEntries().find((e) => `${e.key}.png` === file);
  if (!entry) return new Response("Not found", { status: 404 });

  const titleSize = entry.title.length > 58 ? 54 : entry.title.length > 36 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px 72px",
          borderTop: `14px solid ${green}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ fontSize: 38, color: deep, letterSpacing: -0.5 }}>{site.brand}</div>
          <div style={{ fontSize: 24, color: muted, marginLeft: 16 }}>{`by ${site.operator}`}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, color: ink, lineHeight: 1.12, letterSpacing: -1.5 }}>{entry.title}</div>
          <div style={{ fontSize: 32, color: muted, marginTop: 24, lineHeight: 1.3 }}>{entry.sub}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid ${line}`,
            paddingTop: 24,
            fontSize: 26,
            color: muted,
          }}
        >
          <div style={{ display: "flex" }}>{`Private van · ${dayProduct.hours} hours · up to ${dayProduct.maxPassengers} passengers`}</div>
          <div style={{ display: "flex", color: green }}>Seoul · Gyeonggi</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
