import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Noticia, Autor, Categoria } from "@shared/schema";
import { TagList } from "./TagList";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Definir interface para Tag compatível com o que vem da API
interface TagData {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
}

interface ArticleCardProps {
  article: Noticia;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { data: tagsData } = useQuery<unknown>({
    queryKey: ["/api/noticias", article.id, "tags"],
    enabled: !!article.id
  });
  
  // Verificar e converter os dados de tag para o formato esperado
  const tags: TagData[] = tagsData && Array.isArray(tagsData) 
    ? tagsData.filter((tag): tag is TagData => 
        tag !== null && 
        typeof tag === 'object' && 
        'id' in tag && 
        'nome' in tag && 
        'slug' in tag
      )
    : [];

  const { data: autor } = useQuery<Autor>({
    queryKey: ["/api/autores", article.autorId],
    enabled: !!article.autorId
  });
  
  // Buscar categoria do artigo
  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias/${article.categoriaId}`],
    enabled: !!article.categoriaId
  });

  return (
    <article className="group relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Link href={`/noticia/${article.slug}`}>
          <img
            src={article.imageUrl}
            alt={article.titulo}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Exibir categoria como badge no canto do card */}
        {categoria && (
          <div className="absolute bottom-2 left-2">
            <Link href={`/categoria/${categoria.slug}`}>
              <Badge variant="secondary" className="bg-primary/90 text-white hover:bg-primary cursor-pointer">
                {categoria.nome}
              </Badge>
            </Link>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Link href={`/noticia/${article.slug}`}>
          <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
            {article.titulo}
          </h2>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {article.resumo}
        </p>
        <div className="mt-2 flex items-center justify-between">
          {autor && (
            <div className="flex items-center">
              <div className="h-6 w-6 mr-2 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                {autor.avatarUrl ? (
                  <img 
                    src={autor.avatarUrl} 
                    alt={autor.nome} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                    {autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}
                  </div>
                )}
              </div>
              <Link href={`/autor/${autor.slug}`} className="text-xs hover:underline">
                {autor.nome}
              </Link>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            há {formatDistanceToNow(new Date(article.publicadoEm), { locale: ptBR })}
          </div>
        </div>
        {tags.length > 0 && <TagList tags={tags} className="mt-3" />}
      </div>
    </article>
  );
}