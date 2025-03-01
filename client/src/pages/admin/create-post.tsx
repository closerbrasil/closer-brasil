import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertNoticiaSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Categoria, Autor } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useLocation } from "wouter";

// Estender o schema para adicionar validações específicas
const createPostSchema = insertNoticiaSchema
  .extend({
    titulo: z.string().min(5, "O título precisa ter pelo menos 5 caracteres"),
    resumo: z.string().min(10, "O resumo precisa ter pelo menos 10 caracteres"),
    conteudo: z.string().min(50, "O conteúdo precisa ter pelo menos 50 caracteres"),
    imageUrl: z.string().url("URL da imagem inválida"),
  });

type FormValues = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, requireAuth } = useAdminAuth();
  const [, navigate] = useLocation();

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated === false) {
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate]);

  // Buscar categorias para o select
  const { data: categorias, isLoading: loadingCategorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  // Buscar autores para o select
  const { data: autores, isLoading: loadingAutores } = useQuery<Autor[]>({
    queryKey: ["/api/autores"],
  });

  // Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      titulo: "",
      slug: "",
      resumo: "",
      conteudo: "",
      imageUrl: "",
      autorId: "",
      categoriaId: "",
      status: "publicado",
      visibilidade: "publico",
      schemaType: "Article",
      tempoLeitura: "5 min",
    },
  });

  // Gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // Atualizar o slug quando o título mudar
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("slug", generateSlug(title));
  };

  // Enviar o formulário
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/noticias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar notícia");
      }

      const data = await response.json();

      // Resetar o formulário
      form.reset();

      // Invalidar cache para atualizar listas de notícias
      queryClient.invalidateQueries({ queryKey: ["/api/noticias"] });

      toast({
        title: "Notícia criada com sucesso!",
        description: `A notícia "${values.titulo}" foi publicada.`,
      });
    } catch (error) {
      console.error("Erro ao criar notícia:", error);
      toast({
        title: "Erro ao criar notícia",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar carregamento enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLoading = loadingCategorias || loadingAutores;

  return (
    <>
      <SEOHead
        title="Painel Admin - Criar Notícia"
        description="Painel administrativo para criação de notícias"
      />

      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-8">Criar Nova Notícia</h1>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Título da notícia" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          onTitleChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-amigavel-da-noticia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resumo */}
              <FormField
                control={form.control}
                name="resumo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Breve resumo da notícia" 
                        className="h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conteúdo */}
              <FormField
                control={form.control}
                name="conteudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conteúdo completo da notícia em formato HTML" 
                        className="h-64 font-mono text-sm" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL da imagem */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias?.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Autor */}
              <FormField
                control={form.control}
                name="autorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um autor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {autores?.map((autor) => (
                          <SelectItem key={autor.id} value={autor.id}>
                            {autor.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tempo de leitura */}
              <FormField
                control={form.control}
                name="tempoLeitura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de leitura</FormLabel>
                    <FormControl>
                      <Input placeholder="5 min" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Publicar Notícia"
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </>
  );
}