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
import NotFound from "@/pages/not-found";
// Páginas administrativas
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCreatePost from "@/pages/admin/create-post";
import AdminManagePosts from "@/pages/admin/manage-posts";
import AdminCategories from "@/pages/admin/categories";
import AdminTags from "@/pages/admin/tags";
import AdminAuthors from "@/pages/admin/authors";
import AdminComments from "@/pages/admin/comments";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/noticia/:slug" component={Article} />
      <Route path="/categoria/:slug" component={Category} />
      <Route path="/tag/:slug" component={Tag} />
      <Route path="/author" component={Author} />
      <Route path="/about" component={About} />
      {/* Rotas administrativas (não visíveis na navegação) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/create-post" component={AdminCreatePost} />
      <Route path="/admin/manage-posts" component={AdminManagePosts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/tags" component={AdminTags} />
      <Route path="/admin/authors" component={AdminAuthors} />
      <Route path="/admin/comments" component={AdminComments} />
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