import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSiteArticleFromSlug } from "@/lib/articles";

export const alt = "The Journal of Young Innovators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function publicAssetDataUri(publicPath: string): Promise<string | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      publicPath.replace(/^\//, ""),
    );
    const data = await readFile(filePath);
    const ext = publicPath.split(".").pop()?.toLowerCase();
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream";
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ article: string }> | { article: string };
}) {
  const resolved = await Promise.resolve(params);
  const article = getSiteArticleFromSlug(resolved.article);

  const title = article?.title ?? "The Journal of Young Innovators";
  const author = article?.author ?? "";
  const category = article?.category ?? "";
  const volumeIssue = article
    ? `Vol. ${article.volume} · Issue ${article.issueNumber}`
    : "";

  const bgUri = article?.image ? await publicAssetDataUri(article.image) : null;
  const logoUri = await publicAssetDataUri("/logodark.png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#0b0b0c",
          color: "#ffffff",
          fontFamily: "serif",
        }}
      >
        {bgUri ? (
          <img
            src={bgUri}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.92) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: "sans-serif",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {logoUri ? (
              <img
                src={logoUri}
                width={56}
                height={48}
                style={{ width: 56, height: 48, objectFit: "contain" }}
              />
            ) : null}
            <span>The Journal of Young Innovators</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {category ? (
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 22,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  color: "#f4b400",
                }}
              >
                {category}
              </div>
            ) : null}
            <div
              style={{
                fontSize: title.length > 90 ? 56 : 68,
                lineHeight: 1.1,
                fontWeight: 400,
                maxWidth: 1056,
                display: "flex",
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                fontFamily: "sans-serif",
                fontSize: 24,
                color: "rgba(255,255,255,0.85)",
                marginTop: 12,
              }}
            >
              <div style={{ display: "flex", maxWidth: 800 }}>{author}</div>
              <div
                style={{
                  display: "flex",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontSize: 20,
                }}
              >
                {volumeIssue}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
