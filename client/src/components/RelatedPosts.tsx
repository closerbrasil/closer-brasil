import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import type { Noticia } from "@shared/schema";

interface RelatedPostsProps {
  noticiaId: string;
  categoriaId?: string;
  autorId?: string;
  limit?: number;
}

export function RelatedPosts({ 
  noticiaId, 
  categoriaId, 
  autorId, 
  limit = 3 
}: RelatedPostsProps) {
  // Buscar artigos relacionados pela mesma categoria
  const { data: noticias, isLoading } = useQuery<{ noticias: Noticia[], total: number }>({
    queryKey: [
      categoriaId ? `/api/noticias/categoria/${categoriaId}` : '/api/noticias',
      { limit }
    ],
    enabled: !!categoriaId || true, // Se não tiver categoria, busca as notícias gerais
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!noticias || noticias.noticias.length === 0) {
    return null;
  }
  
  // Filtrar posts para não incluir o post atual e limitar ao número especificado
  const relatedPosts = noticias.noticias
    .filter(post => post.id !== noticiaId)
    .slice(0, limit);
    
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">Posts Relacionados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="cursor-pointer" 
              onClick={() => window.location.href = `/noticia/${post.slug}`}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.titulo} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <time dateTime={new Date(post.publicadoEm).toISOString()}>
                    {new Date(post.publicadoEm).toLocaleDateString('pt-BR')}
                  </time>
                </div>
                <h4 className="font-bold text-md line-clamp-2 mb-2 hover:text-primary transition-colors">
                  {post.titulo}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.resumo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}