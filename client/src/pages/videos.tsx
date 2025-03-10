import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { Noticia, Categoria } from "@shared/schema";
import VideoArticleCard from "@/components/VideoArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";
import { generateBreadcrumbLD } from "@/lib/seo";
import { Film } from "lucide-react";

export default function VideosPage() {
  // Não precisamos mais buscar a categoria de vídeo, pois agora usamos a tabela de vídeos diretamente

  // Buscar vídeos da API específica de vídeos
  const { data: videosData, isLoading } = useQuery<{ videos: any[]; total: number }>({
    queryKey: ["/api/videos"],
    enabled: true
  });

  // Buscar informações completas das notícias para cada vídeo
  const { data: noticiasData } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: ["/api/noticias"],
    enabled: !!videosData?.videos && videosData.videos.length > 0
  });

  // Combinar dados de vídeos com notícias para apresentação completa
  const videos = videosData?.videos?.map(video => {
    // Encontrar a notícia correspondente para cada vídeo
    const noticia = noticiasData?.noticias?.find(n => n.id === video.noticiaId);
    // Se a notícia for encontrada, retornar a combinação
    return noticia ? ({...noticia, videoData: video}) : undefined;
  }).filter((video): video is Noticia & {videoData: any} => video !== undefined) || [];

  // Preparar dados para breadcrumb
  const breadcrumbItems: BreadcrumbItemType[] = [
    { name: 'Início', url: '/' },
    { name: 'Vídeos' }
  ];
  
  // Gerar o JSON-LD para a trilha de navegação
  const breadcrumbLD = generateBreadcrumbLD(breadcrumbItems, window.location.href);

  return (
    <>
      <SEOHead
        title="Vídeos"
        description="Vídeos, reportagens e entrevistas exclusivas em formato audiovisual."
        jsonLd={breadcrumbLD}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb visual */}
        <div className="mb-6">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        <h1 className="text-3xl font-merriweather font-bold mb-2 flex items-center">
          <Film className="mr-2 h-8 w-8 text-primary" />
          Vídeos
        </h1>
        
        <p className="text-gray-600 mb-8">
          Assista a conteúdos exclusivos, reportagens e entrevistas em vídeo
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <VideoArticleCard key={video.id} article={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum vídeo disponível no momento.</p>
          </div>
        )}
      </div>
    </>
  );
}