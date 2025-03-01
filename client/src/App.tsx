import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import Article from "@/pages/article";
import Category from "@/pages/category";
import Tag from "@/pages/tag";
import Author from "@/pages/author";
import About from "@/pages/about";
import Bookmarks from "@/pages/bookmarks";
import NotFound from "@/pages/not-found";
// Páginas administrativas
import AdminLogin from "@/pages/admin/login";
import AdminCreatePost from "@/pages/admin/create-post";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/noticia/:slug" component={Article} />
      <Route path="/categoria/:slug" component={Category} />
      <Route path="/tag/:slug" component={Tag} />
      <Route path="/author" component={Author} />
      <Route path="/about" component={About} />
      <Route path="/favoritos" component={Bookmarks} />
      {/* Rotas administrativas (não visíveis na navegação) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/criar-noticia" component={AdminCreatePost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-[#F8F8F8]">
          <Navigation />
          <main className="container mx-auto px-3 flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;