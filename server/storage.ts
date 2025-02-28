import { Noticia, Categoria, Autor, InsertNoticia, InsertCategoria, InsertAutor, noticia, categorias, autores } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Notícias
  getNoticias(page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }>;
  getNoticiaPorSlug(slug: string): Promise<Noticia | undefined>;
  getNoticiasPorCategoria(categoriaSlug: string, page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }>;
  getNoticiasPorAutor(autorSlug: string, page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }>;
  criarNoticia(noticia: InsertNoticia): Promise<Noticia>;
  atualizarNoticia(id: string, noticia: Partial<InsertNoticia>): Promise<Noticia>;

  // Categorias
  getCategorias(): Promise<Categoria[]>;
  getCategoriaPorSlug(slug: string): Promise<Categoria | undefined>;
  criarCategoria(categoria: InsertCategoria): Promise<Categoria>;

  // Autores
  getAutores(): Promise<Autor[]>;
  getAutorPorSlug(slug: string): Promise<Autor | undefined>;
  criarAutor(autor: InsertAutor): Promise<Autor>;
  atualizarAutor(id: string, autor: Partial<InsertAutor>): Promise<Autor>;
}

export class DatabaseStorage implements IStorage {
  // Notícias
  async getNoticias(page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }> {
    const offset = (page - 1) * limit;
    const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(noticia);
    const total = Number(countResult?.count || 0);

    const noticiasResult = await db
      .select()
      .from(noticia)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(noticia.publicadoEm));

    return {
      noticias: noticiasResult,
      total
    };
  }

  async getNoticiaPorSlug(slug: string): Promise<Noticia | undefined> {
    const [result] = await db
      .select()
      .from(noticia)
      .where(eq(noticia.slug, slug));
    return result;
  }

  async getNoticiasPorCategoria(categoriaSlug: string, page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }> {
    const offset = (page - 1) * limit;
    const categoria = await this.getCategoriaPorSlug(categoriaSlug);
    if (!categoria) return { noticias: [], total: 0 };

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(noticia)
      .where(eq(noticia.categoriaId, categoria.id));
    const total = Number(countResult?.count || 0);

    const noticiasResult = await db
      .select()
      .from(noticia)
      .where(eq(noticia.categoriaId, categoria.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(noticia.publicadoEm));

    return {
      noticias: noticiasResult,
      total
    };
  }

  async getNoticiasPorAutor(autorSlug: string, page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }> {
    const offset = (page - 1) * limit;
    const autor = await this.getAutorPorSlug(autorSlug);
    if (!autor) return { noticias: [], total: 0 };

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(noticia)
      .where(eq(noticia.autorId, autor.id));
    const total = Number(countResult?.count || 0);

    const noticiasResult = await db
      .select()
      .from(noticia)
      .where(eq(noticia.autorId, autor.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(noticia.publicadoEm));

    return {
      noticias: noticiasResult,
      total
    };
  }

  async criarNoticia(novaNoticia: InsertNoticia): Promise<Noticia> {
    const [result] = await db
      .insert(noticia)
      .values(novaNoticia)
      .returning();
    return result;
  }

  async atualizarNoticia(id: string, atualizacao: Partial<InsertNoticia>): Promise<Noticia> {
    const [result] = await db
      .update(noticia)
      .set(atualizacao)
      .where(eq(noticia.id, id))
      .returning();
    return result;
  }

  // Categorias
  async getCategorias(): Promise<Categoria[]> {
    return await db.select().from(categorias);
  }

  async getCategoriaPorSlug(slug: string): Promise<Categoria | undefined> {
    const [categoria] = await db
      .select()
      .from(categorias)
      .where(eq(categorias.slug, slug));
    return categoria;
  }

  async criarCategoria(categoria: InsertCategoria): Promise<Categoria> {
    const [result] = await db
      .insert(categorias)
      .values(categoria)
      .returning();
    return result;
  }

  // Autores
  async getAutores(): Promise<Autor[]> {
    return await db.select().from(autores);
  }

  async getAutorPorSlug(slug: string): Promise<Autor | undefined> {
    const [autor] = await db
      .select()
      .from(autores)
      .where(eq(autores.slug, slug));
    return autor;
  }

  async criarAutor(autor: InsertAutor): Promise<Autor> {
    const [result] = await db
      .insert(autores)
      .values(autor)
      .returning();
    return result;
  }

  async atualizarAutor(id: string, autor: Partial<InsertAutor>): Promise<Autor> {
    const [result] = await db
      .update(autores)
      .set(autor)
      .where(eq(autores.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();