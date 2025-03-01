import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/layouts/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import type { Noticia, Categoria, Autor, Tag } from "@shared/schema";

// Schema para o formulário de edição
const editPostSchema = z.object({
  titulo: z.string().min(5, "O título precisa ter pelo menos 5 caracteres"),
  slug: z.string().min(5, "O slug precisa ter pelo menos 5 caracteres"),
  resumo: z.string().min(10, "O resumo precisa ter pelo menos 10 caracteres"),
  conteudo: z.string().min(10, "O conteúdo precisa ter pelo menos 10 caracteres"),
  imageUrl: z.string().optional(),
  autorId: z.string().uuid("Selecione um autor válido"),
  categoriaId: z.string().uuid("Selecione uma categoria válida"),
  status: z.enum(["rascunho", "publicado", "agendado"]),
  visibilidade: z.enum(["publico", "assinantes", "privado"]),
  schemaType: z.enum(["Article", "NewsArticle", "BlogPosting"]),
  tempoLeitura: z.string().optional(),
});

type FormValues = z.infer<typeof editPostSchema>;

export default function EditPostPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/edit-post/:id");
  const postId = params?.id || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar o artigo para edição
  const { data: noticia, isLoading: loadingNoticia } = useQuery<Noticia>({
    queryKey: [`/api/noticias/${postId}`],
    enabled: !!postId,
    retry: false,
    gcTime: 0,
    staleTime: 0,
    onSuccess: () => {},
    select: (data) => data as Noticia
  });

  // Buscar categorias para o select
  const { data: categorias, isLoading: loadingCategorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  // Buscar autores para o select
  const { data: autores, isLoading: loadingAutores } = useQuery<Autor[]>({
    queryKey: ["/api/autores"],
  });

  // Buscar tags associadas à notícia
  const { data: tags } = useQuery<Tag[]>({
    queryKey: [`/api/noticias/${postId}/tags`],
    enabled: !!postId,
  });

  // Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(editPostSchema),
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

  // Atualizar valores do formulário quando a notícia é carregada
  useEffect(() => {
    if (noticia) {
      form.reset({
        titulo: noticia.titulo,
        slug: noticia.slug,
        resumo: noticia.resumo || "",
        conteudo: noticia.conteudo,
        imageUrl: noticia.imageUrl || "",
        autorId: noticia.autorId,
        categoriaId: noticia.categoriaId,
        status: noticia.status as "rascunho" | "publicado" | "agendado", 
        visibilidade: noticia.visibilidade as "publico" | "assinantes" | "privado",
        schemaType: noticia.schemaType as "Article" | "NewsArticle" | "BlogPosting",
        tempoLeitura: noticia.tempoLeitura || "5 min",
      });
      
      if (noticia.imageUrl) {
        setUploadedImage(noticia.imageUrl);
      }
    }
  }, [noticia, form]);

  // Gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // Mutação para atualizar a notícia
  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch(`/api/noticias/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Falha ao atualizar notícia");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/noticias"] });
      queryClient.invalidateQueries({ queryKey: [`/api/noticias/${postId}`] });
      
      toast({
        title: "Sucesso",
        description: "Notícia atualizada com sucesso",
      });
      
      // Redirecionar para a lista de artigos
      navigate("/admin/manage-posts");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    }
  });

  // Upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Falha ao fazer upload da imagem');
      }
      
      const data = await res.json();
      setUploadedImage(data.imageUrl);
      form.setValue('imageUrl', data.imageUrl);
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao fazer upload da imagem',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Atualizar o slug quando o título mudar
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const currentSlug = form.getValues('slug');
    
    // Só atualiza o slug automaticamente se estiver vazio ou se o usuário não o tiver editado manualmente
    if (!currentSlug || currentSlug === generateSlug(form.getValues('titulo'))) {
      form.setValue('slug', generateSlug(title));
    }
  };

  // Submeter o formulário
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    updateMutation.mutate(values);
  };

  // Verificar se está carregando dados iniciais
  const isLoading = loadingNoticia || loadingCategorias || loadingAutores;

  if (isLoading) {
    return (
      <AdminLayout title="Editar Notícia">
        <div className="space-y-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="Editar Notícia | Admin"
        description="Edite um artigo existente no portal de notícias"
      />

      <AdminLayout title="Editar Notícia">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
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
                        <Input placeholder="url-amigavel" {...field} />
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
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Imagem */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem da Notícia</FormLabel>
                      <div className="space-y-4">
                        <Input
                          type="hidden"
                          {...field}
                        />

                        {/* Preview da imagem */}
                        {uploadedImage && (
                          <div className="rounded-md overflow-hidden border border-gray-200 w-full max-w-md">
                            <img
                              src={uploadedImage}
                              alt="Preview"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}

                        {/* Campo de upload */}
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={triggerFileInput}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Fazer upload
                              </>
                            )}
                          </Button>

                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="Ou insira a URL da imagem"
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setUploadedImage(e.target.value);
                              }}
                            />
                          </div>

                          {/* Input file escondido */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                {/* Autor */}
                <FormField
                  control={form.control}
                  name="autorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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

                {/* Categoria */}
                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                          <SelectItem value="publicado">Publicado</SelectItem>
                          <SelectItem value="agendado">Agendado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visibilidade */}
                <FormField
                  control={form.control}
                  name="visibilidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibilidade</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a visibilidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="publico">Público</SelectItem>
                          <SelectItem value="assinantes">Assinantes</SelectItem>
                          <SelectItem value="privado">Privado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Schema */}
                <FormField
                  control={form.control}
                  name="schemaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Schema</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de schema" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Article">Article</SelectItem>
                          <SelectItem value="NewsArticle">NewsArticle</SelectItem>
                          <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tempo de Leitura */}
                <FormField
                  control={form.control}
                  name="tempoLeitura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Leitura</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5 min" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Conteúdo */}
            <FormField
              control={form.control}
              name="conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conteúdo da notícia"
                      className="h-64 font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/manage-posts")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AdminLayout>
    </>
  );
}