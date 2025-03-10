import React, { useEffect, useRef } from 'react';
import '../styles/video.css';

interface VideoContentProps {
  content: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
  videoData?: {
    plataforma?: string;
    videoId?: string;
    embedUrl?: string;
  };
}

export function VideoContent({ content, mainContainerRef, videoData }: VideoContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Função para extrair o ID do YouTube de um iframe ou URL
  const extractYoutubeId = (src: string): string | null => {
    const match = src.match(/embed\/([^?&"]+)/);
    return match ? match[1] : null;
  };

  // Função principal para processar o conteúdo e extrair o vídeo
  useEffect(() => {
    if (contentRef.current && mainContainerRef?.current) {
      // Primeiro, limpar o container principal completamente
      mainContainerRef.current.innerHTML = '';
      
      // Verificar se temos dados específicos do vídeo
      if (videoData && (videoData.embedUrl || (videoData.plataforma === 'youtube' && videoData.videoId))) {
        // Usar o embedUrl direto dos dados do vídeo ou construir a partir do videoId
        const embedUrl = videoData.embedUrl || `https://www.youtube.com/embed/${videoData.videoId}?rel=0`;
        
        // Criar um iframe limpo diretamente com o URL ou ID do YouTube
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.className = 'video-main-iframe';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        
        // Adicionar o iframe diretamente ao container principal
        mainContainerRef.current.appendChild(iframe);
      } else {
        // Modo de compatibilidade - buscar iframe no conteúdo
        // Encontrar todos os iframes do YouTube no conteúdo
        const youtubeIframes = Array.from(contentRef.current.querySelectorAll('iframe'))
          .filter(iframe => (iframe as HTMLIFrameElement).src && 
                          (iframe as HTMLIFrameElement).src.includes('youtube.com'));
        
        if (youtubeIframes.length > 0) {
          // Extrair o ID do primeiro iframe YouTube
          const firstIframe = youtubeIframes[0] as HTMLIFrameElement;
          const youtubeId = extractYoutubeId(firstIframe.src);
          
          if (youtubeId) {
            // Criar um iframe limpo diretamente com o ID do YouTube
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
            iframe.className = 'video-main-iframe';
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            
            // Adicionar o iframe diretamente ao container principal
            mainContainerRef.current.appendChild(iframe);
            
            // Remover o primeiro iframe do conteúdo para evitar duplicidade
            if (firstIframe.parentNode) {
              firstIframe.parentNode.removeChild(firstIframe);
            }
          }
        }
      }
      
      // Remover todas as imagens que possam estar no conteúdo principal
      contentRef.current.querySelectorAll('img').forEach(img => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      });
      
      // Processar os iframes remanescentes
      Array.from(contentRef.current.querySelectorAll('iframe'))
        .filter(iframe => (iframe as HTMLIFrameElement).src && 
                          (iframe as HTMLIFrameElement).src.includes('youtube.com'))
        .forEach(iframe => {
          // Verificar se já está dentro de um wrapper
          if (!iframe.parentElement?.classList.contains('video-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            
            const container = document.createElement('div');
            container.className = 'video-container';
            
            const parent = iframe.parentNode;
            if (parent) {
              parent.insertBefore(wrapper, iframe);
              wrapper.appendChild(container);
              container.appendChild(iframe);
            }
            
            iframe.classList.add('video-secondary-iframe');
          }
        });
    }
  }, [content, mainContainerRef, videoData]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-lg max-w-none prose-headings:font-bold 
      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
      prose-p:text-gray-800 prose-p:leading-relaxed
      prose-a:text-primary prose-a:font-medium hover:prose-a:underline
      video-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}