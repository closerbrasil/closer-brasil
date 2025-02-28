import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Chave para armazenar bookmarks no localStorage
const BOOKMARK_STORAGE_KEY = 'closer-brasil:bookmarks';

// Recupera os bookmarks do localStorage
const getStoredBookmarks = (): string[] => {
  try {
    const stored = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao ler bookmarks do localStorage:', error);
    return [];
  }
};

// Salva os bookmarks no localStorage
const storeBookmarks = (bookmarks: string[]): void => {
  try {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Erro ao salvar bookmarks no localStorage:', error);
  }
};

// Hook personalizado para gerenciar bookmarks
export function useBookmarks() {
  const queryClient = useQueryClient();
  const bookmarksQueryKey = ['bookmarks'];

  // Consulta para obter bookmarks
  const { data: bookmarks = [] } = useQuery<string[]>({
    queryKey: bookmarksQueryKey,
    queryFn: getStoredBookmarks,
    // Não precisa refetch automático pois fazemos manualmente
    staleTime: Infinity,
  });

  // Verificar se um artigo está nos bookmarks
  const isBookmarked = useCallback(
    (articleId: string): boolean => {
      return bookmarks.includes(articleId);
    },
    [bookmarks]
  );

  // Adicionar ou remover um artigo dos bookmarks
  const toggleBookmark = useCallback(
    (articleId: string, articleTitle?: string) => {
      const updatedBookmarks = [...bookmarks];
      const index = updatedBookmarks.indexOf(articleId);
      
      if (index > -1) {
        // Remover dos bookmarks
        updatedBookmarks.splice(index, 1);
        toast({
          description: "Artigo removido dos favoritos",
          variant: "default",
        });
      } else {
        // Adicionar aos bookmarks
        updatedBookmarks.push(articleId);
        toast({
          title: "Artigo salvo!",
          description: articleTitle ? `"${articleTitle}" foi adicionado aos seus favoritos` : "Artigo adicionado aos seus favoritos",
          variant: "default",
        });
      }
      
      // Atualizar localStorage e invalidar query
      storeBookmarks(updatedBookmarks);
      queryClient.setQueryData(bookmarksQueryKey, updatedBookmarks);
      
      return updatedBookmarks;
    },
    [bookmarks, queryClient]
  );

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
