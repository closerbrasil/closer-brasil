import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Article, Category } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", slug],
  });

  const { data, isLoading } = useQuery<{ articles: Article[]; total: number }>({
    queryKey: ["/api/categories", slug, "articles", { page: 1, limit: 12 }],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={category?.name || "Category"}
        description={`Latest news and articles in ${category?.name}`}
      />

      <h1 className="text-3xl font-merriweather font-bold mb-8">
        {category?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
