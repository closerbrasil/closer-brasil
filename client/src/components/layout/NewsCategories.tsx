import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Categoria } from "@shared/schema";

export const NewsCategories = () => {
  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  if (!categorias?.length) return null;

  return (
    <section className="container py-6">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/categoria/${categoria.slug}`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted-foreground/10"
            >
              {categoria.nome}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
