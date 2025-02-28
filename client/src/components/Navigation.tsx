import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">
            Closer Brasil
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {categories?.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {categories?.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="block py-2 text-gray-600 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}