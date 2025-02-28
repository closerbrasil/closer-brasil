import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { insertComentarioSchema } from "@shared/schema";
import type { Comentario, InsertComentario } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CommentsProps {
  noticiaId: string;
}

export function Comments({ noticiaId }: CommentsProps) {
  const { toast } = useToast();

  const { data: comentarios, isLoading } = useQuery<Comentario[]>({
    queryKey: ["/api/noticias", noticiaId, "comentarios"],
    enabled: !!noticiaId
  });

  const form = useForm<InsertComentario>({
    resolver: zodResolver(insertComentarioSchema),
    defaultValues: {
      noticiaId,
      conteudo: "",
      autorNome: "",
    },
  });

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: async (data: InsertComentario) => {
      const response = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao enviar comentário");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/noticias", noticiaId, "comentarios"] });
      form.reset();
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi publicado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu comentário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Comentários</h2>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Carregando comentários...</p>
        ) : comentarios?.length ? (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {comentario.autorNome || "Anônimo"}
                </span>
                <span className="text-sm text-muted-foreground">
                  há {formatDistanceToNow(new Date(comentario.criadoEm), { locale: ptBR })}
                </span>
              </div>
              <p className="text-gray-700">{comentario.conteudo}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
      </div>

      {/* Formulário de comentário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => submitComment(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="autorNome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome (ou deixe em branco para comentar anonimamente)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conteudo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentário</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Escreva seu comentário aqui..." 
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar comentário"}
          </Button>
        </form>
      </Form>
    </div>
  );
}