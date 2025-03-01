import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  Folder, 
  Users, 
  MessageSquare, 
  PlusCircle,
  List
} from "lucide-react";

export default function AdminNavigation() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      name: "Artigos",
      path: "/admin/artigos",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      name: "Criar Artigo",
      path: "/admin/criar-noticia",
      icon: <PlusCircle className="h-5 w-5 mr-2" />,
    },
    {
      name: "Categorias",
      path: "/admin/categorias",
      icon: <Folder className="h-5 w-5 mr-2" />,
    },
    {
      name: "Tags",
      path: "/admin/tags",
      icon: <Tag className="h-5 w-5 mr-2" />,
    },
    {
      name: "Autores",
      path: "/admin/autores",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      name: "Comentários",
      path: "/admin/comentarios",
      icon: <MessageSquare className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive(item.path) ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}