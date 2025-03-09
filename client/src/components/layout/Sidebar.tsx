import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Noticia } from "@shared/schema";
import { Loader2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
  name: z.string().min(2, "Por favor, insira seu nome"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export const Sidebar = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { data: trending } = useQuery<Noticia[]>({
    queryKey: ["/api/noticias/trending"],
    select: (data) => data?.slice(0, 5) ?? [],
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulação de chamada de API com um pequeno atraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sucesso
      toast({
        title: "Inscrição realizada!",
        description: `Olá ${data.name}, você receberá nossas newsletters no e-mail cadastrado.`,
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      // Erro
      toast({
        title: "Erro ao enviar inscrição",
        description: "Não foi possível processar sua inscrição. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Weather Widget */}
      <WeatherWidget />

      {/* Mais Lidas */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Mais Lidas</h2>
        {trending?.length ? (
          <div className="space-y-6">
            {trending.map((article: Noticia, index: number) => (
              <div key={article.id} className="group">
                <Link href={`/noticia/${article.slug}`}>
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-muted-foreground/50 shrink-0">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {article.titulo}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {article.resumo}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < trending.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Carregando artigos mais lidos...
          </p>
        )}
      </Card>

      {/* Newsletter */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-2">Newsletter</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Receba as principais notícias de tecnologia, cultura e negócios diretamente no seu e-mail.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Inscrever-se"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-3 text-xs text-muted-foreground">
          Ao se inscrever, você concorda em receber nossas newsletters. 
          Você pode cancelar a qualquer momento.
          Consulte nossa <Link href="/politica-privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </Card>
    </aside>
  );
};