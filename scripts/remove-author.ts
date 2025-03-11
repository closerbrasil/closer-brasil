import { db } from "../server/db";
import { autores, noticia } from "../shared/schema";
import '../server/env';
import { eq, sql } from "drizzle-orm";

// ID do autor João Silva para ser removido
const AUTHOR_ID_TO_REMOVE = "21b9a7d2-c8c6-40f5-b776-1a7327349a7a";

/**
 * Script para remover o autor João Silva após garantir que nenhum artigo o referencia
 */
async function removeAuthor() {
  try {
    console.log("🚀 Verificando se é seguro remover o autor...");
    
    // Verificar se o autor existe
    const authorExists = await db.select()
      .from(autores)
      .where(eq(autores.id, AUTHOR_ID_TO_REMOVE));
    
    if (authorExists.length === 0) {
      console.log("⚠️ O autor não foi encontrado no banco de dados. Nada a fazer.");
      process.exit(0);
    }
    
    console.log(`📋 Autor encontrado: ${authorExists[0].nome} (${authorExists[0].email})`);
    
    // Verificar se ainda há artigos que referenciam este autor
    const referencingArticles = await db.select({ count: sql<number>`count(*)` })
      .from(noticia)
      .where(eq(noticia.autorId, AUTHOR_ID_TO_REMOVE));
    
    const articlesCount = Number(referencingArticles[0]?.count || 0);
    
    if (articlesCount > 0) {
      console.log(`⚠️ Ainda existem ${articlesCount} artigos referenciando este autor. Não é seguro removê-lo.`);
      console.log("⚠️ Por favor, execute primeiro o script update-articles-author.ts para atualizar todos os artigos.");
      process.exit(1);
    }
    
    console.log("✅ Nenhum artigo referencia este autor. É seguro removê-lo.");
    
    // Remover o autor
    const result = await db.delete(autores)
      .where(eq(autores.id, AUTHOR_ID_TO_REMOVE))
      .returning();
    
    if (result.length > 0) {
      console.log(`✅ Autor "${result[0].nome}" removido com sucesso!`);
    } else {
      console.log("⚠️ Nenhum autor foi removido. Algo deu errado.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao remover autor:", error);
    process.exit(1);
  }
}

// Executar a função principal
removeAuthor(); 