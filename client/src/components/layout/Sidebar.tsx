import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WeatherWidget } from "@/components/WeatherWidget";
import type { Noticia } from "@shared/schema";

export const Sidebar = () => {
  const { data: trending } = useQuery<{ noticias: Noticia[] }>({
    queryKey: ["/api/noticias/trending"],
    select: (data) => ({ noticias: data?.slice(0, 5) ?? [] }),
  });

  return (
    <aside className="space-y-6">
      {/* Weather Widget */}
      <WeatherWidget />

      {/* Seção Mais Lidas */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4">Mais Lidas</h2>
        <div className="space-y-4">
          {trending?.noticias?.map((article, index) => (
            <div key={article.id} className="group">
              <Link href={`/noticia/${article.slug}`}>
                <div className="flex gap-3 items-start">
                  <span className="text-2xl font-bold text-muted-foreground/50">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {article.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.resumo}
                    </p>
                  </div>
                </div>
              </Link>
              {index < trending.noticias.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-2">Newsletter</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Receba as principais notícias diretamente no seu e-mail.
        </p>
        <form className="space-y-2">
          <Input
            type="email"
            placeholder="Seu e-mail"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Inscrever-se
          </Button>
        </form>
      </Card>
    </aside>
  );
};