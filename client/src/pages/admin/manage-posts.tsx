import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Eye, FileEdit, MoreVertical, Trash2, Loader2, PlusCircle } from "lucide-react";
import type { Noticia } from "@shared/schema";

export default function ManagePostsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const pageSize = 10;

  // Buscar artigos paginados
  const { data, isLoading } = useQuery<{ noticias: Noticia[], total: number }>({
    queryKey: ["/api/noticias", currentPage, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/noticias?page=${currentPage}&limit=${pageSize}`);
      if (!res.ok) throw new Error("Falha ao carregar notícias");
      return res.json();
    },
  });

  // Mutação para excluir artigo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/noticias/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro na exclusão:", errorText);
        throw new Error("Falha ao excluir notícia");
      }
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        // Se a resposta não for JSON, apenas retornamos um objeto de sucesso
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/noticias"] });
      toast({
        title: "Notícia excluída com sucesso",
        description: "A notícia foi removida permanentemente",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Erro na mutação:", error);
      toast({
        title: "Erro ao excluir notícia",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    },
  });

  // Manipuladores
  const handleDeleteClick = (id: string) => {
    setSelectedPostId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPostId) {
      deleteMutation.mutate(selectedPostId);
    }
  };

  // Calcular total de páginas
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  // Navegação de páginas
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <SEOHead
        title="Gerenciar Notícias | Admin"
        description="Gerenciamento de artigos e notícias do portal"
      />

      <AdminLayout title="Gerenciar Notícias">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-gray-500">
            Gerencie todas as publicações do portal de notícias
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/create-post" className="flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar Nova
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            {/* Tabela para desktop */}
            <div className="rounded-md border hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.noticias && data.noticias.length > 0 ? (
                    data.noticias.map((noticia) => (
                      <TableRow key={noticia.id}>
                        <TableCell className="font-medium">{noticia.titulo}</TableCell>
                        <TableCell>{"Categoria não disponível"}</TableCell>
                        <TableCell>{"Autor não disponível"}</TableCell>
                        <TableCell>
                          {new Date(noticia.publicadoEm).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="link" size="icon" asChild title="Visualizar">
                              <Link href={`/article/${noticia.slug}`} target="_blank">
                                <Eye className="h-4 w-4 text-black" />
                                <span className="sr-only">Visualizar</span>
                              </Link>
                            </Button>
                            <Button variant="link" size="icon" asChild title="Editar">
                              <Link href={`/admin/edit-post/${noticia.id}`}>
                                <FileEdit className="h-4 w-4 text-black" />
                                <span className="sr-only">Editar</span>
                              </Link>
                            </Button>
                            <Button 
                              variant="link" 
                              size="icon" 
                              onClick={() => handleDeleteClick(noticia.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        Nenhuma notícia encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Lista para mobile */}
            <div className="space-y-4 md:hidden">
              {data?.noticias && data.noticias.length > 0 ? (
                data.noticias.map((noticia) => (
                  <div key={noticia.id} className="bg-white rounded-lg border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate flex-1">{noticia.titulo}</h3>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Data: {new Date(noticia.publicadoEm).toLocaleDateString("pt-BR")}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="h-8 px-2 text-xs">
                          <Link href={`/article/${noticia.slug}`} target="_blank">
                            <Eye className="h-3 w-3 mr-1 text-black" />
                            Ver
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="h-8 px-2 text-xs">
                          <Link href={`/admin/edit-post/${noticia.id}`}>
                            <FileEdit className="h-3 w-3 mr-1 text-black" />
                            Editar
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteClick(noticia.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1 text-red-600" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 bg-white rounded-lg border p-4">
                  Nenhuma notícia encontrada
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex-1 md:flex-none max-w-[120px]"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-500 px-2 text-center">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex-1 md:flex-none max-w-[120px]"
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}

        {/* Diálogo de confirmação de exclusão */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
}