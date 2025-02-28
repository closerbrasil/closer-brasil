import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Categoria } from "@shared/schema";
import { Menu, Bookmark } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["/api/categorias"],
  });

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">
            Closer Brasil
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {categorias?.map((categoria) => (
              <Link 
                key={categoria.id} 
                href={`/categoria/${categoria.slug}`}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {categoria.nome}
              </Link>
            ))}

            {/* Favoritos link */}
            <Link 
              href="/favoritos"
              className="text-gray-600 hover:text-black transition-colors flex items-center"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Favoritos
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {categorias?.map((categoria) => (
              <Link 
                key={categoria.id} 
                href={`/categoria/${categoria.slug}`}
                className="block py-2 text-gray-600 hover:text-black transition-colors"
              >
                {categoria.nome}
              </Link>
            ))}

            {/* Favoritos link (mobile) */}
            <Link 
              href="/favoritos"
              className="flex items-center py-2 text-gray-600 hover:text-black transition-colors"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Favoritos
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}