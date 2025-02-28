import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Noticia, Categoria } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const [, params] = useRoute("/categoria/:slug");
  const slug = params?.slug;

  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias/${slug}`],
    enabled: !!slug
  });

  const { data: noticiasData, isLoading } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: [`/api/categorias/${slug}/noticias`],
    enabled: !!slug
  });

  if (!slug) {
    return <div>Categoria não encontrada</div>;
  }

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
        title={categoria?.nome || "Categoria"}
        description={`Últimas notícias e artigos em ${categoria?.nome}`}
      />

      <h1 className="text-3xl font-merriweather font-bold mb-8">
        {categoria?.nome}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {noticiasData?.noticias?.map((noticia) => (
          <ArticleCard key={noticia.id} article={noticia} />
        )) || (
          <p className="text-gray-600">Nenhuma notícia encontrada nesta categoria.</p>
        )}
      </div>
    </>
  );
}