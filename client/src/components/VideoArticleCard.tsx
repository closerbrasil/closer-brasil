import { Link } from "wouter";
import { Clock, Calendar, Play } from "lucide-react";
import type { Noticia } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/BookmarkButton";

interface TagData {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
}

interface VideoArticleCardProps {
  article: Noticia;
}

export default function VideoArticleCard({ article }: VideoArticleCardProps) {
  // Formatar a data de publicação
  const publishedDate = new Date(article.publicadoEm);
  const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Extrair o ID do vídeo do YouTube do conteúdo, se houver
  const youtubeIdMatch = article.conteudo.match(/youtube\.com\/embed\/([^"&?/\s]+)/);
  const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : null;

  return (
    <article className="relative flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Miniatura do vídeo com marcação de reprodução */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {article.imageUrl ? (
          <>
            <img 
              src={article.imageUrl} 
              alt={article.titulo} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center">
                <Play fill="white" size={32} className="text-white ml-1" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Play fill="white" size={48} className="text-white ml-1" />
          </div>
        )}
        
        {/* Badge da categoria */}
        {article.categoriaNome && (
          <Link href={`/categoria/${article.categoriaSlug}`}>
            <Badge className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 flex items-center gap-1" style={{ backgroundColor: article.categoriaCor || undefined }}>
              <Play className="h-3 w-3 fill-white mr-1" />
              {article.categoriaNome}
            </Badge>
          </Link>
        )}
      </div>
      
      <div className="flex-1 p-4">
        {/* Título do vídeo */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary">
          <Link href={`/video/${article.slug}`} className="hover:underline">
            {article.titulo}
          </Link>
        </h3>
        
        {/* Resumo do vídeo */}
        <p className="text-gray-600 line-clamp-2 mb-3 text-sm">
          {article.resumo}
        </p>
        
        {/* Metadados do vídeo */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {article.tempoLeitura && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{article.tempoLeitura}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
          </div>
          
          {article.autorNome && (
            <Link href={`/autor/${article.autorSlug}`} className="hover:underline flex items-center">
              <span>por </span>
              <span className="font-medium ml-1">{article.autorNome}</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Bookmark button */}
      <div className="absolute top-3 right-3">
        <BookmarkButton 
          articleId={article.id} 
          articleTitle={article.titulo}
          size="sm"
          className="bg-white/80 hover:bg-white text-gray-700"
        />
      </div>
    </article>
  );
}