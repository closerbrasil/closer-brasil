import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Noticia } from "@shared/schema";

interface ArticleCardProps {
  article: Noticia;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group relative bg-card rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Link href={`/noticia/${article.slug}`} className="block">
        <div className="aspect-[16/9] w-full relative overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.titulo}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.titulo}
          </h2>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {article.resumo}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={article.publicadoEm}>
              {formatDistanceToNow(new Date(article.publicadoEm), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </time>
            {article.tempoLeitura && (
              <>
                <span>•</span>
                <span>{article.tempoLeitura}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}