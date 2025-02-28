import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Noticia } from "@shared/schema";
import { generateArticleLD } from "@/lib/seo";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const [, params] = useRoute("/noticia/:slug");
  const slug = params?.slug;

  const { data: noticia, isLoading } = useQuery<Noticia>({
    queryKey: [`/api/noticias/${slug}`],
    enabled: !!slug
  });

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
        jsonLd={generateArticleLD(noticia)}
      />

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-merriweather font-bold mb-4">
          {noticia.titulo}
        </h1>

        <img
          src={noticia.imageUrl}
          alt={noticia.titulo}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </article>
    </>
  );
}