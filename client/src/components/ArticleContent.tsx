import React from 'react';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Vamos usar uma abordagem baseada em classes do Tailwind para formatar o conteúdo
  // em vez de manipular o HTML diretamente
  
  // Esta div vai conter o HTML com as classes prose do Tailwind para formatação
  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
      prose-p:my-4 prose-p:leading-relaxed prose-p:text-gray-800
      prose-img:rounded-lg prose-img:my-8
      prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
      prose-ul:my-4 prose-ol:my-4 prose-li:ml-4 prose-li:my-2"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}