import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertNoticiaSchema, insertCategoriaSchema, insertAutorSchema, insertComentarioSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Weather API endpoint
  app.get("/api/weather", async (_req, res) => {
    try {
      const city = encodeURIComponent('São Paulo');
      const country = 'BR';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}&lang=pt_br`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weather API error response:', errorData);
        throw new Error(`Weather API failed with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ message: "Erro ao buscar dados meteorológicos" });
    }
  });

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

  app.get("/api/noticias/:identificador", async (req, res) => {
    const identificador = req.params.identificador;

    // Verifica se o identificador é um UUID (formato de ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identificador);

    let noticia;
    if (isUUID) {
      // Se for UUID, busca por ID
      noticia = await storage.getNoticiaPorId(identificador);
    } else {
      // Senão, busca por slug
      noticia = await storage.getNoticiaPorSlug(identificador);
    }

    if (!noticia) {
      res.status(404).json({ message: "Notícia não encontrada" });
      return;
    }
    res.json(noticia);
  });

  // Comentários
  app.get("/api/noticias/:id/comentarios", async (req, res) => {
    const comentarios = await storage.getComentariosAprovados(req.params.id);
    res.json(comentarios);
  });

  app.post("/api/comentarios", async (req, res) => {
    try {
      const comentario = insertComentarioSchema.parse(req.body);
      const created = await storage.criarComentario(comentario);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados do comentário inválidos", errors: error.errors });
        return;
      }
      throw error;
    }
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