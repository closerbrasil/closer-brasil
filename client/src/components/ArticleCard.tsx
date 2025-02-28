import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Noticia } from "@shared/schema";
import { TagList } from "./TagList";
import { useQuery } from "@tanstack/react-query";
import { BookmarkButton } from "./BookmarkButton";

interface ArticleCardProps {
  article: Noticia;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { data: tags } = useQuery({
    queryKey: ["/api/noticias", article.id, "tags"],
    enabled: !!article.id
  });

  return (
    <article className="group relative">
      {/* Botão de bookmark posicionado no canto superior direito */}
      <div className="absolute right-2 top-2 z-10">
        <BookmarkButton 
          articleId={article.id} 
          articleTitle={article.titulo}
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
        />
      </div>

      <Link href={`/noticia/${article.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={article.imageUrl}
            alt={article.titulo}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
            {article.titulo}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {article.resumo}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            há {formatDistanceToNow(new Date(article.publicadoEm), { locale: ptBR })}
          </div>
          {tags && <TagList tags={tags} className="mt-3" />}
        </div>
      </Link>
    </article>
  );
}