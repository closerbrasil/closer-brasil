import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertNoticiaSchema, insertCategoriaSchema, insertAutorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Autores
  app.get("/api/autores", async (_req, res) => {
    const autores = await storage.getAutores();
    res.json(autores);
  });

  app.get("/api/autores/:slug", async (req, res) => {
    const autor = await storage.getAutorPorSlug(req.params.slug);
    if (!autor) {
      res.status(404).json({ message: "Autor não encontrado" });
      return;
    }
    res.json(autor);
  });

  app.post("/api/autores", async (req, res) => {
    try {
      const autor = insertAutorSchema.parse(req.body);
      const created = await storage.criarAutor(autor);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados do autor inválidos", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  app.get("/api/autores/:slug/noticias", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const noticias = await storage.getNoticiasPorAutor(req.params.slug, page, limit);
    res.json(noticias);
  });

  // Categorias
  app.get("/api/categorias", async (_req, res) => {
    const categorias = await storage.getCategorias();
    res.json(categorias);
  });

  app.post("/api/categorias", async (req, res) => {
    try {
      const categoria = insertCategoriaSchema.parse(req.body);
      const created = await storage.criarCategoria(categoria);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da categoria inválidos", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  // Notícias
  app.get("/api/noticias", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const noticias = await storage.getNoticias(page, limit);
    res.json(noticias);
  });

  app.get("/api/noticias/:slug", async (req, res) => {
    const noticia = await storage.getNoticiaPorSlug(req.params.slug);
    if (!noticia) {
      res.status(404).json({ message: "Notícia não encontrada" });
      return;
    }
    res.json(noticia);
  });

  app.get("/api/categorias/:slug/noticias", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const noticias = await storage.getNoticiasPorCategoria(req.params.slug, page, limit);
    res.json(noticias);
  });

  app.post("/api/noticias", async (req, res) => {
    try {
      const noticia = insertNoticiaSchema.parse(req.body);
      const created = await storage.criarNoticia(noticia);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da notícia inválidos", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  return httpServer;
}