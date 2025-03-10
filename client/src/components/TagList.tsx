import { Link } from "wouter";

// Interface para garantir consistência com a TagData no ArticleCard
interface TagData {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
}

interface TagListProps {
  tags: TagData[];
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
