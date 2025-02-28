import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Closer Brasil
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6">
            <li><Link href="/categoria/tecnologia">Tecnologia</Link></li>
            <li><Link href="/categoria/cultura">Cultura</Link></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-14 z-50 w-full bg-background border-b md:hidden">
            <nav className="container py-4">
              <ul className="space-y-4">
                <li><Link href="/categoria/tecnologia">Tecnologia</Link></li>
                <li><Link href="/categoria/cultura">Cultura</Link></li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};