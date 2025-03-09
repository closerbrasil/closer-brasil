import { useQuery } from "@tanstack/react-query";
import type { Noticia } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/layout/Hero";
import { Sidebar } from "@/components/layout/Sidebar";
import { useMemo } from "react";

export default function Home() {
  // Buscar notícias destacadas
  const { data: destaqueData, isLoading: isLoadingDestaque } = useQuery<{ noticias: Noticia[] }>({
    queryKey: ["/api/noticias/destaque"],
    enabled: true
  });

  // Buscar notícias mais lidas
  const { data: trendingData, isLoading: isLoadingTrending } = useQuery<Noticia[]>({
    queryKey: ["/api/noticias/trending"],
    enabled: true
  });

  // Buscar todas as notícias
  const { data, isLoading } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: ["/api/noticias"],
    enabled: true
  });

  // Filtra as notícias para evitar duplicações com as notícias destacadas e trending
  const noticiasUnicas = useMemo(() => {
    if (!data?.noticias) return [];
    
    // Ids de notícias que já estão no destaque ou trending
    const idsDestaque = new Set<string>();
    
    // Adiciona ids da notícia destacada
    if (destaqueData?.noticias && destaqueData.noticias.length > 0) {
      destaqueData.noticias.forEach(noticia => idsDestaque.add(noticia.id));
    }
    
    // Adiciona ids das notícias trending
    if (trendingData && trendingData.length > 0) {
      trendingData.forEach(noticia => idsDestaque.add(noticia.id));
    }
    
    // Filtra as notícias que não estão no destaque ou trending
    return data.noticias.filter(noticia => !idsDestaque.has(noticia.id));
  }, [data?.noticias, destaqueData?.noticias, trendingData]);

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
                {noticiasUnicas.map((noticia) => (
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