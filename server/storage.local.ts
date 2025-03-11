// Este arquivo é uma versão local do storage.ts que não depende do @replit/object-storage
// Ele será usado quando o projeto estiver rodando localmente

import * as objectStorage from './objectStorage.local';
import { db } from './db';
import { categorias, InsertCategoria, Categoria } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Armazenamento local de categorias para desenvolvimento
const categoriasLocais: Categoria[] = [];

export const storage = {
  // Função para fazer upload de arquivos
  async uploadFile(buffer: Buffer, originalFilename: string, mimeType: string) {
    return await objectStorage.uploadFile(buffer, originalFilename, mimeType);
  },

  // Função para obter arquivos
  async getFile(key: string) {
    return await objectStorage.getFile(key);
  },

  // Função para gerar URLs públicas
  getPublicUrl(key: string) {
    return objectStorage.getPublicUrl(key);
  },

  // Função para baixar e salvar imagens
  async downloadAndSaveImage(url: string) {
    return await objectStorage.downloadAndSaveImage(url);
  },

  // Funções de categoria
  async getCategorias(): Promise<Categoria[]> {
    try {
      // Tentar obter do banco de dados primeiro
      const result = await db.select().from(categorias);
      if (result && result.length > 0) {
        return result;
      }
      // Se não houver no banco, usar o armazenamento local
      return categoriasLocais;
    } catch (error) {
      console.error('Erro ao obter categorias do banco de dados:', error);
      // Em caso de erro, retornar o armazenamento local
      return categoriasLocais;
    }
  },

  async getCategoriaPorSlug(slug: string): Promise<Categoria | undefined> {
    try {
      // Tentar obter do banco de dados primeiro
      const [result] = await db.select().from(categorias).where(eq(categorias.slug, slug));
      if (result) {
        return result;
      }
      // Se não houver no banco, procurar no armazenamento local
      return categoriasLocais.find(cat => cat.slug === slug);
    } catch (error) {
      console.error('Erro ao obter categoria por slug:', error);
      // Em caso de erro, procurar no armazenamento local
      return categoriasLocais.find(cat => cat.slug === slug);
    }
  },

  async getCategoriaPorId(id: string): Promise<Categoria | undefined> {
    try {
      // Tentar obter do banco de dados primeiro
      const [result] = await db.select().from(categorias).where(eq(categorias.id, id));
      if (result) {
        return result;
      }
      // Se não houver no banco, procurar no armazenamento local
      return categoriasLocais.find(cat => cat.id === id);
    } catch (error) {
      console.error('Erro ao obter categoria por id:', error);
      // Em caso de erro, procurar no armazenamento local
      return categoriasLocais.find(cat => cat.id === id);
    }
  },

  async criarCategoria(categoria: InsertCategoria): Promise<Categoria> {
    try {
      // Tentar criar no banco de dados primeiro
      const [result] = await db.insert(categorias).values(categoria).returning();
      if (result) {
        return result;
      }
      throw new Error('Falha ao inserir categoria no banco de dados');
    } catch (error) {
      console.error('Erro ao criar categoria no banco de dados:', error);
      // Em caso de erro, criar no armazenamento local
      const novaCategoria: Categoria = {
        id: `local-${Date.now()}`,
        nome: categoria.nome,
        slug: categoria.slug,
        descricao: categoria.descricao || null,
        imageUrl: categoria.imageUrl || null,
        cor: categoria.cor || '#000000',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
      categoriasLocais.push(novaCategoria);
      return novaCategoria;
    }
  }
}; 