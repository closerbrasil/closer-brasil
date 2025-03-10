import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Noticia, Tag } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Hash, TrendingUp } from "lucide-react";
import { getSiteDomain, generateBreadcrumbLD } from "@/lib/seo";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";

export default function TagPage() {
  const [, params] = useRoute("/tag/:slug");
  const slug = params?.slug;

  const { data: tag } = useQuery<Tag>({
    queryKey: [`/api/tags/${slug}`],
    enabled: !!slug
  });

  const { data: noticiasData, isLoading } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: [`/api/tags/${slug}/noticias`],
    enabled: !!slug
  });

  if (!slug) {
    return <div>Tag não encontrada</div>;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        {/* Skeleton para o cabeçalho */}
        <Skeleton className="h-12 w-3/4 mb-4 mt-8" />
        <Skeleton className="h-4 w-full mb-12" />
        
        {/* Skeleton para os cards de artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Gerar JSON-LD para a página da tag
  // Preparar breadcrumb para a página de tag
  const breadcrumbItems: BreadcrumbItemType[] = [
    { name: 'Início', url: '/' },
    { name: 'Tags', url: '/tags' },
    { name: tag?.nome || 'Tag' }
  ];
  
  // Gerar o JSON-LD para a trilha de navegação
  const breadcrumbLD = generateBreadcrumbLD(breadcrumbItems, window.location.href);

  // Gerar JSON-LD para a página da tag
  const tagJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": `Artigos sobre ${tag?.nome}`,
    "description": tag?.descricao || `Confira os últimos artigos e notícias relacionados a ${tag?.nome}.`,
    "url": `${getSiteDomain()}/tag/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": noticiasData?.noticias?.map((noticia, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${getSiteDomain()}/noticia/${noticia.slug}`,
        "name": noticia.titulo
      })) || []
    },
    "keywords": [tag?.nome || ""],
    "inLanguage": "pt-BR"
  };
  
  // Combinar os diferentes JSON-LD
  const combinedJsonLd = [tagJsonLd, breadcrumbLD];

  const totalNoticias = noticiasData?.total || 0;

  return (
    <>
      <SEOHead
        title={`${tag?.nome || "Tag"} - Artigos e Notícias`}
        description={tag?.descricao || `Confira os últimos artigos e notícias relacionados a ${tag?.nome}. Temos ${totalNoticias} publicações sobre este tema.`}
        type="website"
        keywords={[tag?.nome || "", "notícias", "artigos", "Brasil"]}
        jsonLd={combinedJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Cabeçalho da página */}
        <div className="mb-10 border-b pb-6">
          <div className="flex items-center mb-2">
            <Hash className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-3xl font-merriweather font-bold">
              {tag?.nome}
            </h1>
          </div>
          
          {tag?.descricao && (
            <p className="text-gray-600 mt-2 mb-4 text-lg">{tag.descricao}</p>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Newspaper className="h-4 w-4 mr-1" />
            <span>{totalNoticias} {totalNoticias === 1 ? 'artigo publicado' : 'artigos publicados'}</span>
          </div>
        </div>

        {/* Lista de artigos */}
        {noticiasData?.noticias && noticiasData.noticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticiasData.noticias.map((noticia) => (
              <ArticleCard key={noticia.id} article={noticia} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Nenhuma notícia encontrada com esta tag.</p>
            <Link href="/" className="text-primary hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
