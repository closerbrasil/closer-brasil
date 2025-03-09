import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Noticia, Autor } from "@shared/schema";
import { generateArticleLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/TagList";
import { Comments } from "@/components/Comments";

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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!noticia) {
    return <div>Artigo não encontrado</div>;
  }

  const publishedDate = new Date(noticia.publicadoEm);

  return (
    <>
      <SEOHead
        title={noticia.titulo}
        description={noticia.resumo}
        type="article"
        image={noticia.imageUrl}
        publishedTime={publishedDate.toISOString()}
        author={autor ? {
          name: autor.nome,
          url: `/autor/${autor.slug}`
        } : undefined}
        jsonLd={generateArticleLD(noticia, autor)}
      />

      <article className="max-w-3xl mx-auto pt-8">
        <h1 className="text-4xl font-merriweather font-bold mb-6">
          {noticia?.titulo || ""}
        </h1>

        {tags.length > 0 && <TagList tags={tags as any} className="mb-6" />}

        <img
          src={noticia?.imageUrl || ""}
          alt={noticia?.titulo || ""}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div
          className="prose prose-lg max-w-none mb-12 prose-headings:mb-2"
          dangerouslySetInnerHTML={{ __html: noticia?.conteudo || "" }}
        />

        {/* Seção de comentários */}
        <div className="mt-12 pt-8 border-t">
          <Comments noticiaId={noticia?.id || ""} />
        </div>
      </article>
    </>
  );
}