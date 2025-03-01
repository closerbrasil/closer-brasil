import { useEffect, useState } from "react";
import { useLocation } from "wouter";

// Token de segurança (deve corresponder ao token definido na página de login)
const ADMIN_TOKEN = "closerBrasilAdmin2025";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Verificar o token do localStorage
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(token === ADMIN_TOKEN);
  }, []);

  // Função para verificar e redirecionar se não autenticado
  const requireAuth = () => {
    if (isAuthenticated === false) {
      navigate("/admin/login");
    }
    return isAuthenticated;
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  return { isAuthenticated, requireAuth, logout };
}
