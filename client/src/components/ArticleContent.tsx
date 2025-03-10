import React from 'react';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Extrair os parágrafos do conteúdo HTML
  const paragraphs = content.split('</p>').filter(p => p.trim() !== '');
  
  // Função para limpar tags HTML internas preservando o texto
  const cleanInnerHTML = (html: string) => {
    return html
      .replace(/<p[^>]*>/g, '') // Remove a tag <p> inicial
      .replace(/<br\s*\/?>/g, '\n') // Substitui <br> por quebras de linha
      .replace(/<[^>]*>/g, ''); // Remove outras tags HTML
  };

  return (
    <div className="article-content space-y-6">
      {paragraphs.map((paragraph, index) => {
        const cleanedText = cleanInnerHTML(paragraph).trim();
        
        // Ignorar parágrafos vazios
        if (!cleanedText) return null;
        
        // Verificar se é um título (h1, h2, h3, etc)
        if (paragraph.includes('<h1')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{cleanInnerHTML(paragraph)}</h1>;
        } else if (paragraph.includes('<h2')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{cleanInnerHTML(paragraph)}</h2>;
        } else if (paragraph.includes('<h3')) {
          return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{cleanInnerHTML(paragraph)}</h3>;
        } else if (paragraph.includes('<h4')) {
          return <h4 key={index} className="text-lg font-bold mt-4 mb-2">{cleanInnerHTML(paragraph)}</h4>;
        } else if (paragraph.includes('<ul')) {
          // Para listas não ordenadas, implementar uma extração de itens
          const listItems = paragraph.split('<li>').slice(1).map(item => item.split('</li>')[0]);
          return (
            <ul key={index} className="list-disc pl-6 my-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{cleanInnerHTML(item)}</li>
              ))}
            </ul>
          );
        } else if (paragraph.includes('<ol')) {
          // Para listas ordenadas, implementar uma extração de itens
          const listItems = paragraph.split('<li>').slice(1).map(item => item.split('</li>')[0]);
          return (
            <ol key={index} className="list-decimal pl-6 my-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{cleanInnerHTML(item)}</li>
              ))}
            </ol>
          );
        } else if (paragraph.includes('<blockquote')) {
          return (
            <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">
              {cleanInnerHTML(paragraph)}
            </blockquote>
          );
        } else if (paragraph.includes('<img')) {
          // Extrai src e alt da tag img
          const srcMatch = paragraph.match(/src=["'](.*?)["']/);
          const altMatch = paragraph.match(/alt=["'](.*?)["']/);
          const src = srcMatch ? srcMatch[1] : '';
          const alt = altMatch ? altMatch[1] : '';
          
          return (
            <figure key={index} className="my-6">
              <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
              {paragraph.includes('<figcaption') && (
                <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                  {paragraph.match(/<figcaption[^>]*>(.*?)<\/figcaption>/)?.[1] || ''}
                </figcaption>
              )}
            </figure>
          );
        } else {
          // Parágrafo normal
          return <p key={index} className="text-gray-800 leading-relaxed">{cleanInnerHTML(paragraph)}</p>;
        }
      })}
    </div>
  );
}