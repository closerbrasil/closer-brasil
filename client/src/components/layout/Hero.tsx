import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Noticia } from "@shared/schema";

export const Hero = () => {
  const { data: noticiaPrincipal, isLoading } = useQuery({
    queryKey: ["/api/noticias/destaque"],
    select: (data: { noticias: Noticia[] }) => data.noticias[0],
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!noticiaPrincipal) return null;

  return (
    <section className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg lg:aspect-square">
          <img
            src={noticiaPrincipal.imageUrl}
            alt={noticiaPrincipal.titulo}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <Link href={`/noticia/${noticiaPrincipal.slug}`}>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              {noticiaPrincipal.titulo}
            </h1>
          </Link>
          <p className="text-lg text-muted-foreground line-clamp-3 md:line-clamp-4 lg:line-clamp-6">
            {noticiaPrincipal.resumo}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={noticiaPrincipal.publicadoEm}>
              {new Date(noticiaPrincipal.publicadoEm).toLocaleDateString('pt-BR')}
            </time>
            <span>•</span>
            <span>{noticiaPrincipal.tempoLeitura}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
