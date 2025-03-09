import type { Noticia, Autor } from "@shared/schema";

// Obter o domínio do site a partir de variáveis de ambiente ou usar um valor padrão
function getSiteDomain(): string {
  // Ordem de prioridade:
  // 1. VITE_SITE_DOMAIN (para produção)
  // 2. Window.location.origin (para desenvolvimento)
  // 3. Fallback para um domínio padrão se nada estiver disponível
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_SITE_DOMAIN || window.location.origin;
  }
  return import.meta.env.VITE_SITE_DOMAIN || 'https://closer-brasil.com';
}

// Limpa o texto HTML para uso em meta description
export function cleanHtmlForDescription(html: string, maxLength = 160): string {
  // Remove tags HTML
  const text = html.replace(/<\/?[^>]+(>|$)/g, ' ')
    // Remove espaços extras
    .replace(/\s+/g, ' ')
    .trim();
  
  // Limita o tamanho
  return text.length > maxLength 
    ? text.substring(0, maxLength - 3) + '...'
    : text;
}

export function generateArticleLD(article: Noticia, autor?: Autor) {
  const domain = getSiteDomain();
  const articleUrl = `${domain}/noticia/${article.slug}`;
  const logoUrl = `${domain}/logo.png`;
  
  // Priorize metaTitulo ou título original
  const headlineText = article.metaTitulo || article.titulo;
  
  // Limita headline a 110 caracteres para atender às diretrizes do Google
  const headline = headlineText.length > 110 
    ? headlineText.substring(0, 107) + '...' 
    : headlineText;
  
  // Priorize metaDescricao ou resumo
  const description = article.metaDescricao || article.resumo;
  
  // Assegura que a imagem tenha URL completa
  const imageUrl = article.imageUrl.startsWith('http') 
    ? article.imageUrl 
    : `${domain}${article.imageUrl}`;
  
  // Estrutura JSON-LD completa para um artigo de notícias
  return {
    "@context": "https://schema.org",
    "@type": article.schemaType || "NewsArticle",
    "headline": headline,
    "description": description,
    "image": [imageUrl],
    "datePublished": article.publicadoEm,
    "dateModified": article.atualizadoEm,
    "author": autor ? {
      "@type": "Person",
      "name": autor.nome,
      "url": `${domain}/autor/${autor.slug}`,
      "jobTitle": autor.cargo || "Jornalista",
      "description": autor.bio || undefined
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "Closer Brasil",
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl,
        "width": 600,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "inLanguage": "pt-BR",
    "wordCount": article.conteudo ? 
      Math.round(cleanHtmlForDescription(article.conteudo).split(/\s+/).length) : 
      undefined,
    "articleSection": article.categoriaId || undefined,
    "timeRequired": article.tempoLeitura || "PT5M"
  };
}
