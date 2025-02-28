import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string;
  role: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const MOCK_AUTHOR: Author = {
  id: 1,
  name: "João Silva",
  bio: "Editor-chefe e especialista em tecnologia com mais de 10 anos de experiência cobrindo inovação e transformação digital.",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
  role: "Editor-chefe",
  socialLinks: {
    twitter: "https://twitter.com/joaosilva",
    linkedin: "https://linkedin.com/in/joaosilva",
  }
};

export default function AuthorPage() {
  const { data: articles, isLoading: isLoadingArticles } = useQuery<{ articles: Article[]; total: number }>({
    queryKey: ["/api/articles", { authorId: MOCK_AUTHOR.id }],
  });

  return (
    <>
      <SEOHead
        title={`${MOCK_AUTHOR.name} - ${MOCK_AUTHOR.role}`}
        description={MOCK_AUTHOR.bio}
        type="profile"
      />

      <div className="max-w-4xl mx-auto">
        {/* Author Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={MOCK_AUTHOR.avatarUrl}
              alt={MOCK_AUTHOR.name}
              className="w-32 h-32 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{MOCK_AUTHOR.name}</h1>
              <p className="text-gray-600 mb-4">{MOCK_AUTHOR.role}</p>
              <p className="text-gray-800 mb-4">{MOCK_AUTHOR.bio}</p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {MOCK_AUTHOR.socialLinks.twitter && (
                  <a
                    href={MOCK_AUTHOR.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black"
                  >
                    Twitter
                  </a>
                )}
                {MOCK_AUTHOR.socialLinks.linkedin && (
                  <a
                    href={MOCK_AUTHOR.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <h2 className="text-2xl font-bold mb-6">Artigos Publicados</h2>
        
        {isLoadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles?.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
