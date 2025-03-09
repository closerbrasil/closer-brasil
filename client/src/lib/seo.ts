import type { Noticia, Autor } from "@shared/schema";

export function generateArticleLD(article: Noticia, autor?: Autor) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.titulo,
    "description": article.resumo,
    "image": [article.imageUrl],
    "datePublished": article.publicadoEm,
    "dateModified": article.atualizadoEm,
    "author": autor ? {
      "@type": "Person",
      "name": autor.nome,
      "url": `https://closer-brasil.com/autor/${autor.slug}`
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "Closer Brasil",
      "logo": {
        "@type": "ImageObject",
        "url": "https://closer-brasil.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://closer-brasil.com/noticia/${article.slug}`
    }
  };
}
