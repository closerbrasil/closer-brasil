import { db } from "../server/db";
import { autores, categorias } from "../shared/schema";
import fs from "fs";
import path from "path";
import '../server/env';
import { eq, sql } from "drizzle-orm";

const backupDir = path.join(__dirname, "../backup");
const fixedBackupDir = path.join(__dirname, "../backup-fixed");

// Garantir que o diretório de backup corrigido exista
if (!fs.existsSync(fixedBackupDir)) {
  fs.mkdirSync(fixedBackupDir, { recursive: true });
}

// Função para ler um arquivo JSON
async function readJsonFile(filePath: string) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, error);
    return [];
  }
}

// Função para escrever um arquivo JSON
async function writeJsonFile(filePath: string, data: any) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Arquivo salvo: ${filePath}`);
  } catch (error) {
    console.error(`Erro ao escrever o arquivo ${filePath}:`, error);
  }
}

// Obter mapeamento de autores do banco de dados
async function getAutoresMap() {
  const autoresFromDB = await db.select({
    id: autores.id,
    nome: autores.nome,
    email: autores.email
  }).from(autores);

  console.log("\n📋 Autores no banco de dados:");
  console.log(autoresFromDB);

  return autoresFromDB;
}

// Obter mapeamento de categorias do banco de dados
async function getCategoriasMap() {
  const categoriasFromDB = await db.select({
    id: categorias.id,
    nome: categorias.nome,
    slug: categorias.slug
  }).from(categorias);

  console.log("\n📋 Categorias no banco de dados:");
  console.log(categoriasFromDB);

  return categoriasFromDB;
}

async function fixAutoresIds() {
  console.log("🔄 Corrigindo IDs de autores...");
  const filePath = path.join(backupDir, "autores.json");
  const autoresData = await readJsonFile(filePath);
  
  if (autoresData.length === 0) {
    console.log("ℹ️ Nenhum autor para corrigir");
    return;
  }

  // Obter autores do banco
  const autoresFromDB = await getAutoresMap();
  
  // Criar mapeamento de slug para ID do banco
  const slugToIdMap = new Map();
  
  for (const autor of autoresFromDB) {
    // Obter slug do autor no banco
    const result = await db.select({ slug: autores.slug })
      .from(autores)
      .where(eq(autores.id, autor.id));
    
    if (result.length > 0) {
      const slug = result[0].slug;
      slugToIdMap.set(slug, autor.id);
    }
  }
  
  console.log("🔍 Mapeamento de slug para ID:");
  console.log(Object.fromEntries(slugToIdMap));

  // Obter o ID de Mizael Xavier no banco de dados
  const mizaelId = autoresFromDB.find(a => a.nome === "Mizael Xavier")?.id;
  
  if (!mizaelId) {
    console.error("❌ Não foi possível encontrar o autor 'Mizael Xavier' no banco de dados");
    return;
  }
  
  console.log(`🔑 ID do autor Mizael Xavier no banco: ${mizaelId}`);

  // Atualizar autores
  const autoresFixed = autoresData.map(autor => {
    // Se for Mizael Xavier, atualizar com o ID do banco
    if (autor.nome === "Mizael Xavier") {
      return {
        ...autor,
        id: mizaelId
      };
    }
    
    // Se encontrar o slug no mapa, atualizar o ID
    if (slugToIdMap.has(autor.slug)) {
      return {
        ...autor,
        id: slugToIdMap.get(autor.slug)
      };
    }
    
    return autor;
  });

  // Salvar o arquivo corrigido
  await writeJsonFile(path.join(fixedBackupDir, "autores.json"), autoresFixed);
  
  // Retornar mapeamento de ID antigo para novo ID
  const idMap = new Map();
  
  for (let i = 0; i < autoresData.length; i++) {
    idMap.set(autoresData[i].id, autoresFixed[i].id);
  }
  
  return idMap;
}

async function fixCategoriasIds() {
  console.log("\n🔄 Corrigindo IDs de categorias...");
  const filePath = path.join(backupDir, "categorias.json");
  const categoriasData = await readJsonFile(filePath);
  
  if (categoriasData.length === 0) {
    console.log("ℹ️ Nenhuma categoria para corrigir");
    return;
  }

  // Obter categorias do banco
  const categoriasFromDB = await getCategoriasMap();
  
  // Criar mapeamento de nome para ID do banco
  const nomeToIdMap = new Map();
  const slugToIdMap = new Map();
  
  for (const categoria of categoriasFromDB) {
    nomeToIdMap.set(categoria.nome, categoria.id);
    slugToIdMap.set(categoria.slug, categoria.id);
  }
  
  console.log("🔍 Mapeamento de nome para ID:");
  console.log(Object.fromEntries(nomeToIdMap));

  // Obter o ID da categoria Tecnologia no banco de dados
  const tecnologiaId = categoriasFromDB.find(c => c.nome === "Tecnologia")?.id;
  
  if (!tecnologiaId) {
    console.error("❌ Não foi possível encontrar a categoria 'Tecnologia' no banco de dados");
    return;
  }
  
  console.log(`🔑 ID da categoria Tecnologia no banco: ${tecnologiaId}`);

  // Atualizar categorias
  const categoriasFixed = categoriasData.map(categoria => {
    // Se for Tecnologia, atualizar com o ID do banco
    if (categoria.nome === "Tecnologia") {
      return {
        ...categoria,
        id: tecnologiaId
      };
    }
    
    // Se encontrar o nome no mapa, atualizar o ID
    if (nomeToIdMap.has(categoria.nome)) {
      return {
        ...categoria,
        id: nomeToIdMap.get(categoria.nome)
      };
    }
    
    // Se encontrar o slug no mapa, atualizar o ID
    if (slugToIdMap.has(categoria.slug)) {
      return {
        ...categoria,
        id: slugToIdMap.get(categoria.slug)
      };
    }
    
    return categoria;
  });

  // Salvar o arquivo corrigido
  await writeJsonFile(path.join(fixedBackupDir, "categorias.json"), categoriasFixed);
  
  // Retornar mapeamento de ID antigo para novo ID
  const idMap = new Map();
  
  for (let i = 0; i < categoriasData.length; i++) {
    idMap.set(categoriasData[i].id, categoriasFixed[i].id);
  }
  
  return idMap;
}

async function fixNoticiasIds(autorIdMap: Map<string, string>, categoriaIdMap: Map<string, string>) {
  console.log("\n🔄 Corrigindo IDs de notícias...");
  const filePath = path.join(backupDir, "noticia.json");
  const noticiasData = await readJsonFile(filePath);
  
  if (noticiasData.length === 0) {
    console.log("ℹ️ Nenhuma notícia para corrigir");
    return;
  }

  // Obter ID do autor Mizael Xavier
  const autoresFromDB = await getAutoresMap();
  const defaultAutorId = autoresFromDB.find(a => a.nome === "Mizael Xavier")?.id;
  
  if (!defaultAutorId) {
    console.error("❌ Não foi possível encontrar o autor padrão para as notícias");
    return;
  }
  
  // Obter ID da categoria Tecnologia
  const categoriasFromDB = await getCategoriasMap();
  const defaultCategoriaId = categoriasFromDB.find(c => c.nome === "Tecnologia")?.id;
  
  if (!defaultCategoriaId) {
    console.error("❌ Não foi possível encontrar a categoria padrão para as notícias");
    return;
  }

  // Atualizar notícias
  const noticiasFixed = noticiasData.map(noticia => {
    // Atualizar autor_id
    const autorId = autorIdMap.get(noticia.autor_id) || defaultAutorId;
    
    // Atualizar categoria_id
    const categoriaId = categoriaIdMap.get(noticia.categoria_id) || defaultCategoriaId;
    
    return {
      ...noticia,
      autor_id: autorId,
      categoria_id: categoriaId
    };
  });

  // Salvar o arquivo corrigido
  await writeJsonFile(path.join(fixedBackupDir, "noticia.json"), noticiasFixed);
  
  // Retornar mapeamento de ID antigo para novo ID (não muda o ID da notícia, apenas as referências)
  const idMap = new Map();
  
  for (let i = 0; i < noticiasData.length; i++) {
    idMap.set(noticiasData[i].id, noticiasFixed[i].id);
  }
  
  return idMap;
}

async function fixNoticiasTags() {
  console.log("\n🔄 Copiando relações notícias-tags...");
  const filePath = path.join(backupDir, "noticias_tags.json");
  const noticiasTagsData = await readJsonFile(filePath);
  
  if (noticiasTagsData.length === 0) {
    console.log("ℹ️ Nenhuma relação notícia-tag para copiar");
    return;
  }

  // Copiar o arquivo sem alterações
  await writeJsonFile(path.join(fixedBackupDir, "noticias_tags.json"), noticiasTagsData);
}

async function fixTags() {
  console.log("\n🔄 Copiando tags...");
  const filePath = path.join(backupDir, "tags.json");
  const tagsData = await readJsonFile(filePath);
  
  if (tagsData.length === 0) {
    console.log("ℹ️ Nenhuma tag para copiar");
    return;
  }

  // Copiar o arquivo sem alterações
  await writeJsonFile(path.join(fixedBackupDir, "tags.json"), tagsData);
}

async function corrigirIds() {
  try {
    console.log("🚀 Iniciando correção dos IDs nos arquivos de backup...");
    
    // Corrigir IDs de autores
    const autorIdMap = await fixAutoresIds();
    
    // Corrigir IDs de categorias
    const categoriaIdMap = await fixCategoriasIds();
    
    // Corrigir referências nas notícias
    if (autorIdMap && categoriaIdMap) {
      await fixNoticiasIds(autorIdMap, categoriaIdMap);
    }
    
    // Copiar outros arquivos sem alterações
    await fixTags();
    await fixNoticiasTags();
    
    console.log("\n✅ Correção de IDs concluída com sucesso!");
    console.log(`📂 Arquivos corrigidos salvos em: ${fixedBackupDir}`);
    console.log("\n🔍 Agora execute o comando de importação usando os arquivos corrigidos:");
    console.log("    bun run import-data-fixed");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante a correção:", error);
    process.exit(1);
  }
}

// Executar a correção
corrigirIds(); 