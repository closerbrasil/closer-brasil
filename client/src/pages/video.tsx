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
import { Calendar, Clock, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import { getSiteDomain } from "@/lib/seo";

/**
 * Função para gerar JSON-LD para VideoObject conforme schema.org
 */
function generateVideoLD(video: Noticia, autor?: Autor, tags?: Array<{nome: string}>) {
  // Extrair o ID do vídeo do conteúdo, se possível
  const youtubeIdMatch = video.conteudo.match(/youtube\.com\/embed\/([^"&?/\s]+)/);
  const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : null;
  
  // Base URL do site
  const siteDomain = getSiteDomain();
  const urlVideo = `${siteDomain}/video/${video.slug}`;
  
  // Formato de data ISO para publicação
  const publishDate = new Date(video.publicadoEm).toISOString();
  
  const videoLD: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.titulo,
    "description": video.resumo,
    "thumbnailUrl": video.imageUrl,
    "uploadDate": publishDate,
    "duration": video.tempoLeitura ? `PT${video.tempoLeitura.replace(/[^0-9]/g, '')}M` : "PT5M",
    "contentUrl": urlVideo,
    "embedUrl": youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : undefined,
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
    }
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
  
  const { data: noticia, isLoading } = useQuery<Noticia>({
    queryKey: [`/api/noticias/${slug}`],
    enabled: !!slug
  });

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
  const videoLD = generateVideoLD(noticia, autor, tagsData);

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

      <article className="max-w-3xl mx-auto pt-8 px-4">
        {/* Botão voltar */}
        <div className="mb-6">
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
      
        {/* Breadcrumb no topo da página */}
        <div className="mb-8">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Título principal */}
        <h1 className="text-3xl md:text-4xl font-merriweather font-bold mb-4">
          {noticia.titulo}
        </h1>

        {/* Informações do vídeo (duração, categoria, data) */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-600">
          {noticia.tempoLeitura && (
            <div className="flex items-center bg-primary/10 px-2 py-1 rounded-md">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              <span className="font-medium">{noticia.tempoLeitura}</span>
            </div>
          )}
          
          {categoria && (
            <Link href={`/categoria/${categoria.slug}`}>
              <Badge 
                className="px-3 py-1 text-sm font-medium flex items-center gap-1"
                style={{ backgroundColor: categoria.cor || '#3b82f6', color: 'white' }}
              >
                <Play className="h-3 w-3 fill-white" />
                {categoria.nome}
              </Badge>
            </Link>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
          </div>
          
          {autor && (
            <Link href={`/autor/${autor.slug}`} className="hover:underline flex items-center">
              <span className="text-gray-400 mr-1">por</span>
              <span className="font-medium">{autor.nome}</span>
            </Link>
          )}
        </div>

        {/* Resumo do vídeo */}
        <p className="text-lg text-gray-700 mb-6 font-merriweather leading-relaxed">
          {noticia.resumo}
        </p>

        {/* Vídeo em destaque */}
        <div ref={videoRef} className="mb-8">
          {/* O iframe do vídeo será injetado aqui pelo VideoContent */}
        </div>

        {/* Barra de ações - Botões de compartilhamento */}
        <div className="flex flex-wrap justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={shareOnWhatsApp} 
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-md"
              title="Compartilhar no WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button 
              onClick={shareOnFacebook} 
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-md"
              title="Compartilhar no Facebook"
            >
              <FaFacebookF className="h-5 w-5" />
              <span className="hidden sm:inline">Facebook</span>
            </button>
            <button 
              onClick={shareOnX} 
              className="flex items-center gap-2 bg-[#000000] hover:bg-[#333333] text-white px-4 py-2 rounded-md"
              title="Compartilhar no X"
            >
              <FaTwitter className="h-5 w-5" />
              <span className="hidden sm:inline">X</span>
            </button>
          </div>
        </div>

        {/* Conteúdo de descrição */}
        <div className="mb-12 video-description">
          <VideoContent content={noticia.conteudo} mainContainerRef={videoRef} />
        </div>

        {/* Bio do autor ao final */}
        {autor && autor.bio && (
          <div className="bg-gray-50 p-6 rounded-lg mb-12">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 mr-4 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
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
                <Link href={`/autor/${autor.slug}`} className="font-bold text-lg hover:underline">
                  {autor.nome}
                </Link>
                {autor.cargo && <p className="text-sm text-gray-600">{autor.cargo}</p>}
              </div>
            </div>
            <p className="text-gray-700">{autor.bio}</p>
          </div>
        )}

        {/* Card de Tags */}
        {tagsData.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg mb-12">
            <h3 className="text-lg font-bold mb-4">Tags relacionadas</h3>
            <TagList tags={tagsData} className="text-base" />
          </div>
        )}

        {/* Seção de vídeos relacionados */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Play className="h-5 w-5 fill-primary text-primary" />
            Vídeos relacionados
          </h2>
          <RelatedPosts 
            noticiaId={noticia.id} 
            categoriaId={noticia.categoriaId} 
            autorId={noticia.autorId}
          />
        </div>

        {/* Seção de comentários */}
        <div className="mt-12 pt-8 border-t">
          <Comments noticiaId={noticia.id} />
        </div>
      </article>
    </>
  );
}