import { Link } from "wouter";
import { Clock, Calendar, Play, Eye } from "lucide-react";
import type { Noticia, Video } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface TagData {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
}

interface ExtendedNoticia extends Noticia {
  categoriaNome?: string;
  categoriaSlug?: string;
  categoriaCor?: string;
  autorNome?: string;
  autorSlug?: string;
  videoData?: Video; // Adicionando videoData ao tipo ExtendedNoticia
}

interface VideoArticleCardProps {
  article: Noticia | ExtendedNoticia;
  videoData?: Video; // Permitindo passar videoData como prop separada também
}

export default function VideoArticleCard({ article, videoData: propVideoData }: VideoArticleCardProps) {
  // Usar videoData da prop ou do article
  const videoData = propVideoData || ('videoData' in article ? article.videoData : undefined);
  
  // Formatar a data de publicação
  const publishedDate = new Date(article.publicadoEm);
  const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Usar o ID do vídeo da API de vídeos ou extrair do conteúdo como fallback
  const videoId = videoData?.videoId || 
    (article.conteudo.match(/youtube\.com\/embed\/([^"&?/\s]+)/) || [])[1] || null;
  
  // Extrair dados seguros do vídeo para evitar erros de TypeScript
  const videoInfo = {
    thumbnailUrl: videoData?.thumbnailUrl || undefined,
    titulo: videoData?.titulo || undefined,
    visualizacoes: typeof videoData?.visualizacoes === 'number' ? videoData.visualizacoes : 0,
    duracao: typeof videoData?.duracao === 'number' ? videoData.duracao : 0
  };

  // Formatador de números para visualizações
  const formatNumber = (num: number): string => {
    return num > 0 ? num.toLocaleString('pt-BR') : '0';
  };
  
  // Formatador de tempo para duração
  const formatDuration = (seconds: number): string => {
    if (seconds <= 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <article className="relative flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Miniatura do vídeo com marcação de reprodução */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {/* Usar thumbnail do vídeo, se disponível, ou a imagem do artigo */}
        {videoInfo.thumbnailUrl || article.imageUrl ? (
          <>
            <img 
              src={videoInfo.thumbnailUrl || article.imageUrl} 
              alt={videoInfo.titulo || article.titulo} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center">
                <Play fill="white" size={32} className="text-white ml-1" />
              </div>
            </div>
            
            {/* Exibir contador de visualizações se disponível */}
            {videoInfo.visualizacoes > 0 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs rounded px-2 py-1 flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {formatNumber(videoInfo.visualizacoes)}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Play fill="white" size={48} className="text-white ml-1" />
          </div>
        )}
        
        {/* Badge da categoria */}
        {('categoriaNome' in article && article.categoriaNome) && (
          <Link href={`/categoria/${'categoriaSlug' in article ? article.categoriaSlug : ''}`}>
            <Badge className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 flex items-center gap-1" style={{ backgroundColor: 'categoriaCor' in article ? article.categoriaCor : undefined }}>
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
          {/* Usar duração do vídeo se disponível, ou tempo de leitura do artigo como fallback */}
          {(videoInfo.duracao > 0 || article.tempoLeitura) && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {videoInfo.duracao > 0 ? (
                <span>{formatDuration(videoInfo.duracao)}</span>
              ) : (
                <span>{article.tempoLeitura}</span>
              )}
            </div>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
          </div>
          
          {/* Exibir visualizações aqui também como texto */}
          {videoInfo.visualizacoes > 0 && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{formatNumber(videoInfo.visualizacoes)} visualizações</span>
            </div>
          )}
          
          {('autorNome' in article && article.autorNome) && (
            <Link href={`/autor/${'autorSlug' in article ? article.autorSlug : ''}`} className="hover:underline flex items-center">
              <span>por </span>
              <span className="font-medium ml-1">{article.autorNome}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}