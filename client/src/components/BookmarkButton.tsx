import { Bookmark } from "lucide-react";
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
              "relative transition-all p-0 bg-transparent hover:bg-transparent text-black",
              isAnimating && "scale-110",
              "absolute -top-2 right-2",
              className
            )}
            aria-label={saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Bookmark 
              size={iconSize} 
              className="transition-transform"
              fill={saved ? "white" : "transparent"} 
              stroke="currentColor"
              strokeWidth={2}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}