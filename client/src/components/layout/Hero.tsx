import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Clock } from "lucide-react";
import type { Noticia, Categoria } from "@shared/schema";
import { useEffect, useState } from "react";

export const Hero = () => {
  // Estado para armazenar a categoria de vídeo
  const [videoCategoria, setVideoCategoria] = useState<Categoria | null>(null);
  const [isVideoArticle, setIsVideoArticle] = useState<boolean>(false);

  // Buscar todas as categorias
  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
    enabled: true
  });

  // Buscar a notícia principal
  const { data: noticiaPrincipal, isLoading } = useQuery({
    queryKey: ["/api/noticias/destaque"],
    select: (data: { noticias: Noticia[] }) => data.noticias[0],
  });

  // Encontrar a categoria de vídeo
  useEffect(() => {
    if (categorias) {
      const videoCat = categorias.find(cat => 
        cat.slug === 'video' || cat.nome.toLowerCase() === 'vídeo' || cat.nome.toLowerCase() === 'video'
      );
      if (videoCat) {
        setVideoCategoria(videoCat);
      }
    }
  }, [categorias]);

  // Verificar se a notícia principal é da categoria vídeo
  useEffect(() => {
    if (noticiaPrincipal && videoCategoria) {
      setIsVideoArticle(noticiaPrincipal.categoriaId === videoCategoria.id);
    }
  }, [noticiaPrincipal, videoCategoria]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!noticiaPrincipal) return null;

  return (
    <section className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg lg:aspect-square">
          <Link href={`/noticia/${noticiaPrincipal.slug}`}>
            <img
              src={noticiaPrincipal.imageUrl}
              alt={noticiaPrincipal.titulo}
              className="absolute inset-0 h-full w-full object-cover"
            />
            
            {/* Overlay com ícone de play para artigos de vídeo */}
            {isVideoArticle && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity hover:opacity-90 flex items-center justify-center">
                <div className="relative z-10 transform transition-transform hover:scale-110">
                  <div className="bg-white/90 rounded-full p-6 shadow-lg">
                    <Play className="h-12 w-12 text-primary fill-primary" />
                  </div>
                </div>
                
                {/* Duração do vídeo */}
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-black/70 text-white rounded-md px-3 py-1 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {noticiaPrincipal.tempoLeitura || "5 min"}
                  </div>
                </div>
              </div>
            )}
          </Link>
          
          {/* Categoria (badge) para vídeo em posição fixa */}
          {isVideoArticle && videoCategoria && (
            <div className="absolute top-4 left-4 z-20">
              <Link href={`/categoria/${videoCategoria.slug}`}>
                <div 
                  className="bg-primary text-white rounded-md px-3 py-1 text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: videoCategoria.cor || '#3b82f6' }}
                >
                  {videoCategoria.nome}
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <Link href={`/noticia/${noticiaPrincipal.slug}`}>
            <h1 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl lg:text-4xl line-clamp-3 group-hover:text-primary transition-colors">
              {noticiaPrincipal.titulo}
            </h1>
          </Link>
          <p className="text-lg text-muted-foreground line-clamp-3 md:line-clamp-4 lg:line-clamp-6">
            {noticiaPrincipal.resumo}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={noticiaPrincipal.publicadoEm ? noticiaPrincipal.publicadoEm.toString() : ''}>
              {noticiaPrincipal.publicadoEm 
                ? new Date(noticiaPrincipal.publicadoEm).toLocaleDateString('pt-BR') 
                : ''}
            </time>
            <span>•</span>
            
            {/* Exibir ícone de play para vídeos */}
            {isVideoArticle ? (
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3 fill-primary text-primary" />
                {noticiaPrincipal.tempoLeitura || "5 min"}
              </span>
            ) : (
              <span>{noticiaPrincipal.tempoLeitura}</span>
            )}
          </div>
          
          {/* Botão "Assistir" para vídeos ou "Ler mais" para artigos normais */}
          <div className="pt-4">
            <Link href={`/noticia/${noticiaPrincipal.slug}`}>
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-medium transition-colors
                ${isVideoArticle 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {isVideoArticle ? (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    Assistir agora
                  </>
                ) : (
                  'Ler mais'
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
