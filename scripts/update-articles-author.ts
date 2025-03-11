import { db } from "../server/db";
import { noticia } from "../shared/schema";
import '../server/env';
import { eq, sql } from "drizzle-orm";

// ID do autor Mizael Xavier
const NEW_AUTHOR_ID = "d79246af-bd2f-4b84-a1c4-b0e814cfbe29";

/**
 * Script para atualizar todos os artigos para o autor Mizael Xavier
 */
async function updateArticlesAuthor() {
  try {
    console.log("🚀 Iniciando atualização do autor de todos os artigos...");
    
    // Obter contagem de artigos antes da atualização
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(noticia);
    const countBefore = Number(countResult[0]?.count || 0);
    
    console.log(`📊 Total de artigos antes da atualização: ${countBefore}`);
    
    // Verificar quantos artigos já têm o autor correto
    const alreadyCorrectResult = await db.select({ count: sql<number>`count(*)` })
      .from(noticia)
      .where(eq(noticia.autorId, NEW_AUTHOR_ID));
    const alreadyCorrect = Number(alreadyCorrectResult[0]?.count || 0);
    
    console.log(`📊 Artigos que já têm o autor correto: ${alreadyCorrect}`);
    console.log(`📊 Artigos que precisam ser atualizados: ${countBefore - alreadyCorrect}`);
    
    // Atualizar todos os artigos para o novo autor
    const result = await db.update(noticia)
      .set({ autorId: NEW_AUTHOR_ID })
      .returning({ id: noticia.id, titulo: noticia.titulo });
    
    console.log(`✅ Artigos atualizados: ${result.length}`);
    
    // Listar alguns dos artigos atualizados como exemplo
    if (result.length > 0) {
      console.log("\n📝 Exemplo de artigos atualizados:");
      result.slice(0, 5).forEach((article, index) => {
        console.log(`${index + 1}. ${article.titulo} (ID: ${article.id})`);
      });
      
      if (result.length > 5) {
        console.log(`... e mais ${result.length - 5} artigos`);
      }
    }
    
    console.log("\n✅ Atualização concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao atualizar autor dos artigos:", error);
    process.exit(1);
  }
}

// Executar a função principal
updateArticlesAuthor(); 