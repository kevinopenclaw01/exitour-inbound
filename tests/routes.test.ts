import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "@/lib/llms";
import { publicRoutes } from "@/lib/routes";

const appDir = join(__dirname, "..", "src", "app");

describe("public routes", () => {
  it("every listed route has a page file", () => {
    for (const r of publicRoutes()) {
      const dir = r.path.startsWith("/travel-guide/") ? join(appDir, "travel-guide", "[slug]") : join(appDir, r.path);
      expect(existsSync(join(dir, "page.tsx")), r.path).toBe(true);
    }
  });
  it("has no duplicate paths", () => {
    const paths = publicRoutes().map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("llms.txt mentions every service and article", () => {
    const txt = buildLlmsTxt();
    for (const r of publicRoutes().filter((r) => r.priority >= 0.8 && r.path !== "/")) {
      expect(txt, r.path).toContain(r.path);
    }
  });
});

describe("llms.txt prices", () => {
  it("does not expose draft rates", () => {
    expect(buildLlmsTxt()).not.toContain("draft");
  });
});
