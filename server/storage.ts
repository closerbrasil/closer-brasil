import { Article, Category, InsertArticle, InsertCategory } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private categories: Map<number, Category>;
  private currentArticleId: number;
  private currentCategoryId: number;

  constructor() {
    this.articles = new Map();
    this.categories = new Map();
    this.currentArticleId = 1;
    this.currentCategoryId = 1;

    // Add some default categories
    const defaultCategories: InsertCategory[] = [
      { name: "Technology", slug: "technology" },
      { name: "Culture", slug: "culture" },
      { name: "Business", slug: "business" }
    ];
    defaultCategories.forEach(cat => this.createCategory(cat));
  }

  async getArticles(page: number, limit: number): Promise<{ articles: Article[]; total: number }> {
    const allArticles = Array.from(this.articles.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      articles: allArticles.slice(start, end),
      total: allArticles.length
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async getArticlesByCategory(categorySlug: string, page: number, limit: number): Promise<{ articles: Article[]; total: number }> {
    const category = Array.from(this.categories.values()).find(c => c.slug === categorySlug);
    if (!category) return { articles: [], total: 0 };

    const categoryArticles = Array.from(this.articles.values())
      .filter(article => article.categoryId === category.id)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      articles: categoryArticles.slice(start, end),
      total: categoryArticles.length
    };
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const newArticle: Article = {
      ...article,
      id,
      publishedAt: new Date()
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = {
      ...category,
      id
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
}

export const storage = new MemStorage();
