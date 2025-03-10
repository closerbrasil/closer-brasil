import React, { useEffect, useRef } from 'react';
import '../styles/article.css';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Função para adicionar classes de estilo específicas para vídeos do YouTube após renderização
  useEffect(() => {
    if (contentRef.current) {
      // Encontrar todos os iframes do YouTube no conteúdo
      const youtubeIframes = contentRef.current.querySelectorAll('iframe[src*="youtube.com"]');
      
      // Verificar se existem iframes de YouTube
      if (youtubeIframes.length > 0) {
        // Preencher a seção de vídeo em destaque se existir
        const featuredVideoSection = document.querySelector('.youtube-featured-video');
        
        if (featuredVideoSection) {
          // Copiar o primeiro iframe para a seção de destaque
          const firstYoutubeIframe = youtubeIframes[0].cloneNode(true) as HTMLIFrameElement;
          
          // Criar wrapper para manter proporção adequada
          const featuredWrapper = document.createElement('div');
          featuredWrapper.className = 'article-youtube-wrapper';
          
          // Criar container interno para o iframe
          const featuredContainer = document.createElement('div');
          featuredContainer.className = 'article-youtube-container';
          
          // Adicionar classes ao iframe
          firstYoutubeIframe.classList.add('article-youtube-iframe');
          
          // Montar a estrutura
          featuredWrapper.appendChild(featuredContainer);
          featuredContainer.appendChild(firstYoutubeIframe);
          featuredVideoSection.appendChild(featuredWrapper);
        }
      }
      
      // Aplicar classes e wrappers aos iframes do YouTube no conteúdo original
      youtubeIframes.forEach(iframe => {
        // Verificar se já está dentro de um wrapper
        if (!iframe.parentElement?.classList.contains('article-youtube-container')) {
          // Criar wrapper para manter proporção adequada
          const wrapper = document.createElement('div');
          wrapper.className = 'article-youtube-wrapper';
          
          // Criar container interno para o iframe
          const container = document.createElement('div');
          container.className = 'article-youtube-container';
          
          // Inserir o iframe dentro do container
          const parent = iframe.parentNode;
          parent?.insertBefore(wrapper, iframe);
          wrapper.appendChild(container);
          container.appendChild(iframe);
          
          // Adicionar classes ao iframe
          iframe.classList.add('article-youtube-iframe');
        }
      });
    }
  }, [content]); // Re-executar quando o conteúdo mudar

  // Esta div vai conter o HTML com as classes prose do Tailwind para formatação
  return (
    <div 
      ref={contentRef}
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
      prose-p:my-4 prose-p:leading-relaxed prose-p:text-gray-800
      prose-img:rounded-lg prose-img:my-8
      prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
      prose-ul:my-4 prose-ol:my-4 prose-li:ml-4 prose-li:my-2
      article-content" // Classe adicional para estilos específicos
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}