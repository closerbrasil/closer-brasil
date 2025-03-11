import type { Express } from "express";
import express from "express";  // Adicionado import do express
import { createServer } from "http";
import { storage } from "./storage";
import { insertNoticiaSchema, insertCategoriaSchema, insertAutorSchema, insertComentarioSchema, insertImagemSchema, insertTagSchema, insertVideoSchema, InsertTag, InsertNoticia, InsertVideo } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadFile, getFile, downloadAndSaveImage } from "./blobStorage";

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
  // Rota para verificar a configuração de domínio
  app.get("/api/config/domain", (_req, res) => {
    const siteDomain = process.env.SITE_DOMAIN || "Não configurado";
    
    // Determinar o domínio que está sendo usado atualmente
    function getBaseUrl(): string {
      // Verificar se existe uma variável de ambiente configurada para o domínio
      if (process.env.SITE_DOMAIN) {
        // Remover qualquer barra no final da URL para evitar dupla barra
        return process.env.SITE_DOMAIN.replace(/\/+$/, '');
      }
      
      // Em desenvolvimento local, usar localhost
      const port = process.env.PORT || 3000;
      return `http://localhost:${port}`;
    }
    
    res.json({
      configuredDomain: siteDomain,
      activeBaseUrl: getBaseUrl(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  // Rota de teste para o Object Storage - PNG
  app.get("/api/test-object-storage-png", async (_req, res) => {
    try {
      // Criar uma imagem PNG simples (1x1 pixel preto)
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00, 
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 
        0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00, 
        0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      
      // Fazer upload
      const result = await uploadFile(pngBuffer, 'test.png', 'image/png');
      
      // Gerar HTML com preview para visualização
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Teste de Object Storage - PNG</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .success { color: green; font-weight: bold; }
            .preview { margin-top: 20px; border: 1px solid #ddd; padding: 10px; }
            img { max-width: 100%; border: 1px solid #000; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Teste de Object Storage - PNG</h2>
            <p class="success">✅ Arquivo PNG criado com sucesso!</p>
            
            <h3>Informações:</h3>
            <pre>
URL: ${result.url}
Chave: ${result.key}
Tipo: image/png
Tamanho: ${pngBuffer.length} bytes
            </pre>
            
            <h3>Preview do PNG (pixel 1x1):</h3>
            <div class="preview">
              <img src="${result.url}" alt="PNG Test" width="50" height="50" />
            </div>
            
            <p><a href="${result.url}" target="_blank">Abrir em nova janela</a></p>
            <p><a href="/api/test-object-storage">Testar SVG</a></p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("Erro no teste de Object Storage com PNG:", error);
      res.status(500).json({
        message: "Erro ao testar Object Storage com PNG",
        error: String(error)
      });
    }
  });

  // Rota de teste para o Object Storage - SVG
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
            <p><a href="/api/test-object-storage-png">Testar PNG</a></p>
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

  // Rota de teste para o Vercel Blob Storage (adicionar próximo às outras rotas de API)
  app.get("/api/test-blob", async (_req, res) => {
    try {
      // Criar um buffer de teste
      const buffer = Buffer.from("Teste de upload para o Vercel Blob");
      
      // Fazer upload do buffer
      const result = await uploadFile(buffer, "test.txt", "text/plain");
      
      res.json({
        success: true,
        message: "Upload para o Vercel Blob Storage realizado com sucesso",
        result
      });
    } catch (error) {
      console.error("Erro ao testar o Vercel Blob Storage:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao testar o Vercel Blob Storage",
        error: error instanceof Error ? error.message : 'Erro desconhecido'
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

  app.get("/api/autores/:identificador", async (req, res) => {
    const identificador = req.params.identificador;
    
    // Verifica se o identificador é um UUID (formato de ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identificador);
    
    let autor;
    if (isUUID) {
      // Se for UUID, busca por ID
      autor = await storage.getAutorPorId(identificador);
    } else {
      // Senão, busca por slug
      autor = await storage.getAutorPorSlug(identificador);
    }
    
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
  
  app.get("/api/categorias/:identificador", async (req, res) => {
    const identificador = req.params.identificador;
    
    // Verifica se o identificador é um UUID (formato de ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identificador);
    
    let categoria;
    if (isUUID) {
      // Se for UUID, busca por ID
      categoria = await storage.getCategoriaPorId(identificador);
    } else {
      // Senão, busca por slug
      categoria = await storage.getCategoriaPorSlug(identificador);
    }
    
    if (!categoria) {
      res.status(404).json({ message: "Categoria não encontrada" });
      return;
    }
    res.json(categoria);
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
  // Notícia em destaque (para o Hero)
  app.get("/api/noticias/destaque", async (req, res) => {
    try {
      const { noticias } = await storage.getNoticias(1, 1);
      if (noticias.length === 0) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }
      
      // Retorna a notícia mais recente como destaque
      res.json({ noticias: [noticias[0]] });
    } catch (error) {
      console.error("Erro ao obter notícia em destaque:", error);
      res.status(500).json({ message: "Erro ao obter notícia em destaque" });
    }
  });
  
  // Notícias mais lidas/trending
  app.get("/api/noticias/trending", async (req, res) => {
    try {
      // Por enquanto, usamos as notícias mais recentes como trending
      // Em uma implementação completa, isso seria baseado em visualizações
      const limit = Number(req.query.limit) || 5;
      const { noticias } = await storage.getNoticias(1, limit);
      
      if (noticias.length === 0) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }
      
      res.json(noticias);
    } catch (error) {
      console.error("Erro ao obter notícias trending:", error);
      res.status(500).json({ message: "Erro ao obter notícias trending" });
    }
  });

  // Notícias principais
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
  
  // Rota para atualizar notícia existente
  app.patch("/api/noticias/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Verificar se a notícia existe
      const noticia = await storage.getNoticiaPorId(id);
      if (!noticia) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }

      // Extrair as categorias adicionais antes da validação
      const { categoriasIds, ...dadosAtualizacao } = req.body;
      
      // Verificar se há atualização de imagem externa
      if (dadosAtualizacao.imageUrl && typeof dadosAtualizacao.imageUrl === 'string') {
        dadosAtualizacao.imageUrl = await processExternalImageUrl(dadosAtualizacao.imageUrl);
      }
      
      // Atualizar a notícia
      const noticiaAtualizada = await storage.atualizarNoticia(id, dadosAtualizacao);
      
      // Processar categorias adicionais, se houver
      if (categoriasIds && Array.isArray(categoriasIds)) {
        // Primeiro, remover todas as categorias existentes
        const categoriasExistentes = await storage.getCategoriasAdicionaisDaNoticia(id);
        const promisesRemocao = categoriasExistentes.map(cat => 
          storage.removerCategoriaDaNoticia(id, cat.id)
        );
        await Promise.all(promisesRemocao);
        
        // Depois, adicionar as novas categorias
        if (categoriasIds.length > 0) {
          const promisesAdicao = categoriasIds.map((categoriaId: string) => 
            storage.adicionarCategoriaNaNoticia(id, categoriaId)
          );
          await Promise.all(promisesAdicao);
        }
      }
      
      res.json(noticiaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      res.status(500).json({ message: "Erro ao atualizar notícia" });
    }
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
  
  // Obter categorias adicionais de uma notícia
  app.get("/api/noticias/:id/categorias", async (req, res) => {
    try {
      const noticiaId = req.params.id;
      const categorias = await storage.getCategoriasAdicionaisDaNoticia(noticiaId);
      res.json(categorias);
    } catch (error) {
      console.error("Erro ao buscar categorias da notícia:", error);
      res.status(500).json({ message: "Erro ao buscar categorias da notícia" });
    }
  });

  // Função auxiliar para processar URLs de imagens externas
  async function processExternalImageUrl(imageUrl: string): Promise<string> {
    // Se a URL for externa e precisar ser baixada
    if (imageUrl &&
        (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net') || 
         imageUrl.includes('openai.com') ||
         imageUrl.includes('images.unsplash.com') ||
         imageUrl.includes('googleapis.com'))) {
      
      try {
        console.log("Processando URL de imagem externa:", imageUrl);
        // Baixar a imagem para nosso Object Storage
        const result = await downloadAndSaveImage(imageUrl);
        console.log("Imagem processada e armazenada:", result.url);
        return result.url;
      } catch (err) {
        console.error("Erro ao processar imagem externa:", err);
        // Se falhar, manter a URL original
        return imageUrl;
      }
    }
    
    // Se não for uma URL externa que precisamos processar, retornar a mesma URL
    return imageUrl;
  }

  app.post("/api/noticias", async (req, res) => {
    try {
      // Extrair as categorias adicionais antes da validação
      const { categoriasIds, ...noticiaRawData } = req.body;
      
      // Validar os dados com o schema
      const noticiaData = insertNoticiaSchema.parse(noticiaRawData);
      
      // Processar a URL da imagem se for externa
      if (noticiaData.imageUrl) {
        noticiaData.imageUrl = await processExternalImageUrl(noticiaData.imageUrl);
      }
      
      // Criar a notícia com a URL da imagem já processada
      const created = await storage.criarNoticia(noticiaData);
      
      // Processar categorias adicionais, se houver
      if (categoriasIds && Array.isArray(categoriasIds) && categoriasIds.length > 0) {
        // Adicionar cada categoria à notícia
        const promises = categoriasIds.map((categoriaId: string) => 
          storage.adicionarCategoriaNaNoticia(created.id, categoriaId)
        );
        
        await Promise.all(promises);
      }
      
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da notícia inválidos", errors: error.errors });
        return;
      }
      console.error("Erro ao criar notícia:", error);
      res.status(500).json({ message: "Erro ao criar notícia" });
    }
  });

  // Tags
  app.get("/api/tags", async (_req, res) => {
    const tags = await storage.getTags();
    res.json(tags);
  });
  
  // Obter tags de uma notícia específica
  app.get("/api/noticias/:id/tags", async (req, res) => {
    try {
      const noticiaId = req.params.id;
      const tags = await storage.getTagsDaNoticia(noticiaId);
      res.json(tags);
    } catch (error) {
      console.error("Erro ao buscar tags da notícia:", error);
      res.status(500).json({ message: "Erro ao buscar tags da notícia" });
    }
  });
  
  // Adicionar tag a uma notícia
  app.post("/api/noticias/:id/tags", async (req, res) => {
    try {
      const noticiaId = req.params.id;
      const { tagId } = req.body;
      
      if (!tagId) {
        return res.status(400).json({ message: "ID da tag é obrigatório" });
      }
      
      await storage.adicionarTagNaNoticia(noticiaId, tagId);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Erro ao adicionar tag na notícia:", error);
      res.status(500).json({ message: "Erro ao adicionar tag na notícia" });
    }
  });
  
  // Remover tag de uma notícia
  app.delete("/api/noticias/:id/tags/:tagId", async (req, res) => {
    try {
      const { id: noticiaId, tagId } = req.params;
      await storage.removerTagDaNoticia(noticiaId, tagId);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao remover tag da notícia:", error);
      res.status(500).json({ message: "Erro ao remover tag da notícia" });
    }
  });

  app.get("/api/tags/:slug", async (req, res) => {
    const tag = await storage.getTagPorSlug(req.params.slug);
    if (!tag) {
      res.status(404).json({ message: "Tag não encontrada" });
      return;
    }
    res.json(tag);
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const tag = insertTagSchema.parse(req.body);
      const created = await storage.criarTag(tag);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da tag inválidos", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  app.patch("/api/tags/:id", async (req, res) => {
    try {
      // Validar parcialmente os dados da tag
      const validData: Partial<InsertTag> = {};
      if (req.body.nome !== undefined) validData.nome = req.body.nome;
      if (req.body.slug !== undefined) validData.slug = req.body.slug;
      if (req.body.descricao !== undefined) validData.descricao = req.body.descricao;
      
      const updated = await storage.atualizarTag(req.params.id, validData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da tag inválidos", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Erro ao atualizar tag" });
    }
  });

  app.delete("/api/tags/:id", async (req, res) => {
    try {
      await storage.removerTag(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover tag" });
    }
  });
  
  // Excluir notícia
  app.delete("/api/noticias/:id", async (req, res) => {
    try {
      // Verificar se a notícia existe antes de tentar remover
      const noticia = await storage.getNoticiaPorId(req.params.id);
      if (!noticia) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }
      
      // Excluir a notícia
      await storage.removerNoticia(req.params.id);
      res.json({ success: true, message: "Notícia excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      res.status(500).json({ message: "Erro ao excluir notícia" });
    }
  });

  // Obter notícias por tag
  app.get("/api/tags/:slug/noticias", async (req, res) => {
    try {
      const tag = await storage.getTagPorSlug(req.params.slug);
      if (!tag) {
        return res.status(404).json({ message: "Tag não encontrada" });
      }
      
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const noticias = await storage.getNoticiasPorTag(tag.id, page, limit);
      
      res.json(noticias);
    } catch (error) {
      console.error("Erro ao buscar notícias por tag:", error);
      res.status(500).json({ message: "Erro ao obter notícias pela tag" });
    }
  });

  // Endpoint para baixar imagens externas e armazená-las no Object Storage
  app.post("/api/download-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl || typeof imageUrl !== 'string') {
        return res.status(400).json({ message: "URL da imagem é obrigatória" });
      }
      
      // Verificar se a URL é válida
      if (!imageUrl.startsWith('http')) {
        return res.status(400).json({ message: "URL inválida. Deve começar com http:// ou https://" });
      }
      
      // URL de imagens da DALL-E e outras externas
      if (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net') || 
          imageUrl.includes('openai.com') ||
          imageUrl.includes('images.unsplash.com') ||
          imageUrl.includes('googleapis.com')) {
        
        // Fazer o download e salvar no Object Storage
        console.log("Baixando imagem de URL externa:", imageUrl);
        
        const result = await downloadAndSaveImage(imageUrl);
        console.log("Imagem salva com sucesso:", result);
        
        // Retornar a nova URL da imagem
        return res.json({ 
          originalUrl: imageUrl,
          imageUrl: result.url,
          key: result.key,
          success: true
        });
      }
      
      // Se a URL já for interna, retornar ela mesma
      if ((process.env.SITE_DOMAIN && imageUrl.includes(process.env.SITE_DOMAIN)) || 
          imageUrl.includes('localhost') || 
          imageUrl.includes('.repl.co')) {
        return res.json({
          originalUrl: imageUrl,
          imageUrl: imageUrl,
          message: "URL já é interna, nenhuma conversão necessária",
          success: true
        });
      }
      
      // Para outras URLs externas, baixar e salvar normalmente
      const result = await downloadAndSaveImage(imageUrl);
      
      res.json({
        originalUrl: imageUrl,
        imageUrl: result.url,
        key: result.key,
        success: true
      });
    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      let errorMessage = "Erro ao processar a imagem";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ 
        message: "Erro ao processar a imagem", 
        error: errorMessage,
        success: false 
      });
    }
  });

  // Rotas para vídeos
  // Listar todos os vídeos com paginação
  app.get("/api/videos", async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await storage.getVideos(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      res.status(500).json({ message: "Erro ao buscar vídeos" });
    }
  });

  // Obter vídeos em destaque
  app.get("/api/videos/destaque", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const videos = await storage.getVideosDestaque(limit);
      res.json(videos);
    } catch (error) {
      console.error("Erro ao buscar vídeos em destaque:", error);
      res.status(500).json({ message: "Erro ao buscar vídeos em destaque" });
    }
  });

  // Obter vídeo específico por ID
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const video = await storage.getVideoPorNoticiaId(id);
      
      if (!video) {
        return res.status(404).json({ message: "Vídeo não encontrado" });
      }
      
      res.json(video);
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      res.status(500).json({ message: "Erro ao buscar vídeo" });
    }
  });

  // Obter vídeo relacionado a uma notícia
  app.get("/api/noticias/:noticiaId/video", async (req, res) => {
    try {
      const noticiaId = req.params.noticiaId;
      const video = await storage.getVideoPorNoticiaId(noticiaId);
      
      if (!video) {
        return res.status(404).json({ message: "Vídeo não encontrado para esta notícia" });
      }
      
      res.json(video);
    } catch (error) {
      console.error("Erro ao buscar vídeo da notícia:", error);
      res.status(500).json({ message: "Erro ao buscar vídeo da notícia" });
    }
  });

  // Criar novo vídeo
  app.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const created = await storage.criarVideo(videoData);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados do vídeo inválidos", errors: error.errors });
        return;
      }
      console.error("Erro ao criar vídeo:", error);
      res.status(500).json({ message: "Erro ao criar vídeo" });
    }
  });

  // Atualizar vídeo existente
  app.put("/api/videos/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const videoData = insertVideoSchema.partial().parse(req.body);
      const updated = await storage.atualizarVideo(id, videoData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados do vídeo inválidos", errors: error.errors });
        return;
      }
      console.error("Erro ao atualizar vídeo:", error);
      res.status(500).json({ message: "Erro ao atualizar vídeo" });
    }
  });

  // Deletar vídeo
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removerVideo(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover vídeo:", error);
      res.status(500).json({ message: "Erro ao remover vídeo" });
    }
  });

  // Incrementar contagem de visualizações
  app.post("/api/videos/:id/visualizacao", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.incrementarVisualizacao(id);
      res.status(200).json({ message: "Visualização registrada com sucesso" });
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
      res.status(500).json({ message: "Erro ao registrar visualização" });
    }
  });

  return httpServer;
}