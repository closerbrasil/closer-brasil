import { useQuery } from "@tanstack/react-query";
import type { Noticia } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/layout/Hero";
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

      <div className="min-h-screen">
        <Hero />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <main>
            <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data?.noticias?.map((noticia) => (
                  <ArticleCard key={noticia.id} article={noticia} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            <Sidebar />
          </aside>
        </div>
      </div>
    </>
  );
}