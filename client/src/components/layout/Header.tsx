import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Portal de Notícias</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 md:flex">
          <ul className="flex items-center gap-6">
            <li><Link href="/categoria/politica">Política</Link></li>
            <li><Link href="/categoria/economia">Economia</Link></li>
            <li><Link href="/categoria/esportes">Esportes</Link></li>
            <li><Link href="/categoria/entretenimento">Entretenimento</Link></li>
            <li><Link href="/categoria/tecnologia">Tecnologia</Link></li>
          </ul>
        </nav>

        {/* Search and Auth */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex">
            <Input
              type="search"
              placeholder="Pesquisar notícias..."
              className="w-[200px] lg:w-[300px]"
            />
          </div>
          <Button variant="ghost" size="sm">Entrar</Button>
          <Button>Cadastre-se</Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-16 z-50 w-full bg-background border-b md:hidden">
            <nav className="container py-4">
              <ul className="space-y-4">
                <li><Link href="/categoria/politica">Política</Link></li>
                <li><Link href="/categoria/economia">Economia</Link></li>
                <li><Link href="/categoria/esportes">Esportes</Link></li>
                <li><Link href="/categoria/entretenimento">Entretenimento</Link></li>
                <li><Link href="/categoria/tecnologia">Tecnologia</Link></li>
              </ul>
              <div className="mt-4">
                <Input
                  type="search"
                  placeholder="Pesquisar notícias..."
                  className="w-full"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
