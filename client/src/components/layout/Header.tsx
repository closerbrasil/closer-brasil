import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            Closer Brasil
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-8">
              <li>
                <Link href="/categoria/tecnologia" className="text-foreground/70 hover:text-foreground transition-colors">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/categoria/cultura" className="text-foreground/70 hover:text-foreground transition-colors">
                  Cultura
                </Link>
              </li>
              <li>
                <Link href="/categoria/negocios" className="text-foreground/70 hover:text-foreground transition-colors">
                  Negócios
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-16 z-50 w-full bg-background border-b md:hidden">
            <nav className="container py-4">
              <ul className="space-y-4">
                <li>
                  <Link href="/categoria/tecnologia" className="block text-foreground/70 hover:text-foreground transition-colors">
                    Tecnologia
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/cultura" className="block text-foreground/70 hover:text-foreground transition-colors">
                    Cultura
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/negocios" className="block text-foreground/70 hover:text-foreground transition-colors">
                    Negócios
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};