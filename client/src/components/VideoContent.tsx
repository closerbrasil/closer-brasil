import React, { useEffect, useRef } from 'react';
import '../styles/video.css';

interface VideoContentProps {
  content: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
}

export function VideoContent({ content, mainContainerRef }: VideoContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Função para extrair e destacar o primeiro vídeo do YouTube, e formatar o restante do conteúdo
  useEffect(() => {
    if (contentRef.current) {
      // Encontrar todos os iframes do YouTube no conteúdo
      const youtubeIframes = contentRef.current.querySelectorAll('iframe[src*="youtube.com"]');
      
      // Verificar se existem iframes de YouTube e se temos um container de referência para o vídeo principal
      if (youtubeIframes.length > 0 && mainContainerRef?.current) {
        // Copiar o primeiro iframe para a seção de destaque
        const firstYoutubeIframe = youtubeIframes[0].cloneNode(true) as HTMLIFrameElement;
        
        // Limpar o container principal
        mainContainerRef.current.innerHTML = '';
        
        // Adicionar classes ao iframe
        firstYoutubeIframe.classList.add('video-main-iframe');
        
        // Adicionar o iframe ao container principal
        mainContainerRef.current.appendChild(firstYoutubeIframe);
        
        // Remover o primeiro iframe do conteúdo para evitar duplicidade
        if (youtubeIframes[0].parentNode) {
          youtubeIframes[0].parentNode.removeChild(youtubeIframes[0]);
        }
      }
      
      // Formatar os demais iframes do YouTube no conteúdo (se houver mais de um)
      contentRef.current.querySelectorAll('iframe[src*="youtube.com"]').forEach(iframe => {
        // Verificar se já está dentro de um wrapper
        if (!iframe.parentElement?.classList.contains('video-container')) {
          // Criar wrapper para manter proporção adequada
          const wrapper = document.createElement('div');
          wrapper.className = 'video-wrapper';
          
          // Criar container interno para o iframe
          const container = document.createElement('div');
          container.className = 'video-container';
          
          // Inserir o iframe dentro do container
          const parent = iframe.parentNode;
          if (parent) {
            parent.insertBefore(wrapper, iframe);
            wrapper.appendChild(container);
            container.appendChild(iframe);
          }
          
          // Adicionar classes ao iframe
          iframe.classList.add('video-secondary-iframe');
        }
      });
    }
  }, [content, mainContainerRef]);

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