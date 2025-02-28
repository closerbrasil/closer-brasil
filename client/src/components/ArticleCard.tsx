import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-merriweather font-bold mb-2">
          <Link href={`/article/${article.slug}`}>
            <a className="text-gray-900 hover:text-[#FF4D4D]">
              {article.title}
            </a>
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </div>
      </div>
    </article>
  );
}
