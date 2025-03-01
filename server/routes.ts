import type { Express } from "express";
import express from "express";  // Adicionado import do express
import { createServer } from "http";
import { storage } from "./storage";
import { insertNoticiaSchema, insertCategoriaSchema, insertAutorSchema, insertComentarioSchema, insertImagemSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadFile, getFile } from "./objectStorage";

// Configurar o multer para armazenar temporariamente os arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limite de 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos') as any);
    }
  }
});

export async function registerRoutes(app: Express) {
  // Rota de teste para o Object Storage
  app.get("/api/test-object-storage", async (_req, res) => {
    try {
      // Criar um arquivo SVG de teste simples - formato mais básico para compatibilidade máxima
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="blue" />
  <circle cx="100" cy="100" r="50" fill="red" />
  <text x="70" y="100" fill="white" font-size="20">Teste</text>
</svg>`;
      
      // Converter para buffer com encoding UTF-8
      const buffer = Buffer.from(svgContent, 'utf-8');
      
      // Fazer upload
      const result = await uploadFile(buffer, 'test.svg', 'image/svg+xml');
      
      // Gerar HTML com preview embutido para visualização direta
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Teste de Object Storage</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .success { color: green; font-weight: bold; }
            .preview { margin-top: 20px; border: 1px solid #ddd; padding: 10px; }
            img { max-width: 100%; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Teste de Object Storage</h2>
            <p class="success">✅ Arquivo criado com sucesso!</p>
            
            <h3>Informações:</h3>
            <pre>
URL: ${result.url}
Chave: ${result.key}
            </pre>
            
            <h3>Preview do SVG:</h3>
            <div class="preview">
              <img src="${result.url}" alt="SVG Test" />
            </div>
            
            <h3>Código SVG:</h3>
            <pre>${svgContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            
            <p><a href="${result.url}" target="_blank">Abrir em nova janela</a></p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("Erro no teste de Object Storage:", error);
      res.status(500).json({
        message: "Erro ao testar Object Storage",
        error: String(error)
      });
    }
  });
  const httpServer = createServer(app);

  // Endpoint para upload de imagem usando Object Storage
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      // Fazer upload para o Object Storage
      const result = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Retornar a URL pública da imagem
      res.json({ imageUrl: result.url });
    } catch (error) {
      console.error("Erro no upload de arquivo:", error);
      res.status(500).json({ message: "Erro ao processar o upload do arquivo" });
    }
  });

  // Endpoint para servir imagens do Object Storage
  app.get("/api/object-storage/:path(*)", async (req, res) => {
    try {
      const filePath = req.params.path;

      // Obter o arquivo do Object Storage
      const { data, contentType } = await getFile(filePath);

      // Definir o Content-Type e enviar o arquivo
      console.log("Enviando arquivo:", filePath);
      console.log("Content-Type:", contentType);
      console.log("Tamanho do arquivo:", data.length);
      
      // Tratamento especial para SVG para garantir que seja exibido corretamente
      if (contentType === 'image/svg+xml') {
        // Para SVG, devemos usar um encoding UTF-8 explícito para garantir a renderização correta
        res.set('Content-Type', 'image/svg+xml; charset=utf-8');
      } else {
        // Para outros tipos, usamos o contentType normalmente
        res.set('Content-Type', contentType);
      }
      
      // Desabilitar compression para garantir que os dados binários não sejam corrompidos
      res.set('Content-Encoding', 'identity');
      res.set('Cache-Control', 'public, max-age=31536000');
      res.set('Content-Length', data.length.toString());
      
      // Usar res.end em vez de res.send para dados binários
      res.end(data);
    } catch (error) {
      console.error("Erro ao recuperar arquivo:", error);
      res.status(404).json({ message: "Arquivo não encontrado" });
    }
  });

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