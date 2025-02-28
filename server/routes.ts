import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Categories
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const category = insertCategorySchema.parse(req.body);
      const created = await storage.createCategory(category);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data" });
        return;
      }
      throw error;
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const articles = await storage.getArticles(page, limit);
    res.json(articles);
  });

  app.get("/api/articles/:slug", async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    res.json(article);
  });

  app.get("/api/categories/:slug/articles", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const articles = await storage.getArticlesByCategory(req.params.slug, page, limit);
    res.json(articles);
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const article = insertArticleSchema.parse(req.body);
      const created = await storage.createArticle(article);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data" });
        return;
      }
      throw error;
    }
  });

  return httpServer;
}
