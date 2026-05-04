import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Journal of Young Innovators",
    short_name: "JYI",
    description:
      "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
