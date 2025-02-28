import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
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
}: SEOHeadProps) {
  const siteTitle = "Closer Brasil";
  const defaultDescription = "Notícias e análises sobre tecnologia, cultura e negócios no Brasil";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultImage = "https://closer-brasil.com/og-image.jpg"; // Imagem padrão do site

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords.join(", ")} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="pt_BR" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {!image && <meta property="og:image" content={defaultImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@closerbrasil" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
      {!image && <meta name="twitter:image" content={defaultImage} />}

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

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
    </Helmet>
  );
}