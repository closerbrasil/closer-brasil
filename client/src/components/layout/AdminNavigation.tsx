import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileEdit,
  Home,
  Layers,
  MessageSquare,
  Tags,
  Users,
} from "lucide-react";

export default function AdminNavigation() {
  const [location] = useLocation();

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

  return (
    <nav className="space-y-1 bg-white shadow-sm rounded-lg p-4">
      {navigationItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className={cn("mr-3", isActive ? "text-primary" : "text-gray-500")}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}