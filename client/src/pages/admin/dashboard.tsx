import { FileText, Tag, Folder, Users, MessageSquare, Code } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "@/layouts/AdminLayout";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
}

function StatsCard({ title, value, icon, description, loading = false }: StatsCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex items-center">
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
          <div className="border rounded-lg p-4 bg-gray-50">
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
                    className="p-3 bg-white border border-gray-100 rounded-md flex justify-between items-center"
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

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
            <p className="text-gray-500">As estatísticas detalhadas estarão disponíveis em breve.</p>
          </div>
        </div>
        
        <div className="mt-8 border rounded-lg p-6 bg-gray-50">
          <div className="flex items-center mb-4">
            <Code className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-lg font-medium">Parâmetros da API</h3>
          </div>
          <p className="text-gray-500 mb-4">Utilize os modelos abaixo para fazer requisições à API. Clique em "Copiar modelo" para obter o JSON pronto para uso:</p>
          
          <div className="space-y-6">
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">POST /api/noticias</h4>
                <button 
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      titulo: "Título da Notícia",
                      slug: "titulo-da-noticia",
                      resumo: "Resumo ou descrição curta do conteúdo",
                      conteudo: "<p>Conteúdo completo da notícia em HTML</p>",
                      imageUrl: "/url/para/imagem-principal.jpg",
                      autorId: "id-do-autor",
                      categoriaId: "id-da-categoria",
                      status: "publicado", // publicado, rascunho
                      visibilidade: "publico", // publico, privado
                      // Campos opcionais
                      metaTitulo: "Título para SEO (opcional)",
                      metaDescricao: "Descrição para SEO (opcional)",
                      tempoLeitura: "5 min"
                    }, null, 2));
                    alert("Parâmetros copiados para área de transferência!");
                  }}
                >
                  Copiar modelo
                </button>
              </div>
              <pre className="text-green-400 text-xs overflow-x-auto">
{`{
  "titulo": "Título da Notícia",
  "slug": "titulo-da-noticia",
  "resumo": "Resumo ou descrição curta do conteúdo",
  "conteudo": "<p>Conteúdo completo da notícia em HTML</p>",
  "imageUrl": "/url/para/imagem-principal.jpg",
  "autorId": "id-do-autor",
  "categoriaId": "id-da-categoria",
  "status": "publicado", // publicado, rascunho
  "visibilidade": "publico", // publico, privado
  
  // Campos opcionais
  "metaTitulo": "Título para SEO (opcional)",
  "metaDescricao": "Descrição para SEO (opcional)",
  "tempoLeitura": "5 min"
}`}
              </pre>
            </div>

            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">PATCH /api/noticias/:id</h4>
                <button 
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      titulo: "Título Atualizado",
                      resumo: "Resumo atualizado",
                      status: "publicado"
                    }, null, 2));
                    alert("Parâmetros copiados para área de transferência!");
                  }}
                >
                  Copiar modelo
                </button>
              </div>
              <pre className="text-green-400 text-xs overflow-x-auto">
{`{
  "titulo": "Título Atualizado",
  "resumo": "Resumo atualizado",
  "status": "publicado"
  // Apenas inclua os campos que deseja atualizar
}`}
              </pre>
            </div>

            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">POST /api/autores</h4>
                <button 
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      nome: "Nome do Autor",
                      slug: "nome-do-autor",
                      bio: "Biografia do autor",
                      avatarUrl: "/url/para/avatar.jpg",
                      cargo: "Jornalista",
                      email: "autor@email.com"
                    }, null, 2));
                    alert("Parâmetros copiados para área de transferência!");
                  }}
                >
                  Copiar modelo
                </button>
              </div>
              <pre className="text-green-400 text-xs overflow-x-auto">
{`{
  "nome": "Nome do Autor",
  "slug": "nome-do-autor",
  "bio": "Biografia do autor",
  "avatarUrl": "/url/para/avatar.jpg",
  "cargo": "Jornalista",
  "email": "autor@email.com"
}`}
              </pre>
            </div>

            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">POST /api/categorias</h4>
                <button 
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      nome: "Nome da Categoria",
                      slug: "nome-da-categoria",
                      descricao: "Descrição da categoria"
                    }, null, 2));
                    alert("Parâmetros copiados para área de transferência!");
                  }}
                >
                  Copiar modelo
                </button>
              </div>
              <pre className="text-green-400 text-xs overflow-x-auto">
{`{
  "nome": "Nome da Categoria",
  "slug": "nome-da-categoria",
  "descricao": "Descrição da categoria"
}`}
              </pre>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}