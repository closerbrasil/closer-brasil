import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Cog, 
  FileEdit, 
  Home, 
  Layers, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Tags,
  User, 
  Users,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, logout } = useAdminAuth();
  const [location, navigate] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Verificar preferência do usuário em desktop
    const savedState = localStorage.getItem("admin-sidebar-collapsed");
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true");
    }
    
    // Redirecionar para a página de login se não estiver autenticado
    if (isAuthenticated === false) {
      navigate("/admin/login");
    }

    // Fechar sidebar móvel quando a janela é redimensionada para desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthenticated, navigate, mobileSidebarOpen]);

  // Salvar preferência de estado da barra lateral
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("admin-sidebar-collapsed", String(newState));
  };

  // Toggle sidebar móvel
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Itens da navegação administrativa
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Criar Notícia",
      href: "/admin/create-post",
      icon: <FileEdit className="h-5 w-5" />,
    },
    {
      name: "Gerenciar Notícias",
      href: "/admin/manage-posts",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Categorias",
      href: "/admin/categories",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: <Tags className="h-5 w-5" />,
    },
    {
      name: "Autores",
      href: "/admin/authors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Comentários",
      href: "/admin/comments",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  // Mostrar carregamento enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Não mostrar nada se não estiver autenticado (redirecionamento ocorrerá no useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Barra lateral para desktop (oculta em mobile) */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 flex-col transition-all duration-300 hidden md:flex",
          sidebarCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        {/* Cabeçalho da barra lateral desktop */}
        <div className={cn(
            "h-16 px-4 flex items-center border-b border-gray-200",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!sidebarCollapsed && (
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              Admin
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navegação desktop */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <TooltipProvider disableHoverableContent={!sidebarCollapsed}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-100",
                            sidebarCollapsed && "justify-center"
                          )}
                        >
                          <span className={cn("", isActive ? "text-primary" : "text-gray-500")}>
                            {item.icon}
                          </span>
                          {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              );
            })}
          </ul>

          <Separator className="my-4" />

          {/* Navegação de sistema desktop */}
          <ul className="space-y-1 px-2">
            <li>
              <TooltipProvider disableHoverableContent={!sidebarCollapsed}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
                        sidebarCollapsed && "justify-center"
                      )}
                      target="_blank"
                    >
                      <span className="text-gray-500">
                        <User className="h-5 w-5" />
                      </span>
                      {!sidebarCollapsed && <span className="ml-3">Visualizar Site</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Visualizar Site
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
            <li>
              <TooltipProvider disableHoverableContent={!sidebarCollapsed}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={logout}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors",
                        sidebarCollapsed && "justify-center"
                      )}
                    >
                      <LogOut className="h-5 w-5" />
                      {!sidebarCollapsed && <span className="ml-3">Sair</span>}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Sair
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Barra lateral móvel (overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay escuro */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={toggleMobileSidebar}
            aria-hidden="true"
          />
          
          {/* Barra lateral móvel */}
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-lg flex flex-col overflow-y-auto">
            <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-800">Admin</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 py-4">
              <ul className="space-y-1 px-2">
                {navigationItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <span className={cn("", isActive ? "text-primary" : "text-gray-500")}>
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Separator className="my-4" />

              <ul className="space-y-1 px-2">
                <li>
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    target="_blank"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <span className="text-gray-500">
                      <User className="h-5 w-5" />
                    </span>
                    <span className="ml-3">Visualizar Site</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Sair</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <header className="h-16 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 h-full flex items-center justify-between">
            <div className="flex items-center">
              {/* Botão de menu para mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileSidebar}
                className="md:hidden mr-2 text-gray-500"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Cog className="h-5 w-5" />
                    <span className="hidden sm:inline">Configurações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Administrador</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open("/", "_blank")}>
                    Ver site
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Área de conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}