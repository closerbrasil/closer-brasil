import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Noticia, Autor } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaLinkedinIn, FaGithub, FaGlobe, FaFacebookF } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSiteDomain } from "@/lib/seo";

export default function AuthorPage() {
  const [, params] = useRoute("/autor/:slug");
  const slug = params?.slug;

  const { data: autor, isLoading: isLoadingAutor, error: autorError } = useQuery<Autor>({
    queryKey: [`/api/autores/slug/${slug}`],
    enabled: !!slug
  });

  const { data: noticiasResponse, isLoading: isLoadingNoticias } = useQuery<{ noticias: Noticia[]; total: number }>({
    queryKey: [`/api/autores/${autor?.id}/noticias`],
    enabled: !!autor?.id
  });

  // Preparar dados para JSON-LD
  const generateAuthorJsonLd = (autor: Autor) => {
    const domain = getSiteDomain();
    return {
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

  return (
    <>
      <SEOHead
        title={`${autor.nome}${autor.cargo ? ` - ${autor.cargo}` : ''}`}
        description={autor.bio || `Artigos e publicações de ${autor.nome}`}
        type="profile"
        image={autor.avatarUrl}
        url={`${getSiteDomain()}/autor/${autor.slug}`}
        jsonLd={generateAuthorJsonLd(autor)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Perfil do Autor */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={autor.avatarUrl} alt={autor.nome} />
              <AvatarFallback className="text-3xl">{autor.nome ? autor.nome.substring(0, 2).toUpperCase() : 'AU'}</AvatarFallback>
            </Avatar>
            
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
                
                {autor.facebookUrl && (
                  <a
                    href={autor.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gray-600 hover:text-[#1877F2] transition-colors"
                  >
                    <FaFacebookF size={20} />
                  </a>
                )}
                
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
