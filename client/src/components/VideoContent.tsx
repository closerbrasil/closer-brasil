import React, { useEffect, useRef, useState } from 'react';
import '../styles/video.css';
import { Eye, ThumbsUp, Clock } from 'lucide-react';
import type { Video } from '@shared/schema';

interface VideoContentProps {
  content: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
  videoData?: Video | {
    plataforma?: string;
    videoId?: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    titulo?: string;
    descricao?: string;
    visualizacoes?: number;
    curtidas?: number;
    duracao?: number;
  };
}

export function VideoContent({ content, mainContainerRef, videoData }: VideoContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showVideoStats, setShowVideoStats] = useState(true);

  // Função para extrair o ID do YouTube de um iframe ou URL
  const extractYoutubeId = (src: string): string | null => {
    const match = src.match(/embed\/([^?&"]+)/);
    return match ? match[1] : null;
  };

  // Função para obter o Embed URL baseado na plataforma e ID
  const getEmbedUrl = (): string | null => {
    if (!videoData) return null;

    // Se um embedUrl já está disponível, use-o
    if (videoData.embedUrl) return videoData.embedUrl;

    // Para YouTube
    if (videoData.plataforma === 'youtube' && videoData.videoId) {
      return `https://www.youtube.com/embed/${videoData.videoId}?rel=0`;
    }

    // Para Vimeo
    if (videoData.plataforma === 'vimeo' && videoData.videoId) {
      return `https://player.vimeo.com/video/${videoData.videoId}`;
    }

    // Para outros casos, tente extrair de content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const youtubeIframes = Array.from(tempDiv.querySelectorAll('iframe'))
      .filter(iframe => iframe.src && iframe.src.includes('youtube.com'));
    
    if (youtubeIframes.length > 0) {
      const firstIframe = youtubeIframes[0];
      const youtubeId = extractYoutubeId(firstIframe.src);
      if (youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
      }
    }

    return null;
  };

  // Formatar números para exibição
  const formatNumber = (num?: number | null): string => {
    if (typeof num !== 'number' || num <= 0) return '0';
    return num.toLocaleString('pt-BR');
  };

  // Formatar duração do vídeo
  const formatDuration = (seconds?: number | null): string => {
    if (typeof seconds !== 'number' || seconds <= 0) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Função principal para processar o conteúdo e extrair o vídeo
  useEffect(() => {
    if (contentRef.current && mainContainerRef?.current) {
      // Primeiro, limpar o container principal completamente
      mainContainerRef.current.innerHTML = '';
      
      // Obter URL de incorporação (embed)
      const embedUrl = getEmbedUrl();
      
      if (embedUrl) {
        // Criar um iframe limpo com o URL obtido
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.className = 'video-main-iframe';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        
        // Criar o container para o iframe
        const videoContainer = document.createElement('div');
        videoContainer.className = 'relative w-full';
        videoContainer.appendChild(iframe);
        
        // Adicionar estatísticas do vídeo se disponíveis
        if (showVideoStats && videoData && (videoData.visualizacoes || videoData.curtidas || videoData.duracao)) {
          const statsContainer = document.createElement('div');
          statsContainer.className = 'video-stats-container flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2 mb-4';
          
          // Adicionar visualizações
          if (videoData.visualizacoes) {
            const viewsDiv = document.createElement('div');
            viewsDiv.className = 'flex items-center';
            viewsDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>${formatNumber(videoData.visualizacoes)} visualizações</span>`;
            statsContainer.appendChild(viewsDiv);
          }
          
          // Adicionar curtidas
          if (videoData.curtidas) {
            const likesDiv = document.createElement('div');
            likesDiv.className = 'flex items-center';
            likesDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
            <span>${formatNumber(videoData.curtidas)}</span>`;
            statsContainer.appendChild(likesDiv);
          }
          
          // Adicionar duração
          if (videoData.duracao) {
            const durationDiv = document.createElement('div');
            durationDiv.className = 'flex items-center';
            durationDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${formatDuration(videoData.duracao)}</span>`;
            statsContainer.appendChild(durationDiv);
          }
          
          // Adicionar o container de estatísticas após o vídeo
          videoContainer.appendChild(statsContainer);
        }
        
        // Adicionar o container de vídeo ao container principal
        mainContainerRef.current.appendChild(videoContainer);
      } else {
        // Fallback para quando não temos dados explícitos - buscar no conteúdo
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
      
      // Remover todas as imagens que possam estar no conteúdo principal que pareçam ser miniaturas de vídeo
      contentRef.current.querySelectorAll('img').forEach(img => {
        if (img.parentNode && 
            (img.src.includes('youtube') || 
             img.src.includes('vimeo') || 
             img.alt.toLowerCase().includes('video') || 
             img.alt.toLowerCase().includes('youtube') ||
             img.width > 300)) {
          img.parentNode.removeChild(img);
        }
      });
      
      // Processar os iframes remanescentes
      Array.from(contentRef.current.querySelectorAll('iframe'))
        .filter(iframe => (iframe as HTMLIFrameElement).src && 
                          ((iframe as HTMLIFrameElement).src.includes('youtube.com') || 
                           (iframe as HTMLIFrameElement).src.includes('vimeo.com')))
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
  }, [content, mainContainerRef, videoData, showVideoStats]);

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