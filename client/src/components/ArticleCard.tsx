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

  // Buscar categoria do artigo
  const { data: categoria } = useQuery<Categoria>({
    queryKey: [`/api/categorias/${article.categoriaId}`],
    enabled: !!article.categoriaId
  });
  
  // Buscar autores para ter acesso a todos
  const { data: autores } = useQuery<Autor[]>({
    queryKey: ["/api/autores"],
    enabled: true
  });
  
  // Encontrar o autor correto pelo ID usando apenas a lista completa de autores
  // Isso evita fazer requisições individuais que podem falhar
  const autorData = autores?.find(a => a.id === article.autorId);

  return (
    <article className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative aspect-video w-full overflow-hidden">
        <Link href={`/noticia/${article.slug}`}>
          <img
            src={article.imageUrl}
            alt={article.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Categoria no canto do card */}
        {categoria ? (
          <div className="absolute top-3 left-3">
            <Link href={`/categoria/${categoria.slug}`}>
              <Badge 
                variant="secondary" 
                className="text-white hover:opacity-90 cursor-pointer font-medium text-sm shadow-md px-3 py-1 transition-opacity"
                style={{ backgroundColor: categoria.cor || '#3b82f6' }}
              >
                {categoria.nome}
              </Badge>
            </Link>
          </div>
        ) : article.categoriaId ? (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-primary text-white hover:opacity-90 cursor-pointer font-medium text-sm shadow-md px-3 py-1">
              Categoria
            </Badge>
          </div>
        ) : null}
        
        {/* Tempo de leitura (se disponível) */}
        {article.tempoLeitura && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/70 text-white border-0 text-xs">
              {article.tempoLeitura}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Data de publicação e categoria */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <time dateTime={new Date(article.publicadoEm).toISOString()}>
            {new Date(article.publicadoEm).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </time>
          
          {/* Exibir categoria também como texto abaixo da imagem */}
          {categoria && (
            <>
              <span className="text-gray-400 mx-1">•</span>
              <Link href={`/categoria/${categoria.slug}`} className="text-primary hover:underline font-medium">
                {categoria.nome}
              </Link>
            </>
          )}
        </div>
        
        {/* Título do artigo */}
        <Link href={`/noticia/${article.slug}`}>
          <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {article.titulo}
          </h2>
        </Link>
        
        {/* Resumo do artigo */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {article.resumo}
        </p>
        
        {/* Autor e informações adicionais */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          {autorData ? (
            <Link href={`/autor/${autorData.slug}`} className="flex items-center group/author">
              <Avatar className="h-8 w-8 mr-2 border border-gray-200">
                {autorData.avatarUrl ? (
                  <AvatarImage src={autorData.avatarUrl} alt={autorData.nome} />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                    {autorData.nome ? autorData.nome.substring(0, 2).toUpperCase() : 'AU'}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium group-hover/author:text-primary transition-colors">
                {autorData.nome}
              </span>
            </Link>
          ) : (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border border-gray-200">
                <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                  AU
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">Carregando...</span>
            </div>
          )}
          
          {/* Botão "Ler mais" em telas pequenas */}
          <Link href={`/noticia/${article.slug}`} className="hidden xs:inline-block text-sm font-medium text-primary hover:underline">
            Ler mais
          </Link>
        </div>
        
        {/* Tags relacionadas (se houver) */}
        {tags.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <TagList tags={tags.slice(0, 3)} className="text-xs" />
          </div>
        )}
      </div>
    </article>
  );
}