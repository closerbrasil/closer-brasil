import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] w-full relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-bold mb-2 line-clamp-2">
          <Link href={`/article/${article.slug}`}>
            <a className="text-gray-900 hover:text-[#FF4D4D] transition-colors">
              {article.title}
            </a>
          </Link>
        </h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(article.publishedAt), { 
            addSuffix: true,
            locale: ptBR 
          })}
        </div>
      </div>
    </article>
  );
}