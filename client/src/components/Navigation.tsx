import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Categoria } from "@shared/schema";
import { Film } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  // Prevenir scroll quando o menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">
            Closer Brasil
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Link destacado para a seção de vídeos */}
            <Link 
              href="/videos"
              className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <Film className="h-4 w-4 mr-1" />
              Vídeos
            </Link>
            
            {/* Links para categorias */}
            {categorias?.map((categoria) => (
              <Link 
                key={categoria.id} 
                href={`/categoria/${categoria.slug}`}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {categoria.nome}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu - fixo na tela quando aberto */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black z-40 overflow-y-auto pt-4 px-4">
            <div className="container mx-auto">
              {/* Link para vídeos no menu móvel */}
              <Link 
                href="/videos"
                className="flex items-center py-3 text-white font-medium border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Film className="h-5 w-5 mr-2" />
                Vídeos
              </Link>
              
              {/* Categorias no menu móvel */}
              {categorias?.map((categoria) => (
                <Link 
                  key={categoria.id} 
                  href={`/categoria/${categoria.slug}`}
                  className="block py-3 text-white hover:text-gray-300 transition-colors border-b border-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {categoria.nome}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}