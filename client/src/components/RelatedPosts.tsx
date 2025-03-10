import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import type { Noticia, Categoria } from "@shared/schema";

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
  // Obter dados da categoria se tivermos o ID da categoria
  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias/${categoriaId}`],
    enabled: !!categoriaId,
  });
  
  // Obter dados das categorias dos posts relacionados
  const { data: todasCategorias } = useQuery<Categoria[]>({
    queryKey: ['/api/categorias'],
    enabled: !categoriaId, // Carrega todas as categorias se não tivermos uma categoria específica
  });
  
  // Buscar todas as notícias quando não temos categoria
  const { data: todasNoticias, isLoading: isLoadingTodas } = useQuery<{ noticias: Noticia[], total: number }>({
    queryKey: ['/api/noticias'],
    enabled: !categoriaId, // Só carrega se não tiver categoria específica
  });
  
  // Buscar artigos relacionados pela mesma categoria (API /api/categorias/:slug/noticias)
  const { data: noticiasCategoria, isLoading: isLoadingCategoria } = useQuery<{ noticias: Noticia[], total: number }>({
    queryKey: [`/api/categorias/${categoria?.slug}/noticias`],
    enabled: !!categoria?.slug, // Só carrega quando temos o slug da categoria
  });

  const isLoading = isLoadingTodas || isLoadingCategoria;
  
  if (isLoading) {
    return (
      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-bold mb-6 border-b pb-2">Posts Relacionados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Determinar qual fonte de dados usar
  const noticias = categoria?.slug ? noticiasCategoria : todasNoticias;
  
  if (!noticias || !noticias.noticias || noticias.noticias.length === 0) {
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
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">Leia Também</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
            <Link href={`/noticia/${post.slug}`}>
              <div className="cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.titulo} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.categoriaId && (
                    <div className="absolute top-3 left-3">
                      {(() => {
                        // Se temos uma categoria fixa, usamos ela
                        if (categoria && post.categoriaId === categoriaId) {
                          return (
                            <span 
                              className="text-white text-xs px-2 py-1 rounded font-medium"
                              style={{ backgroundColor: categoria.cor || "#3b82f6" }}
                            >
                              {categoria.nome}
                            </span>
                          );
                        }
                        
                        // Caso contrário, procuramos a categoria correta na lista de todas as categorias
                        if (todasCategorias) {
                          const postCategoria = todasCategorias.find(cat => cat.id === post.categoriaId);
                          if (postCategoria) {
                            return (
                              <span 
                                className="text-white text-xs px-2 py-1 rounded font-medium"
                                style={{ backgroundColor: postCategoria.cor || "#3b82f6" }}
                              >
                                {postCategoria.nome}
                              </span>
                            );
                          }
                        }
                        
                        // Fallback: se não encontramos a categoria, mostramos um label genérico
                        return (
                          <span 
                            className="text-white text-xs px-2 py-1 rounded font-medium bg-primary"
                          >
                            Notícia
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <time dateTime={new Date(post.publicadoEm).toISOString()}>
                      {new Date(post.publicadoEm).toLocaleDateString('pt-BR')}
                    </time>
                    {post.tempoLeitura && (
                      <span className="ml-3 text-xs text-gray-500">
                        {post.tempoLeitura}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-md line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {post.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.resumo}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}