import { FileText, Tag, Folder, Users, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
}

function StatsCard({ title, value, icon, description, loading = false }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-1" />
        ) : (
          <>
            <p className="text-2xl font-bold">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // Adicionando tipagem específica para os dados da API
  interface NoticiasResponse {
    noticias: Array<{
      id: string;
      titulo: string;
      publicadoEm: string;
      // Outros campos podem ser adicionados conforme necessário
    }>;
    total: number;
  }

  const { data: noticias, isLoading: noticiasLoading } = useQuery<NoticiasResponse>({
    queryKey: ["/api/noticias"],
  });

  const { data: categorias, isLoading: categoriasLoading } = useQuery<Array<any>>({
    queryKey: ["/api/categorias"],
  });

  return (
    <>
      <SEOHead
        title="Dashboard Admin | Portal de Notícias"
        description="Painel de controle administrativo do portal de notícias"
      />
      
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Artigos"
            value={noticiasLoading ? "0" : (noticias?.noticias ?? []).length}
            icon={<FileText className="h-6 w-6 text-primary" />}
            loading={noticiasLoading}
          />
          
          <StatsCard
            title="Categorias"
            value={categoriasLoading ? "0" : (categorias ?? []).length}
            icon={<Folder className="h-6 w-6 text-primary" />}
            loading={categoriasLoading}
          />
          
          <StatsCard
            title="Tags"
            value="--"
            icon={<Tag className="h-6 w-6 text-primary" />}
            loading={true}
          />
          
          <StatsCard
            title="Comentários"
            value="--"
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
            loading={true}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Artigos Recentes</h3>
            {noticiasLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {(noticias?.noticias ?? []).slice(0, 5).map((noticia) => (
                  <div 
                    key={noticia.id} 
                    className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                  >
                    <span className="font-medium truncate max-w-[70%]">{noticia.titulo}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(noticia.publicadoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
                {(noticias?.noticias ?? []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhuma notícia encontrada</p>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
            <p className="text-gray-500">As estatísticas detalhadas estarão disponíveis em breve.</p>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}