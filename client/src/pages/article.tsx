import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useEffect, useState } from "react";
import type { Noticia, Autor, Categoria } from "@shared/schema";
import { generateArticleLD, generateBreadcrumbLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import "../styles/article.css";
import { ArticleContent } from "@/components/ArticleContent";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/TagList";
import { Comments } from "@/components/Comments";
import { RelatedPosts } from "@/components/RelatedPosts";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Share2, Facebook, Send, User, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function ArticlePage() {
  const [, params] = useRoute("/noticia/:slug");
  const slug = params?.slug;
  
  // Estado para controlar se é artigo de vídeo
  const [isVideoArticle, setIsVideoArticle] = useState<boolean>(false);

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
  
  // Buscar todas as categorias para identificar se é um artigo de vídeo
  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
    enabled: true
  });
  
  // Determinar se é um artigo da categoria "vídeo" quando as categorias ou o artigo mudar
  useEffect(() => {
    if (noticia && categorias && categoria) {
      // Verificar se a categoria atual é a de vídeo
      const isVideo = 
        categoria.slug === 'video' || 
        categoria.nome.toLowerCase() === 'vídeo' || 
        categoria.nome.toLowerCase() === 'video';
      
      setIsVideoArticle(isVideo);
    }
  }, [noticia, categorias, categoria]);

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

  // Função para compartilhar o artigo no WhatsApp
  const shareOnWhatsApp = () => {
    const text = `${noticia?.titulo} - ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  
  // Função para compartilhar o artigo no Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };
  
  // Função para compartilhar o artigo no X (ex-Twitter)
  const shareOnX = () => {
    const text = `${noticia?.titulo}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };
  
  // Função para compartilhar usando API nativa (se disponível)
  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: noticia?.titulo || '',
        text: noticia?.resumo || '',
        url: window.location.href
      })
      .catch(err => console.error('Erro ao compartilhar:', err));
    } else {
      // Fallback para navegadores sem suporte a Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar link:', err));
    }
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
        <h2 className="text-2xl font-bold mb-4">Artigo não encontrado</h2>
        <p className="text-gray-500 mb-8">O artigo que você está procurando não está disponível ou foi removido.</p>
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

  // Adicionar "Artigos" como nível intermediário para melhor organização
  breadcrumbItems.push({
    name: 'Artigos',
    url: '/artigos',
  });

  // Adicionar categoria se disponível
  if (categoria) {
    breadcrumbItems.push({
      name: categoria.nome,
      url: `/categoria/${categoria.slug}`,
    });
  }

  // Adicionar título do artigo como último item
  breadcrumbItems.push({
    name: noticia.titulo,
  });
  
  // Gerar o JSON-LD para a trilha de navegação
  const breadcrumbLD = generateBreadcrumbLD(breadcrumbItems, window.location.href);

  // Combinar os esquemas JSON-LD para artigo e breadcrumb
  const combinedJsonLd = [
    generateArticleLD(noticia, autor, tagsData),
    breadcrumbLD
  ];

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        type="article"
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

      <article className="max-w-3xl mx-auto pt-4 sm:pt-6 md:pt-8 px-3 sm:px-4">
        <div className="mb-4 sm:mb-6 md:mb-10">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Título principal */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-merriweather font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
          {noticia.titulo}
        </h1>

        {/* Resumo do artigo */}
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 md:mb-6 font-merriweather leading-relaxed">
          {noticia.resumo}
        </p>

        {/* Exibir imagem de capa apenas para artigos sem vídeo */}
        {!isVideoArticle && (
          <figure className="mb-4 relative">
            {/* Exibição normal da imagem */}
            <img
              src={noticia.imageUrl}
              alt={noticia.titulo}
              className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[500px] object-cover rounded-lg"
            />
            
            {/* Crédito da imagem - sobreposto */}
            {noticia.imagemCredito && (
              <figcaption className="absolute bottom-2 right-2 text-[10px] sm:text-xs md:text-sm text-white bg-black/60 px-2 sm:px-3 py-1 rounded-md shadow-md">
                Crédito: {noticia.imagemCredito}
              </figcaption>
            )}
          </figure>
        )}
        
        {/* Informações editoriais e botões de compartilhamento */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
          {/* Data, tempo de leitura e categoria */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] sm:text-xs md:text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
            </div>
            
            {/* Mostrar duração do artigo */}
            {noticia.tempoLeitura && (
              <div className="flex items-center">
                {isVideoArticle ? (
                  <>
                    <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 fill-primary text-primary" />
                    <span className="text-primary font-medium">{noticia.tempoLeitura}</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span>{noticia.tempoLeitura}</span>
                  </>
                )}
              </div>
            )}
            
            {/* Badge de categoria */}
            {categoria && (
              <>
                <span className="text-gray-400">•</span>
                <Link 
                  href={`/categoria/${categoria.slug}`} 
                  className="flex items-center hover:underline"
                  style={{ color: categoria.cor || 'currentColor' }}
                >
                  {isVideoArticle && <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 fill-current" />}
                  <span className="font-medium text-[10px] sm:text-xs md:text-sm">{categoria.nome}</span>
                </Link>
              </>
            )}
          </div>
          
          {/* Botões de compartilhamento */}
          <div className="flex items-center gap-2">
            <button 
              onClick={shareOnWhatsApp} 
              className="flex items-center gap-1 sm:gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
              title="Compartilhar no WhatsApp"
            >
              <FaWhatsapp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button 
              onClick={shareOnFacebook} 
              className="flex items-center gap-1 sm:gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
              title="Compartilhar no Facebook"
            >
              <FaFacebookF className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Facebook</span>
            </button>
            <button 
              onClick={shareOnX} 
              className="flex items-center gap-1 sm:gap-2 bg-[#000000] hover:bg-[#333333] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
              title="Compartilhar no X"
            >
              <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">X</span>
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="mb-8 sm:mb-12">
          {/* Para artigos de vídeo */}
          {isVideoArticle && (
            <div className="youtube-featured-video mb-6 sm:mb-8 mt-3 sm:mt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
                  Vídeo em destaque
                </h2>
                
                {categoria && (
                  <Link href={`/categoria/${categoria.slug}`}>
                    <Badge 
                      className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium flex items-center gap-1"
                      style={{ backgroundColor: categoria.cor || '#3b82f6', color: 'white' }}
                    >
                      <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-white" />
                      {categoria.nome}
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          )}
          
          <ArticleContent content={noticia.conteudo} />
        </div>

        {/* Bio do autor */}
        {autor && autor.bio && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                {autor.avatarUrl ? (
                  <img 
                    src={autor.avatarUrl} 
                    alt={autor.nome} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-bold">
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
            <p className="text-sm sm:text-base text-gray-700">{autor.bio}</p>
          </div>
        )}

        {/* Card de Tags */}
        {tagsData.length > 0 && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Tags relacionadas</h3>
            <TagList tags={tagsData} className="text-sm sm:text-base" />
          </div>
        )}

        {/* Seção de posts relacionados */}
        <div className="mb-6 sm:mb-8">
          <RelatedPosts 
            noticiaId={noticia.id} 
            categoriaId={noticia.categoriaId} 
            autorId={noticia.autorId}
          />
        </div>

        {/* Seção de comentários */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <Comments noticiaId={noticia.id} />
        </div>
      </article>
    </>
  );
}