import { Link } from "wouter";
import type { Tag } from "@shared/schema";

interface TagListProps {
  tags: Tag[];
  className?: string;
}

export function TagList({ tags, className = "" }: TagListProps) {
  if (!tags?.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 transition-colors"
        >
          #{tag.nome}
        </Link>
      ))}
    </div>
  );
}
