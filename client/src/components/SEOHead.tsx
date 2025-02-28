import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export default function SEOHead({
  title,
  description,
  type = "website",
  image,
  url,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const siteTitle = "Closer Brasil";
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
