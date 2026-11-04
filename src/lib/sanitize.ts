import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(dirty: string) {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "h2",
      "h3",
      "h4",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}
