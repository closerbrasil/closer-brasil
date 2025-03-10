import { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import { Bookmark } from "lucide-react";
import type { Noticia } from "@shared/schema";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const [savedArticles, setSavedArticles] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Consultar informações para cada artigo salvo
  const fetchBookmarkedArticles = async () => {
    if (!bookmarks.length) {
      setSavedArticles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Em um ambiente real, seria ideal ter um endpoint para buscar vários artigos de uma vez
      // Para este exemplo, buscamos um por um
      const promises = bookmarks.map(id => 
        fetch(`/api/noticias/${id}`)
          .then(res => {
            if (!res.ok) {
              console.error(`Erro ao buscar artigo ${id}: Status ${res.status}`);
              return null;
            }
            return res.json();
          })
          .catch(err => {
            console.error(`Erro ao buscar artigo ${id}:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      const validArticles = results.filter(article => article !== null);
      console.log('Artigos recuperados:', validArticles.length);
      setSavedArticles(validArticles);
    } catch (error) {
      console.error("Erro ao buscar artigos salvos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedArticles();
  }, [bookmarks]);

  return (
    <>
      <SEOHead
        title="Meus Favoritos"
        description="Artigos que você salvou para ler mais tarde"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb visual - simples para esta página */}
        <div className="mb-10">
          <SEOBreadcrumb 
            items={[
              { name: 'Início', url: '/' },
              { name: 'Meus Favoritos' }
            ]} 
          />
        </div>
        
        <div className="flex items-center mb-8">
          <Bookmark className="mr-2 h-6 w-6" />
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(Math.min(bookmarks.length || 3, 6))].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">Você ainda não tem artigos salvos</h2>
            <p className="text-muted-foreground">
              Clique no ícone de marcador em qualquer artigo para adicioná-lo aos seus favoritos.
            </p>
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">Não foi possível recuperar seus artigos salvos</h2>
            <p className="text-muted-foreground">
              Houve um problema ao buscar os artigos. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}