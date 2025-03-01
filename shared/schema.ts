import { pgTable, text, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Tabela de autores
export const autores = pgTable("autores", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  cargo: varchar("cargo", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Tabela de categorias
export const categorias = pgTable("categorias", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  descricao: text("descricao"),
  imageUrl: text("image_url"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Nova tabela de tags
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  descricao: text("descricao"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Nova tabela para armazenar imagens
export const imagens = pgTable("imagens", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalname: varchar("originalname", { length: 255 }).notNull(),
  mimetype: varchar("mimetype", { length: 100 }).notNull(),
  size: text("size").notNull(),
  data: text("data").notNull(), // Dados da imagem em Base64
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

// Tabela de junção para relacionamento many-to-many entre notícias e tags
export const noticiasTags = pgTable("noticias_tags", {
  noticiaId: uuid("noticia_id").references(() => noticia.id).notNull(),
  tagId: uuid("tag_id").references(() => tags.id).notNull(),
});

// Tabela de notícias com campos SEO
export const noticia = pgTable("noticia", {
  id: uuid("id").defaultRandom().primaryKey(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  resumo: text("resumo").notNull(),
  conteudo: text("conteudo").notNull(),
  imageUrl: text("image_url").notNull(),
  autorId: uuid("autor_id").references(() => autores.id).notNull(),
  categoriaId: uuid("categoria_id").references(() => categorias.id).notNull(),
  publicadoEm: timestamp("publicado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
  // Campos SEO
  metaTitulo: varchar("meta_titulo", { length: 200 }),
  metaDescricao: text("meta_descricao"),
  urlCanonica: text("url_canonica"),
  palavraChave: varchar("palavra_chave", { length: 100 }),
  tempoLeitura: varchar("tempo_leitura", { length: 50 }),
  // Mídias sociais
  ogTitulo: varchar("og_titulo", { length: 200 }),
  ogDescricao: text("og_descricao"),
  ogImagem: text("og_imagem"),
  twitterTitulo: varchar("twitter_titulo", { length: 200 }),
  twitterDescricao: text("twitter_descricao"),
  twitterImagem: text("twitter_imagem"),
  // Campos Schema.org
  schemaType: varchar("schema_type", { length: 50 }).default("Article").notNull(),
  schemaAutor: text("schema_autor"),
  schemaPublisher: text("schema_publisher"),
  // Status e visibilidade
  status: varchar("status", { length: 20 }).default("rascunho").notNull(),
  visibilidade: varchar("visibilidade", { length: 20 }).default("publico").notNull(),
});

// Nova tabela de comentários
export const comentarios = pgTable("comentarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  conteudo: text("conteudo").notNull(),
  autorNome: varchar("autor_nome", { length: 100 }),
  noticiaId: uuid("noticia_id").references(() => noticia.id).notNull(),
  aprovado: boolean("aprovado").default(true).notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Relações
export const noticiaRelations = relations(noticia, ({ one, many }) => ({
  autor: one(autores, {
    fields: [noticia.autorId],
    references: [autores.id],
  }),
  categoria: one(categorias, {
    fields: [noticia.categoriaId],
    references: [categorias.id],
  }),
  tags: many(noticiasTags),
  comentarios: many(comentarios),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noticias: many(noticiasTags),
}));

export const noticiasTagsRelations = relations(noticiasTags, ({ one }) => ({
  noticia: one(noticia, {
    fields: [noticiasTags.noticiaId],
    references: [noticia.id],
  }),
  tag: one(tags, {
    fields: [noticiasTags.tagId],
    references: [tags.id],
  }),
}));

export const autoresRelations = relations(autores, ({ many }) => ({
  noticias: many(noticia),
}));

export const categoriasRelations = relations(categorias, ({ many }) => ({
  noticias: many(noticia),
}));

export const comentariosRelations = relations(comentarios, ({ one }) => ({
  noticia: one(noticia, {
    fields: [comentarios.noticiaId],
    references: [noticia.id],
  }),
}));

// Schemas de inserção
export const insertAutorSchema = createInsertSchema(autores).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertCategoriaSchema = createInsertSchema(categorias).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertNoticiaSchema = createInsertSchema(noticia).omit({
  id: true,
  publicadoEm: true,
  atualizadoEm: true,
});

// Ajustando o schema de comentários
export const insertComentarioSchema = createInsertSchema(comentarios).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
  aprovado: true,
}).extend({
  autorNome: z.string().optional(),
  conteudo: z.string().min(1, "O comentário não pode estar vazio"),
});

// Schema para imagens
export const insertImagemSchema = createInsertSchema(imagens).omit({
  id: true,
  criadoEm: true,
});


// Tipos
export type Autor = typeof autores.$inferSelect;
export type InsertAutor = z.infer<typeof insertAutorSchema>;

export type Categoria = typeof categorias.$inferSelect;
export type InsertCategoria = z.infer<typeof insertCategoriaSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Noticia = typeof noticia.$inferSelect;
export type InsertNoticia = z.infer<typeof insertNoticiaSchema>;

export type Comentario = typeof comentarios.$inferSelect;
export type InsertComentario = z.infer<typeof insertComentarioSchema>;

export type Imagem = typeof imagens.$inferSelect;
export type InsertImagem = z.infer<typeof insertImagemSchema>;