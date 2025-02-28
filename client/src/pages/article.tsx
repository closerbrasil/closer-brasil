import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Article } from "@shared/schema";
import { generateArticleLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug;

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        type="article"
        image={article.imageUrl}
        publishedTime={new Date(article.publishedAt).toISOString()}
      />

      <script type="application/ld+json">
        {JSON.stringify(generateArticleLD(article))}
      </script>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-merriweather font-bold mb-4">
          {article.title}
        </h1>

        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}