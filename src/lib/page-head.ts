const origin = "https://hackathon-horizon-finder.lovable.app";
export function pageHead(title: string, description: string, path: string, privatePage = false) {
  return {
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: `${origin}${path}` },
      { name: "twitter:card", content: "summary_large_image" },
      ...(privatePage ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: `${origin}${path}` }],
  };
}