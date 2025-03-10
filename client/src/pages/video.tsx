import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import type { Noticia, Autor, Categoria } from "@shared/schema";
import SEOHead from "@/components/SEOHead";
import "../styles/article.css";
import { VideoContent } from "@/components/VideoContent";
import "../styles/video.css";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/TagList";
import { Comments } from "@/components/Comments";
import { RelatedPosts } from "@/components/RelatedPosts";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";
import { Calendar, Clock, Play, ArrowLeft, Eye, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import { getSiteDomain } from "@/lib/seo";

/**
 * Função para gerar JSON-LD para VideoObject conforme schema.org
 */
function generateVideoLD(noticia: Noticia, videoData?: any, autor?: Autor, tags?: Array<{nome: string}>) {
  // Usar dados específicos do vídeo se disponíveis, ou extrair do conteúdo da notícia
  let videoId;
  let plataforma;
  let embedUrl;
  let duracao;
  
  if (videoData) {
    // Usar dados da API de vídeos
    videoId = videoData.videoId;
    plataforma = videoData.plataforma;
    embedUrl = videoData.embedUrl || (videoData.plataforma === 'youtube' ? 
      `https://www.youtube.com/embed/${videoData.videoId}` : undefined);
    duracao = videoData.duracao ? `PT${Math.floor(videoData.duracao / 60)}M${videoData.duracao % 60}S` : undefined;
  } else {
    // Extrair de forma tradicional do conteúdo
    const youtubeIdMatch = noticia.conteudo.match(/youtube\.com\/embed\/([^"&?/\s]+)/);
    videoId = youtubeIdMatch ? youtubeIdMatch[1] : null;
    plataforma = 'youtube';
    embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    duracao = noticia.tempoLeitura ? `PT${noticia.tempoLeitura.replace(/[^0-9]/g, '')}M` : "PT5M";
  }
  
  // Base URL do site
  const siteDomain = getSiteDomain();
  const urlVideo = `${siteDomain}/video/${noticia.slug}`;
  
  // Formato de data ISO para publicação
  const publishDate = new Date(noticia.publicadoEm).toISOString();
  
  const videoLD: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": noticia.titulo,
    "description": noticia.resumo,
    "thumbnailUrl": noticia.imageUrl,
    "uploadDate": publishDate,
    "duration": duracao,
    "contentUrl": urlVideo,
    "embedUrl": embedUrl,
    "author": autor ? {
      "@type": "Person",
      "name": autor.nome,
      "url": `${siteDomain}/autor/${autor.slug}`
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "Portal de Notícias",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteDomain}/logo.png`,
        "width": "600",
        "height": "60"
      }
    },
    "interactionStatistic": videoData?.visualizacoes ? {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": videoData.visualizacoes
    } : undefined
  };

  // Adicionar keywords se as tags estiverem disponíveis
  if (tags && tags.length > 0) {
    videoLD.keywords = tags.map(tag => tag.nome).join(", ");
  }

  return videoLD;
}

/**
 * Função para gerar trilha de navegação em dados estruturados
 */
function generateBreadcrumbLD(items: BreadcrumbItemType[], currentUrl: string) {
  const itemListElement = items.map((item, index) => {
    return {
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${getSiteDomain()}${item.url}` : currentUrl
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
}

export default function VideoPage() {
  const [, params] = useRoute("/video/:slug");
  const slug = params?.slug;
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Buscar a notícia pelo slug
  const { data: noticia, isLoading: isNoticiaLoading } = useQuery<Noticia>({
    queryKey: [`/api/noticias/${slug}`],
    enabled: !!slug
  });
  
  // Interface para os dados de vídeo
  interface VideoData {
    id: string;
    noticiaId: string;
    videoId: string;
    plataforma: string;
    titulo?: string;
    descricao?: string;
    thumbnailUrl?: string;
    embedUrl?: string;
    duracao?: number;
    visualizacoes?: number;
    curtidas?: number;
    dataCriacao: string;
    dataAtualizacao: string;
  }

  // Buscar os dados do vídeo quando a notícia estiver disponível
  const { data: videoData, isLoading: isVideoLoading } = useQuery<VideoData>({
    queryKey: [`/api/noticias/${noticia?.id}/video`],
    enabled: !!noticia?.id
  });
  
  // Combinando carregamentos
  const isLoading = isNoticiaLoading || isVideoLoading;

  // Buscar dados do autor quando tivermos o ID do autor da notícia
  const { data: autores } = useQuery<Autor[]>({
    queryKey: [`/api/autores`],
    enabled: !!noticia?.autorId
  });
  
  // Encontramos o autor específico da notícia pelo ID
  const autor = autores?.find(a => a.id === noticia?.autorId);

  // Buscar dados da categoria
  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias/${noticia?.categoriaId}`],
    enabled: !!noticia?.categoriaId
  });
  
  // Interface para Tag compatível com a interface do ArticleCard
  interface TagData {
    id: string;
    nome: string;
    slug: string;
    descricao?: string;
  }
  
  const { data: tags } = useQuery<TagData[]>({
    queryKey: [`/api/noticias/${noticia?.id}/tags`],
    enabled: !!noticia?.id
  });
  
  // Processar os dados de tags recebidos da API
  const tagsData: TagData[] = tags || [];

  // Função para compartilhar o vídeo no WhatsApp
  const shareOnWhatsApp = () => {
    const text = `${noticia?.titulo} - ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  
  // Função para compartilhar o vídeo no Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };
  
  // Função para compartilhar o vídeo no X (ex-Twitter)
  const shareOnX = () => {
    const text = `${noticia?.titulo}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 space-y-4 py-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Vídeo não encontrado</h2>
        <p className="text-gray-500 mb-8">O vídeo que você está procurando não está disponível ou foi removido.</p>
        <Button asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  const publishedDate = new Date(noticia.publicadoEm);
  const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Determinar o meta título e descrição para SEO
  const metaTitle = noticia.metaTitulo || noticia.titulo;
  const metaDescription = noticia.metaDescricao || noticia.resumo;

  // Preparar dados para breadcrumb visual e estruturado
  const breadcrumbItems: BreadcrumbItemType[] = [
    { name: 'Início', url: '/' },
  ];

  // Adicionar "Vídeos" como nível intermediário
  breadcrumbItems.push({
    name: 'Vídeos',
    url: '/videos',
  });

  // Adicionar categoria se disponível
  if (categoria) {
    breadcrumbItems.push({
      name: categoria.nome,
      url: `/categoria/${categoria.slug}`,
    });
  }

  // Adicionar título do vídeo como último item
  breadcrumbItems.push({
    name: noticia.titulo,
  });
  
  // Gerar o JSON-LD para o vídeo e a trilha de navegação
  const breadcrumbLD = generateBreadcrumbLD(breadcrumbItems, window.location.href);
  const videoLD = generateVideoLD(noticia, videoData, autor, tagsData);

  // Combinar os esquemas JSON-LD
  const combinedJsonLd = [videoLD, breadcrumbLD];

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        type="website"
        image={noticia.imageUrl}
        publishedTime={publishedDate.toISOString()}
        author={autor ? {
          name: autor.nome,
          url: `/autor/${autor.slug}`
        } : undefined}
        jsonLd={combinedJsonLd}
        keywords={tagsData.map(tag => tag.nome)}
        canonicalUrl={noticia.urlCanonica || undefined}
      />

      <article className="max-w-3xl mx-auto pt-4 sm:pt-8 px-4">
        {/* Botão voltar - visível apenas em telas maiores */}
        <div className="hidden sm:block mb-6">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      
        {/* Breadcrumb no topo da página - oculto em mobile */}
        <div className="hidden sm:block mb-8">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Título principal - reduzido no mobile */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-merriweather font-bold mb-3 sm:mb-4">
          {noticia.titulo}
        </h1>

        {/* Informações do vídeo - simplificadas no mobile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          {noticia.tempoLeitura && (
            <div className="flex items-center bg-primary/10 px-2 py-0.5 sm:py-1 rounded-md">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
              <span className="font-medium">{noticia.tempoLeitura}</span>
            </div>
          )}
          
          {categoria && (
            <Link href={`/categoria/${categoria.slug}`}>
              <Badge 
                className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium flex items-center gap-1"
                style={{ backgroundColor: categoria.cor || '#3b82f6', color: 'white' }}
              >
                <Play className="h-2 w-2 sm:h-3 sm:w-3 fill-white" />
                {categoria.nome}
              </Badge>
            </Link>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <time dateTime={publishedDate.toISOString()} className="text-xs sm:text-sm">{formattedDate}</time>
          </div>
        </div>
        
        {/* Autor em linha separada no mobile */}
        {autor && (
          <div className="flex items-center mb-4 sm:hidden">
            <span className="text-gray-500 text-xs mr-1">Por</span>
            <Link href={`/autor/${autor.slug}`} className="hover:underline text-xs font-medium">
              {autor.nome}
            </Link>
          </div>
        )}

        {/* Resumo do vídeo - oculto em mobile para evitar duplicação */}
        <div className="hidden sm:block">
          <p className="text-base sm:text-lg text-gray-700 mb-6 font-merriweather leading-relaxed">
            {noticia.resumo}
          </p>
        </div>

        {/* Vídeo em destaque */}
        <div ref={videoRef} className="mb-8">
          {/* O iframe do vídeo será injetado aqui pelo VideoContent */}
        </div>

        {/* Informações de visualizações e estatísticas, se disponíveis */}
        {videoData && (
          <div className="flex flex-wrap items-center gap-3 mb-4 text-gray-600 text-sm">
            {videoData.visualizacoes !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{videoData.visualizacoes} visualizações</span>
              </div>
            )}
            {videoData.curtidas !== undefined && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{videoData.curtidas} curtidas</span>
              </div>
            )}
            {videoData.duracao !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(videoData.duracao / 60)}min {videoData.duracao % 60}s</span>
              </div>
            )}
          </div>
        )}

        {/* Barra de ações - Botões de compartilhamento otimizados para mobile */}
        <div className="flex flex-wrap justify-center sm:justify-start mb-6 sm:mb-8 gap-3">
          <button 
            onClick={shareOnWhatsApp} 
            className="flex items-center gap-1 sm:gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
            title="Compartilhar no WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">WhatsApp</span>
          </button>
          <button 
            onClick={shareOnFacebook} 
            className="flex items-center gap-1 sm:gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
            title="Compartilhar no Facebook"
          >
            <FaFacebookF className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">Facebook</span>
          </button>
          <button 
            onClick={shareOnX} 
            className="flex items-center gap-1 sm:gap-2 bg-[#000000] hover:bg-[#333333] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base"
            title="Compartilhar no X"
          >
            <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">X</span>
          </button>
        </div>

        {/* Conteúdo de descrição */}
        <div className="mb-12 video-description">
          <VideoContent content={noticia.conteudo} mainContainerRef={videoRef} videoData={videoData} />
        </div>

        {/* Bio do autor ao final - otimizada para mobile */}
        {autor && autor.bio && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12 text-sm sm:text-base">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                {autor.avatarUrl ? (
                  <img 
                    src={autor.avatarUrl} 
                    alt={autor.nome} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                    {autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}
                  </div>
                )}
              </div>
              <div>
                <Link href={`/autor/${autor.slug}`} className="font-bold text-base sm:text-lg hover:underline">
                  {autor.nome}
                </Link>
                {autor.cargo && <p className="text-xs sm:text-sm text-gray-600">{autor.cargo}</p>}
              </div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{autor.bio}</p>
          </div>
        )}

        {/* Card de Tags - otimizado para mobile */}
        {tagsData.length > 0 && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Tags relacionadas</h3>
            <TagList tags={tagsData} className="text-sm sm:text-base" />
          </div>
        )}

        {/* Seção de vídeos relacionados - otimizada para mobile */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
            Vídeos relacionados
          </h2>
          <RelatedPosts 
            noticiaId={noticia.id} 
            categoriaId={noticia.categoriaId} 
            autorId={noticia.autorId}
          />
        </div>

        {/* Seção de comentários - otimizada para mobile */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <Comments noticiaId={noticia.id} />
        </div>
      </article>
    </>
  );
}