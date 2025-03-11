import { db } from "../server/db";
import '../server/env';
import { sql } from "drizzle-orm";

/**
 * Script para verificar o estado atual do banco de dados
 */
async function checkDatabase() {
  try {
    console.log("Verificando o banco de dados...");
    console.log("URL do banco de dados:", process.env.DATABASE_URL);

    // Verificar tabelas existentes
    const tables = await db.execute(sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);
    
    console.log("\n🔍 TABELAS EXISTENTES:");
    console.log(tables.rows);

    // Verificar contagem de registros em cada tabela
    console.log("\n🔢 CONTAGEM DE REGISTROS POR TABELA:");
    
    for (const table of tables.rows) {
      const tableName = table.tablename as string;
      const countResult = await db.execute(sql`
        SELECT COUNT(*) FROM ${sql.identifier(tableName)}
      `);
      
      console.log(`${tableName}: ${countResult.rows[0].count} registros`);
    }

    // Verificar registros de categorias
    const categorias = await db.execute(sql`
      SELECT id, nome, slug 
      FROM categorias 
      LIMIT 10
    `);
    
    console.log("\n📋 AMOSTRA DE CATEGORIAS:");
    console.log(categorias.rows);

    // Verificar registros de autores
    const autores = await db.execute(sql`
      SELECT id, nome, email 
      FROM autores 
      LIMIT 10
    `);
    
    console.log("\n👤 AMOSTRA DE AUTORES:");
    console.log(autores.rows);

    console.log("\n✅ Verificação do banco de dados concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao verificar banco de dados:", error);
    process.exit(1);
  }
}

// Executar a função principal
checkDatabase(); 