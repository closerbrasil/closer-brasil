import { useQuery } from "@tanstack/react-query";
import type { Noticia } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/layout/Hero";
import { NewsCategories } from "@/components/layout/NewsCategories";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  const { data, isLoading } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: ["/api/noticias"],
    enabled: true
  });

  return (
    <>
      <SEOHead
        title="Últimas Notícias"
        description="Fique por dentro das últimas notícias e histórias do Brasil e do mundo."
      />

      <div className="container py-6">
        <Hero />
        <NewsCategories />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <main>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data?.noticias?.map((noticia) => (
                  <ArticleCard key={noticia.id} article={noticia} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}