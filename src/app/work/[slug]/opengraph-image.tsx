import { ImageResponse } from "next/og";
import { findArtwork } from "@/lib/artwork-repository";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = await findArtwork(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg,#0f111d,#151827,#0a0c14)",
          color: "#e8e4dd",
          padding: 64,
          gap: 44,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 440,
            height: 440,
            borderRadius: 36,
            background: "#151827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {artwork?.patternImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={artwork.patternImage} width={440} height={440} style={{ objectFit: "cover" }} alt="" />
          ) : (
            <div style={{ color: "#e8c66a", fontSize: 54, fontWeight: 900 }}>非遗有灵</div>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "#e8c66a", fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>
            Lively Heritage
          </div>
          <div style={{ marginTop: 22, fontSize: 64, fontWeight: 900, lineHeight: 1.06 }}>
            {artwork?.title || "非遗文创提案"}
          </div>
          <div style={{ marginTop: 24, fontSize: 30, fontWeight: 700, color: "#9a958a", lineHeight: 1.35 }}>
            {artwork?.prompt || "输入灵感，生成非遗纹样、3D文创贴图和可分享作品页。"}
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
            {["纹样炼成", "3D贴图", "提案导出", "再创作"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  background: "rgba(201,152,74,0.15)",
                  color: "#c9984a",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
