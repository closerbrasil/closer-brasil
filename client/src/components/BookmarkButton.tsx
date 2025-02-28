import { Bookmark, BookmarkMinus } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BookmarkButtonProps {
  articleId: string;
  articleTitle?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BookmarkButton({
  articleId,
  articleTitle,
  className,
  size = "md",
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const saved = isBookmarked(articleId);
  
  const handleToggleBookmark = () => {
    // Iniciar animação
    setIsAnimating(true);
    
    // Parar animação após completar
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    // Alternar estado do bookmark
    toggleBookmark(articleId, articleTitle);
  };
  
  // Determinar tamanho do ícone com base no prop size
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleBookmark}
            className={cn(
              "relative transition-all hover:bg-muted",
              isAnimating && "scale-125",
              saved && "text-primary",
              className
            )}
            aria-label={saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {saved ? (
              <BookmarkMinus size={iconSize} className="transition-transform" />
            ) : (
              <Bookmark size={iconSize} className="transition-transform" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
