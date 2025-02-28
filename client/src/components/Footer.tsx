import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-black">
                  Nossa Equipe
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categoria/tecnologia" className="text-gray-600 hover:text-black">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/categoria/cultura" className="text-gray-600 hover:text-black">
                  Cultura
                </Link>
              </li>
              <li>
                <Link href="/categoria/negocios" className="text-gray-600 hover:text-black">
                  Negócios
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-black">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-black">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/closerbrasil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com/closerbrasil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/closerbrasil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>© {currentYear} Closer Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}