import type { Article } from "@shared/schema";

export function generateArticleLD(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.imageUrl],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://closer-brasil.com/article/${article.slug}`
    }
  };
}
