import { Noticia, Categoria, Autor, Tag, Comentario, Imagem, InsertNoticia, InsertCategoria, InsertAutor, InsertTag, InsertComentario, InsertImagem, noticia, categorias, autores, tags, noticiasTags, comentarios, imagens } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Notícias
  getNoticias(page: number, limit: number): Promise<{ noticias: Noticia[]; total: number }>;
  getNoticiaPorSlug(slug: string): Promise<Noticia | undefined>;
  getNoticiaPorId(id: string): Promise<Noticia | undefined>;
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

  // Tags
  getTags(): Promise<Tag[]>;
  getTagPorSlug(slug: string): Promise<Tag | undefined>;
  criarTag(tag: InsertTag): Promise<Tag>;
  getTagsDaNoticia(noticiaId: string): Promise<Tag[]>;
  adicionarTagNaNoticia(noticiaId: string, tagId: string): Promise<void>;
  removerTagDaNoticia(noticiaId: string, tagId: string): Promise<void>;

  // Comentários
  getComentarios(noticiaId: string): Promise<Comentario[]>;
  getComentariosAprovados(noticiaId: string): Promise<Comentario[]>;
  criarComentario(comentario: InsertComentario): Promise<Comentario>;
  aprovarComentario(id: string): Promise<Comentario>;
  removerComentario(id: string): Promise<void>;

  // Imagens
  salvarImagem(imagem: InsertImagem): Promise<Imagem>;
  getImagemPorId(id: string): Promise<Imagem | undefined>;
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

  async getNoticiaPorId(id: string): Promise<Noticia | undefined> {
    const [result] = await db
      .select()
      .from(noticia)
      .where(eq(noticia.id, id));
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

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getTagPorSlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug));
    return tag;
  }

  async criarTag(tag: InsertTag): Promise<Tag> {
    const [result] = await db
      .insert(tags)
      .values(tag)
      .returning();
    return result;
  }

  async getTagsDaNoticia(noticiaId: string): Promise<Tag[]> {
    const result = await db
      .select({
        tag: tags,
      })
      .from(noticiasTags)
      .innerJoin(tags, eq(noticiasTags.tagId, tags.id))
      .where(eq(noticiasTags.noticiaId, noticiaId));

    return result.map(r => r.tag);
  }

  async adicionarTagNaNoticia(noticiaId: string, tagId: string): Promise<void> {
    await db
      .insert(noticiasTags)
      .values({ noticiaId, tagId })
      .onConflictDoNothing();
  }

  async removerTagDaNoticia(noticiaId: string, tagId: string): Promise<void> {
    await db
      .delete(noticiasTags)
      .where(sql`${noticiasTags.noticiaId} = ${noticiaId} AND ${noticiasTags.tagId} = ${tagId}`);
  }

  // Comentários
  async getComentarios(noticiaId: string): Promise<Comentario[]> {
    return await db
      .select()
      .from(comentarios)
      .where(eq(comentarios.noticiaId, noticiaId))
      .orderBy(desc(comentarios.criadoEm));
  }

  async getComentariosAprovados(noticiaId: string): Promise<Comentario[]> {
    return await db
      .select()
      .from(comentarios)
      .where(sql`${comentarios.noticiaId} = ${noticiaId} AND ${comentarios.aprovado} = true`)
      .orderBy(desc(comentarios.criadoEm));
  }

  async criarComentario(comentario: InsertComentario): Promise<Comentario> {
    const [result] = await db
      .insert(comentarios)
      .values(comentario)
      .returning();
    return result;
  }

  async aprovarComentario(id: string): Promise<Comentario> {
    const [result] = await db
      .update(comentarios)
      .set({ aprovado: true, atualizadoEm: new Date() })
      .where(eq(comentarios.id, id))
      .returning();
    return result;
  }

  async removerComentario(id: string): Promise<void> {
    await db
      .delete(comentarios)
      .where(eq(comentarios.id, id));
  }

  // Imagens
  async salvarImagem(imagem: InsertImagem): Promise<Imagem> {
    const [result] = await db
      .insert(imagens)
      .values(imagem)
      .returning();
    return result;
  }

  async getImagemPorId(id: string): Promise<Imagem | undefined> {
    const [result] = await db
      .select()
      .from(imagens)
      .where(eq(imagens.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();