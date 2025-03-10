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
    queryKey: [`/api/noticias/${noticiaId}/comentarios`],
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
      queryClient.invalidateQueries({ queryKey: [`/api/noticias/${noticiaId}/comentarios`] });
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
      {/* Lista de comentários */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {comentarios?.length ? `${comentarios.length} Comentário${comentarios.length !== 1 ? 's' : ''}` : 'Comentários'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comentarios?.length ? (
          <div className="divide-y divide-gray-100">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="py-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    {comentario.autorNome ? comentario.autorNome.substring(0, 1).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {comentario.autorNome || "Anônimo"}
                      </span>
                      <span className="text-xs text-gray-500">
                        há {formatDistanceToNow(new Date(comentario.criadoEm), { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comentario.conteudo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">Nenhum comentário ainda</p>
            <p className="text-gray-500 text-sm">Seja o primeiro a compartilhar seus pensamentos sobre este artigo</p>
          </div>
        )}
      </div>

      {/* Formulário de comentário */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Deixe seu comentário</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitComment({ ...data, noticiaId }))} className="space-y-5">
            <FormField
              control={form.control}
              name="autorNome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nome (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome (ou deixe em branco para comentar anonimamente)" 
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">Seu comentário</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva seu comentário aqui..." 
                      className="min-h-[120px] resize-y bg-gray-50 border-gray-200 focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : "Publicar comentário"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}