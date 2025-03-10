import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Noticia, Autor, Categoria } from "@shared/schema";
import { generateArticleLD, generateBreadcrumbLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/TagList";
import { Comments } from "@/components/Comments";
import { RelatedPosts } from "@/components/RelatedPosts";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Share2, Facebook, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function ArticlePage() {
  const [, params] = useRoute("/noticia/:slug");
  const slug = params?.slug;

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

      <article className="max-w-3xl mx-auto pt-8 px-4">
        {/* Breadcrumb no topo da página */}
        <div className="mb-6">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Categoria e informações editoriais */}
        <div className="mb-4">
          {/* Categoria */}
          <div className="mb-2">
            {categoria && (
              <Link href={`/categoria/${categoria.slug}`} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium hover:bg-primary/20">
                {categoria.nome}
              </Link>
            )}
          </div>
          
          {/* Data e tempo de leitura na mesma linha */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
            </div>
            {noticia.tempoLeitura && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{noticia.tempoLeitura}</span>
              </div>
            )}
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl font-merriweather font-bold mb-6">
          {noticia.titulo}
        </h1>

        {/* Resumo do artigo */}
        <p className="text-lg text-gray-700 mb-6 font-serif leading-relaxed">
          {noticia.resumo}
        </p>

        {/* Imagem principal */}
        <figure className="mb-8">
          <img
            src={noticia.imageUrl}
            alt={noticia.titulo}
            className="w-full max-h-[500px] object-cover rounded-lg"
          />
          {noticia.imagemCredito && (
            <figcaption className="text-sm text-gray-500 mt-2 italic text-right">
              Crédito: {noticia.imagemCredito}
            </figcaption>
          )}
        </figure>

        {/* Barra de ações - Botões de compartilhamento */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={shareOnWhatsApp} 
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-md"
              title="Compartilhar no WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5" />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={shareOnFacebook} 
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-md"
              title="Compartilhar no Facebook"
            >
              <FaFacebookF className="h-5 w-5" />
              <span>Facebook</span>
            </button>
            <button 
              onClick={shareOnX} 
              className="flex items-center gap-2 bg-[#000000] hover:bg-[#333333] text-white px-4 py-2 rounded-md"
              title="Compartilhar no X"
            >
              <FaTwitter className="h-5 w-5" />
              <span>X</span>
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div
          className="prose prose-lg max-w-none mb-12 prose-headings:mb-2 prose-img:rounded-lg prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

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

        {/* Seção de posts relacionados */}
        <div className="mb-8">
          <RelatedPosts 
            noticiaId={noticia.id} 
            categoriaId={noticia.categoriaId} 
            autorId={noticia.autorId}
          />
        </div>

        {/* Seção de comentários */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-bold mb-6">Comentários</h3>
          <Comments noticiaId={noticia.id} />
        </div>
      </article>
    </>
  );
}