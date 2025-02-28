import { Article, Category, InsertArticle, InsertCategory, articles, categories } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Articles
  getArticles(page: number, limit: number): Promise<{ articles: Article[]; total: number }>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categorySlug: string, page: number, limit: number): Promise<{ articles: Article[]; total: number }>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(page: number, limit: number): Promise<{ articles: Article[]; total: number }> {
    const offset = (page - 1) * limit;
    const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(articles);
    const total = Number(countResult?.count || 0);

    const articlesResult = await db
      .select()
      .from(articles)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(articles.publishedAt));

    return {
      articles: articlesResult,
      total
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug));
    return article;
  }

  async getArticlesByCategory(categorySlug: string, page: number, limit: number): Promise<{ articles: Article[]; total: number }> {
    const offset = (page - 1) * limit;
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return { articles: [], total: 0 };

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.categoryId, category.id));
    const total = Number(countResult?.count || 0);

    const articlesResult = await db
      .select()
      .from(articles)
      .where(eq(articles.categoryId, category.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(articles.publishedAt));

    return {
      articles: articlesResult,
      total
    };
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values(article)
      .returning();
    return newArticle;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }
}

export const storage = new DatabaseStorage();

//To run migrations, add this line somewhere appropriate in your application's startup process:
// await migrate(db, { migrationsFolder: './migrations' }); //Remember to replace './migrations' with your actual migrations folder path.