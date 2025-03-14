import { Helmet } from 'react-helmet-async';

type SeoType = "website" | "article" | "profile" | "video.other";

interface SEOHeadProps {
  title: string;
  description: string;
  type?: SeoType;
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: {
    name: string;
    url: string;
  };
  keywords?: string[];
  canonicalUrl?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export default function SEOHead({
  title,
  description,
  type = "website",
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  canonicalUrl,
  jsonLd,
}: SEOHeadProps) {
  const siteTitle = "Closer Brasil";
  const defaultDescription = "Notícias e análises sobre tecnologia, cultura e negócios no Brasil";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultImage = "https://closer-brasil.com/og-image.jpg";

  // Garantir que os valores são strings válidas
  const safeKeywords = Array.isArray(keywords) ? keywords.join(", ") : "";
  const safeDescription = description || defaultDescription;
  const safeImage = image || defaultImage;
  const safeType = type || "website";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      {safeKeywords && <meta name="keywords" content={safeKeywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content={safeType} />
      <meta property="og:locale" content="pt_BR" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={safeImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@closerbrasil" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImage} />

      {/* Article Specific */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && (
            <>
              <meta property="article:author" content={author.name} />
              <meta property="article:author:url" content={author.url} />
            </>
          )}
        </>
      )}

      {/* JSON-LD - Suporta múltiplos objetos */}
      {jsonLd && Array.isArray(jsonLd) ? (
        // Se for um array de objetos JSON-LD, renderizar múltiplos scripts
        jsonLd.map((item, index) => (
          <script key={`json-ld-${index}`} type="application/ld+json">
            {JSON.stringify(item)}
          </script>
        ))
      ) : jsonLd ? (
        // Se for apenas um objeto JSON-LD
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
    </Helmet>
  );
}