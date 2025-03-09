import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Noticia, Autor, Categoria } from "@shared/schema";
import { generateArticleLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/TagList";
import { Comments } from "@/components/Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Share2, Facebook, Send } from "lucide-react";
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
  const { data: autor } = useQuery<Autor>({
    queryKey: [`/api/autores`, noticia?.autorId],
    enabled: !!noticia?.autorId
  });

  // Buscar dados da categoria
  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias`, noticia?.categoriaId],
    enabled: !!noticia?.categoriaId
  });

  const { data: tagsResponse } = useQuery({
    queryKey: ["/api/noticias", noticia?.id, "tags"],
    enabled: !!noticia?.id
  });
  
  // Verificar e converter os dados de tag para o formato esperado
  const tags = tagsResponse && Array.isArray(tagsResponse) 
    ? tagsResponse.filter(tag => 
        tag && typeof tag === 'object' && 'id' in tag && 'nome' in tag && 'slug' in tag
      )
    : [];

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
  
  // Função para compartilhar o artigo no Twitter/X
  const shareOnTwitter = () => {
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
        jsonLd={generateArticleLD(noticia, autor)}
        keywords={tags.map(tag => (tag as any).nome)}
        canonicalUrl={noticia.urlCanonica || undefined}
      />

      <article className="max-w-3xl mx-auto pt-8 px-4">
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

        {/* Tags */}
        {tags.length > 0 && <TagList tags={tags as any} className="mb-6" />}

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

        {/* Barra de ações */}
        <div className="flex justify-between items-center mb-8">
          {/* Informações do autor */}
          {autor && autor.nome && (
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={autor.avatarUrl} alt={autor.nome} />
                <AvatarFallback>{autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/autor/${autor.slug}`} className="font-medium hover:underline block text-sm">
                  {autor.nome}
                </Link>
                {autor.cargo && <span className="text-xs text-gray-500">{autor.cargo}</span>}
              </div>
            </div>
          )}

          {/* Botões de compartilhamento */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={shareOnWhatsApp} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-[#25D366] hover:border-[#128C7E]"
              title="Compartilhar no WhatsApp"
            >
              <FaWhatsapp className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button 
              onClick={shareOnFacebook} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2] hover:border-[#166FE5]"
              title="Compartilhar no Facebook"
            >
              <FaFacebookF className="h-4 w-4" />
              <span className="hidden sm:inline">Facebook</span>
            </Button>
            <Button 
              onClick={shareOnTwitter} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white border-[#1DA1F2] hover:border-[#0c85d0]"
              title="Compartilhar no Twitter/X"
            >
              <FaTwitter className="h-4 w-4" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button 
              onClick={shareNative} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 md:hidden"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" />
            </Button>
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
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={autor.avatarUrl} alt={autor.nome} />
                <AvatarFallback>{autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}</AvatarFallback>
              </Avatar>
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

        {/* Seção de comentários */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-bold mb-6">Comentários</h3>
          <Comments noticiaId={noticia.id} />
        </div>
      </article>
    </>
  );
}