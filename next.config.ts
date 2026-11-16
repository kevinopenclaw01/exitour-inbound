import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // www.entour.kr로 들어오면 entour.kr로 보낸다(같은 쪽이 두 주소로 잡히지 않게). 2026-11-16 도메인 연결.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.entour.kr" }],
        destination: "https://entour.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
