import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Noticia, Autor } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaLinkedinIn, FaGithub, FaGlobe, FaFacebookF } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSiteDomain, generateBreadcrumbLD } from "@/lib/seo";
import { SEOBreadcrumb, BreadcrumbItemType } from "@/components/Breadcrumb";

export default function AuthorPage() {
  const [, params] = useRoute("/autor/:slug");
  const slug = params?.slug;

  const { data: autor, isLoading: isLoadingAutor, error: autorError } = useQuery<Autor>({
    queryKey: [`/api/autores/${slug}`],
    enabled: !!slug
  });

  const { data: noticiasResponse, isLoading: isLoadingNoticias } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: [`/api/autores/${autor?.slug}/noticias`],
    enabled: !!autor?.slug
  });

  // Preparar dados para JSON-LD
  const generateAuthorJsonLd = (autor: Autor) => {
    const domain = getSiteDomain();
    
    // Schema.org Person para o autor
    const authorPerson = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": autor.nome,
      "description": autor.bio || undefined,
      "jobTitle": autor.cargo || undefined,
      "url": `${domain}/autor/${autor.slug}`,
      "image": autor.avatarUrl || undefined,
      "sameAs": [
        // Incluir redes sociais quando disponíveis
        autor.twitterUrl || undefined,
        autor.linkedinUrl || undefined,
        autor.githubUrl || undefined,
        autor.websiteUrl || undefined
      ].filter(Boolean)
    };
    
    // Adicionar listagem de artigos como schema.org do tipo ProfilePage
    // conforme recomendações do Google para integração autor-conteúdo
    if (noticiasResponse && noticiasResponse.noticias.length > 0) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "headline": `Artigos de ${autor.nome}`,
        "description": `Confira todos os artigos escritos por ${autor.nome}${autor.cargo ? `, ${autor.cargo}` : ''}.`,
        "mainEntity": {
          "@type": "Person",
          "name": autor.nome,
          "url": `${domain}/autor/${autor.slug}`
        },
        "about": {
          "@type": "Person",
          "name": autor.nome
        }
      };
      
      // Retornar um array com ambos os esquemas
      return [authorPerson, articleSchema];
    }
    
    // Se não houver artigos, retornar apenas o schema da pessoa
    return authorPerson;
  };

  // Renderizar esqueletos de carregamento
  if (isLoadingAutor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start gap-6 mb-8">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        <Skeleton className="h-6 w-48 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
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

  // Renderizar erro
  if (autorError || !autor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Autor não encontrado</h2>
        <p className="text-gray-500 mb-8">O autor que você está procurando não está disponível ou foi removido.</p>
        <Button asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  // Preparar breadcrumb para a página de autor
  const breadcrumbItems: BreadcrumbItemType[] = [
    { name: 'Início', url: '/' },
    { name: 'Autores', url: '/autores' },
    { name: autor.nome }
  ];

  // Gerar JSON-LD para breadcrumb
  const breadcrumbLD = generateBreadcrumbLD(breadcrumbItems, window.location.href);
  
  // Combinar JSON-LD do autor com breadcrumb
  const authorLd = generateAuthorJsonLd(autor);
  const combinedJsonLd = Array.isArray(authorLd) 
    ? [...authorLd, breadcrumbLD] 
    : [authorLd, breadcrumbLD];

  return (
    <>
      <SEOHead
        title={`${autor.nome}${autor.cargo ? ` - ${autor.cargo}` : ''}`}
        description={autor.bio || `Artigos e publicações de ${autor.nome}`}
        type="profile"
        image={autor.avatarUrl}
        url={`${getSiteDomain()}/autor/${autor.slug}`}
        jsonLd={combinedJsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-10">
          <SEOBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Perfil do Autor */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="min-w-[128px] w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              {autor.avatarUrl ? (
                <img 
                  src={autor.avatarUrl} 
                  alt={autor.nome} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
                  {autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{autor.nome}</h1>
              {autor.cargo && <p className="text-gray-600 mb-4">{autor.cargo}</p>}
              {autor.bio && <p className="text-gray-800 mb-4">{autor.bio}</p>}
              
              {/* Links de Redes Sociais */}
              <div className="flex gap-4 flex-wrap">
                {autor.twitterUrl && (
                  <a
                    href={autor.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-gray-600 hover:text-[#1DA1F2] transition-colors"
                  >
                    <FaTwitter size={20} />
                  </a>
                )}
                
                {autor.linkedinUrl && (
                  <a
                    href={autor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-gray-600 hover:text-[#0077B5] transition-colors"
                  >
                    <FaLinkedinIn size={20} />
                  </a>
                )}
                
                {/* Facebook link não existe no esquema atual */}
                
                {autor.githubUrl && (
                  <a
                    href={autor.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                )}
                
                {autor.websiteUrl && (
                  <a
                    href={autor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website pessoal"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artigos do Autor */}
        <h2 className="text-2xl font-bold mb-6">Artigos Publicados</h2>
        
        {isLoadingNoticias ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : noticiasResponse && noticiasResponse.noticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noticiasResponse.noticias.map((noticia) => (
              <ArticleCard key={noticia.id} article={noticia} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Este autor ainda não publicou artigos.</p>
        )}
      </div>
    </>
  );
}
