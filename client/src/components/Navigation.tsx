import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

export default function Navigation() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-black font-merriweather">
              Closer Brasil
            </a>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {categories?.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <a className="text-gray-600 hover:text-black">
                  {category.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
