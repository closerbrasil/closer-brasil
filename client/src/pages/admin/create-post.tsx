import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { TiptapEditor } from "@/components/TiptapEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Categoria, Autor, Tag as TagType } from "@shared/schema";
import { Loader2, Upload, X, PlusCircle, Tag as TagIcon } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { apiRequest } from "@/lib/queryClient";

// Estender o schema para adicionar validações específicas
const createPostSchema = insertNoticiaSchema
  .extend({
    titulo: z.string().min(5, "O título precisa ter pelo menos 5 caracteres"),
    resumo: z.string().min(10, "O resumo precisa ter pelo menos 10 caracteres"),
    conteudo: z.string().min(50, "O conteúdo precisa ter pelo menos 50 caracteres"),
    imageUrl: z.string().url("URL da imagem inválida"),
    categoriasIds: z.array(z.string()).optional(), // Array de IDs de categorias adicionais
  });

type FormValues = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [openTagsPopover, setOpenTagsPopover] = useState(false);
  const [createdNoticiaId, setCreatedNoticiaId] = useState<string | null>(null);

  // Buscar categorias para o select
  const { data: categorias, isLoading: loadingCategorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  // Buscar autores para o select
  const { data: autores, isLoading: loadingAutores } = useQuery<Autor[]>({
    queryKey: ["/api/autores"],
  });
  
  // Buscar tags disponíveis
  const { data: tags, isLoading: loadingTags } = useQuery<TagType[]>({
    queryKey: ["/api/tags"],
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
      categoriasIds: [],
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

  // Manipular o upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      setUploadedImage(data.imageUrl);
      form.setValue('imageUrl', data.imageUrl);
      toast({
        title: "Upload concluído",
        description: "A imagem foi carregada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar a imagem",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Abrir o diálogo de seleção de arquivo
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Enviar o formulário
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Enviar dados com categorias adicionais
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
      const noticiaId = data.id;
      
      // Adicionar tags selecionadas à notícia criada
      if (selectedTags.length > 0 && noticiaId) {
        await addTagsToNoticia(noticiaId);
      }

      // Resetar o formulário
      form.reset();
      setUploadedImage(null);
      setSelectedTags([]);

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

  // Funções para gerenciar tags
  const handleSelectTag = (tag: TagType) => {
    // Verifica se a tag já está selecionada
    const isAlreadySelected = selectedTags.some((t) => t.id === tag.id);
    if (!isAlreadySelected) {
      setSelectedTags([...selectedTags, tag]);
    }
    setOpenTagsPopover(false);
  };

  const handleRemoveTag = (tag: TagType) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  // Mutation para adicionar tag a uma notícia
  const addTagMutation = useMutation({
    mutationFn: async ({ noticiaId, tagId }: { noticiaId: string; tagId: string }) => {
      return apiRequest('POST', `/api/noticias/${noticiaId}/tags`, { tagId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/noticias'] });
    },
    onError: (error) => {
      console.error('Erro ao adicionar tag:', error);
      toast({
        title: 'Erro ao adicionar tag',
        description: 'Não foi possível adicionar a tag à notícia',
        variant: 'destructive',
      });
    },
  });

  // Adicionar as tags selecionadas à notícia após criação
  const addTagsToNoticia = async (noticiaId: string) => {
    if (selectedTags.length === 0) return;
    
    const promises = selectedTags.map((tag) => 
      addTagMutation.mutateAsync({ noticiaId, tagId: tag.id })
    );
    
    try {
      await Promise.all(promises);
      toast({
        title: 'Tags adicionadas',
        description: 'Todas as tags foram associadas à notícia',
      });
    } catch (error) {
      console.error('Erro ao adicionar tags:', error);
    }
  };

  const isLoading = loadingCategorias || loadingAutores || loadingTags;

  return (
    <>
      <SEOHead
        title="Painel Admin - Criar Notícia"
        description="Painel administrativo para criação de notícias"
      />

      <AdminLayout title="Criar Nova Notícia">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
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

                  {/* Upload de imagem */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <div className="space-y-4">
                          {/* Campo escondido para mostrar o valor atual */}
                          <Input 
                            type="hidden" 
                            {...field} 
                            value={field.value || ""}
                          />

                          {/* Preview da imagem */}
                          {uploadedImage && (
                            <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200">
                              <img 
                                src={uploadedImage.startsWith('http') ? uploadedImage : `${window.location.origin}${uploadedImage}`} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Componente de upload */}
                          <div className="flex items-center gap-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={triggerFileInput}
                              disabled={isUploading}
                              className="flex items-center gap-2"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Fazer upload
                                </>
                              )}
                            </Button>

                            <div className="flex-1">
                              <Input
                                type="text"
                                placeholder="Ou insira a URL da imagem diretamente"
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

                {/* Coluna direita */}
                <div className="space-y-6">
                  {/* Conteúdo - Editor TipTap */}
                  <FormField
                    control={form.control}
                    name="conteudo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <div className="min-h-[400px]">
                            <TiptapEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Escreva o conteúdo completo da notícia aqui..."
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Metadados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Categoria Principal */}
                    <FormField
                      control={form.control}
                      name="categoriaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria Principal</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria principal" />
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
                    
                    {/* Categorias Adicionais - Permitir múltiplas */}
                    <FormField
                      control={form.control}
                      name="categoriasIds"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Categorias Adicionais</FormLabel>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {field.value?.map((categoriaId) => {
                                const categoria = categorias?.find(c => c.id === categoriaId);
                                return categoria ? (
                                  <Badge key={categoria.id} className="mr-1 mb-1 flex items-center gap-1">
                                    {categoria.nome}
                                    <X
                                      className="h-3 w-3 cursor-pointer"
                                      onClick={() => {
                                        field.onChange(field.value?.filter(id => id !== categoriaId));
                                      }}
                                    />
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 h-8"
                                  type="button"
                                >
                                  <PlusCircle className="h-3.5 w-3.5" />
                                  Adicionar categorias
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Buscar categoria..." />
                                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                                  <CommandGroup>
                                    {categorias
                                      ?.filter(c => !field.value?.includes(c.id) && c.id !== form.getValues("categoriaId"))
                                      .map(categoria => (
                                        <CommandItem
                                          key={categoria.id}
                                          onSelect={() => {
                                            const currentValue = field.value || [];
                                            field.onChange([...currentValue, categoria.id]);
                                          }}
                                          className="flex items-center gap-2"
                                        >
                                          {categoria.nome}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <p className="text-sm text-muted-foreground">
                              Selecione múltiplas categorias para classificar seu artigo (ex: vídeo + esportes)
                            </p>
                          </div>
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
                    
                    {/* Tags */}
                    <div className="col-span-1 sm:col-span-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <FormLabel>Tags</FormLabel>
                          <Popover open={openTagsPopover} onOpenChange={setOpenTagsPopover}>
                            <PopoverTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-8 flex items-center gap-1"
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span>Adicionar Tag</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" side="right" align="start">
                              <Command>
                                <CommandInput placeholder="Buscar tag..." />
                                <CommandEmpty>Nenhuma tag encontrada</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-auto">
                                  {tags?.map((tag) => (
                                    <CommandItem
                                      key={tag.id}
                                      onSelect={() => handleSelectTag(tag)}
                                      className="flex items-center"
                                    >
                                      <TagIcon className="mr-2 h-4 w-4" />
                                      <span>{tag.nome}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 min-h-9 p-2 border rounded-md">
                          {selectedTags.length === 0 && (
                            <div className="text-muted-foreground text-sm flex items-center h-6">
                              Nenhuma tag selecionada
                            </div>
                          )}
                          
                          {selectedTags.map((tag) => (
                            <Badge 
                              key={tag.id} 
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1.5"
                            >
                              <TagIcon className="h-3 w-3" />
                              <span>{tag.nome}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remover tag</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6"
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
      </AdminLayout>
    </>
  );
}