import { db } from "../server/db";
import { autores, categorias, noticia, noticiasTags, tags } from "../shared/schema";
import fs from "fs";
import path from "path";
import '../server/env';
import { eq, sql } from "drizzle-orm";

const backupDir = path.join(__dirname, "../backup");

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

// Função para verificar se um autor já existe
async function autorExists(id: string): Promise<boolean> {
  const result = await db.select({ id: autores.id })
    .from(autores)
    .where(eq(autores.id, id));
  return result.length > 0;
}

// Função para verificar se uma categoria já existe
async function categoriaExists(id: string): Promise<boolean> {
  const result = await db.select({ id: categorias.id })
    .from(categorias)
    .where(eq(categorias.id, id));
  return result.length > 0;
}

// Função para verificar se uma tag já existe
async function tagExists(id: string): Promise<boolean> {
  const result = await db.select({ id: tags.id })
    .from(tags)
    .where(eq(tags.id, id));
  return result.length > 0;
}

// Função para verificar se uma notícia já existe
async function noticiaExists(id: string): Promise<boolean> {
  const result = await db.select({ id: noticia.id })
    .from(noticia)
    .where(eq(noticia.id, id));
  return result.length > 0;
}

async function importAutores() {
  console.log("📝 Importando autores...");
  const filePath = path.join(backupDir, "autores.json");
  const autoresData = await readJsonFile(filePath);
  
  if (autoresData.length === 0) {
    console.log("ℹ️ Nenhum autor para importar");
    return;
  }

  let importados = 0;
  let atualizados = 0;
  let ignorados = 0;

  // Insere os autores preservando o ID original
  for (const autor of autoresData) {
    try {
      const exists = await autorExists(autor.id);
      
      if (exists) {
        // Se o autor já existe, atualiza os dados
        await db.update(autores)
          .set({
            nome: autor.nome,
            slug: autor.slug,
            bio: autor.bio,
            avatarUrl: autor.avatar_url,
            cargo: autor.cargo,
            email: autor.email,
            twitterUrl: autor.twitter_url,
            linkedinUrl: autor.linkedin_url,
            githubUrl: autor.github_url,
            websiteUrl: autor.website_url,
            atualizadoEm: new Date(autor.atualizado_em)
          })
          .where(eq(autores.id, autor.id));
        console.log(`✅ Autor atualizado: ${autor.nome}`);
        atualizados++;
      } else {
        // Se o autor não existe, insere
        await db.insert(autores).values({
          id: autor.id,
          nome: autor.nome,
          slug: autor.slug,
          bio: autor.bio,
          avatarUrl: autor.avatar_url,
          cargo: autor.cargo,
          email: autor.email,
          twitterUrl: autor.twitter_url,
          linkedinUrl: autor.linkedin_url,
          githubUrl: autor.github_url,
          websiteUrl: autor.website_url,
          criadoEm: new Date(autor.criado_em),
          atualizadoEm: new Date(autor.atualizado_em)
        });
        console.log(`✅ Autor importado: ${autor.nome}`);
        importados++;
      }
    } catch (error) {
      console.error(`❌ Erro ao importar autor ${autor.nome}:`, error);
      ignorados++;
    }
  }

  console.log(`📊 Resumo de autores: ${importados} importados, ${atualizados} atualizados, ${ignorados} ignorados`);
}

async function importCategorias() {
  console.log("\n📝 Importando categorias...");
  const filePath = path.join(backupDir, "categorias.json");
  const categoriasData = await readJsonFile(filePath);
  
  if (categoriasData.length === 0) {
    console.log("ℹ️ Nenhuma categoria para importar");
    return;
  }

  let importados = 0;
  let atualizados = 0;
  let ignorados = 0;

  for (const categoria of categoriasData) {
    try {
      const exists = await categoriaExists(categoria.id);
      
      if (exists) {
        // Se a categoria já existe, atualiza os dados
        await db.update(categorias)
          .set({
            nome: categoria.nome,
            slug: categoria.slug,
            descricao: categoria.descricao,
            imageUrl: categoria.image_url,
            cor: categoria.cor || "#3b82f6",
            atualizadoEm: new Date(categoria.atualizado_em)
          })
          .where(eq(categorias.id, categoria.id));
        console.log(`✅ Categoria atualizada: ${categoria.nome}`);
        atualizados++;
      } else {
        // Se a categoria não existe, insere
        await db.insert(categorias).values({
          id: categoria.id,
          nome: categoria.nome,
          slug: categoria.slug,
          descricao: categoria.descricao,
          imageUrl: categoria.image_url,
          cor: categoria.cor || "#3b82f6",
          criadoEm: new Date(categoria.criado_em),
          atualizadoEm: new Date(categoria.atualizado_em)
        });
        console.log(`✅ Categoria importada: ${categoria.nome}`);
        importados++;
      }
    } catch (error) {
      console.error(`❌ Erro ao importar categoria ${categoria.nome}:`, error);
      ignorados++;
    }
  }

  console.log(`📊 Resumo de categorias: ${importados} importadas, ${atualizados} atualizadas, ${ignorados} ignoradas`);
}

async function importTags() {
  console.log("\n📝 Importando tags...");
  const filePath = path.join(backupDir, "tags.json");
  const tagsData = await readJsonFile(filePath);
  
  if (tagsData.length === 0) {
    console.log("ℹ️ Nenhuma tag para importar");
    return;
  }

  let importados = 0;
  let atualizados = 0;
  let ignorados = 0;

  for (const tag of tagsData) {
    try {
      const exists = await tagExists(tag.id);
      
      if (exists) {
        // Se a tag já existe, atualiza os dados
        await db.update(tags)
          .set({
            nome: tag.nome,
            slug: tag.slug,
            descricao: tag.descricao,
            atualizadoEm: new Date(tag.atualizado_em)
          })
          .where(eq(tags.id, tag.id));
        console.log(`✅ Tag atualizada: ${tag.nome}`);
        atualizados++;
      } else {
        // Se a tag não existe, insere
        await db.insert(tags).values({
          id: tag.id,
          nome: tag.nome,
          slug: tag.slug,
          descricao: tag.descricao,
          criadoEm: new Date(tag.criado_em),
          atualizadoEm: new Date(tag.atualizado_em)
        });
        console.log(`✅ Tag importada: ${tag.nome}`);
        importados++;
      }
    } catch (error) {
      console.error(`❌ Erro ao importar tag ${tag.nome}:`, error);
      ignorados++;
    }
  }

  console.log(`📊 Resumo de tags: ${importados} importadas, ${atualizados} atualizadas, ${ignorados} ignoradas`);
}

async function importNoticias() {
  console.log("\n📝 Importando notícias...");
  const filePath = path.join(backupDir, "noticia.json");
  const noticiasData = await readJsonFile(filePath);
  
  if (noticiasData.length === 0) {
    console.log("ℹ️ Nenhuma notícia para importar");
    return;
  }

  let importados = 0;
  let atualizados = 0;
  let ignorados = 0;

  for (const noticiaItem of noticiasData) {
    try {
      // Verifica se os autores e categorias existem
      const autorExiste = await autorExists(noticiaItem.autor_id);
      const categoriaExiste = await categoriaExists(noticiaItem.categoria_id);
      
      if (!autorExiste) {
        console.log(`⚠️ Autor ID ${noticiaItem.autor_id} não existe. Pulando notícia: ${noticiaItem.titulo}`);
        ignorados++;
        continue;
      }
      
      if (!categoriaExiste) {
        console.log(`⚠️ Categoria ID ${noticiaItem.categoria_id} não existe. Pulando notícia: ${noticiaItem.titulo}`);
        ignorados++;
        continue;
      }

      // Verifica se a notícia já existe
      const exists = await noticiaExists(noticiaItem.id);
      
      if (exists) {
        // Se a notícia já existe, atualiza
        await db.update(noticia)
          .set({
            titulo: noticiaItem.titulo,
            slug: noticiaItem.slug,
            resumo: noticiaItem.resumo,
            conteudo: noticiaItem.conteudo,
            imageUrl: noticiaItem.image_url,
            imagemCredito: noticiaItem.imagem_credito,
            autorId: noticiaItem.autor_id,
            categoriaId: noticiaItem.categoria_id,
            atualizadoEm: new Date(noticiaItem.atualizado_em),
            metaTitulo: noticiaItem.meta_titulo,
            metaDescricao: noticiaItem.meta_descricao,
            urlCanonica: noticiaItem.url_canonica,
            palavraChave: noticiaItem.palavra_chave,
            tempoLeitura: noticiaItem.tempo_leitura,
            ogTitulo: noticiaItem.og_titulo,
            ogDescricao: noticiaItem.og_descricao,
            ogImagem: noticiaItem.og_imagem,
            twitterTitulo: noticiaItem.twitter_titulo,
            twitterDescricao: noticiaItem.twitter_descricao,
            twitterImagem: noticiaItem.twitter_imagem,
            schemaType: noticiaItem.schema_type || "Article",
            schemaAutor: noticiaItem.schema_autor,
            schemaPublisher: noticiaItem.schema_publisher,
            status: noticiaItem.status || "publicado",
            visibilidade: noticiaItem.visibilidade || "publico"
          })
          .where(eq(noticia.id, noticiaItem.id));
        console.log(`✅ Notícia atualizada: ${noticiaItem.titulo}`);
        atualizados++;
      } else {
        // Se a notícia não existe, insere
        await db.insert(noticia).values({
          id: noticiaItem.id,
          titulo: noticiaItem.titulo,
          slug: noticiaItem.slug,
          resumo: noticiaItem.resumo,
          conteudo: noticiaItem.conteudo,
          imageUrl: noticiaItem.image_url,
          imagemCredito: noticiaItem.imagem_credito,
          autorId: noticiaItem.autor_id,
          categoriaId: noticiaItem.categoria_id,
          publicadoEm: new Date(noticiaItem.publicado_em),
          atualizadoEm: new Date(noticiaItem.atualizado_em),
          metaTitulo: noticiaItem.meta_titulo,
          metaDescricao: noticiaItem.meta_descricao,
          urlCanonica: noticiaItem.url_canonica,
          palavraChave: noticiaItem.palavra_chave,
          tempoLeitura: noticiaItem.tempo_leitura,
          ogTitulo: noticiaItem.og_titulo,
          ogDescricao: noticiaItem.og_descricao,
          ogImagem: noticiaItem.og_imagem,
          twitterTitulo: noticiaItem.twitter_titulo,
          twitterDescricao: noticiaItem.twitter_descricao,
          twitterImagem: noticiaItem.twitter_imagem,
          schemaType: noticiaItem.schema_type || "Article",
          schemaAutor: noticiaItem.schema_autor,
          schemaPublisher: noticiaItem.schema_publisher,
          status: noticiaItem.status || "publicado",
          visibilidade: noticiaItem.visibilidade || "publico"
        });
        console.log(`✅ Notícia importada: ${noticiaItem.titulo}`);
        importados++;
      }
    } catch (error) {
      console.error(`❌ Erro ao importar notícia ${noticiaItem.titulo}:`, error);
      ignorados++;
    }
  }

  console.log(`📊 Resumo de notícias: ${importados} importadas, ${atualizados} atualizadas, ${ignorados} ignoradas`);
}

async function importNoticiasTags() {
  console.log("\n📝 Importando relações entre notícias e tags...");
  const filePath = path.join(backupDir, "noticias_tags.json");
  const noticiasTagsData = await readJsonFile(filePath);
  
  if (noticiasTagsData.length === 0) {
    console.log("ℹ️ Nenhuma relação notícia-tag para importar");
    return;
  }

  let importados = 0;
  let ignorados = 0;

  for (const relacao of noticiasTagsData) {
    try {
      // Verifica se a notícia e a tag existem
      const noticiaExiste = await noticiaExists(relacao.noticia_id);
      const tagExiste = await tagExists(relacao.tag_id);
      
      if (!noticiaExiste) {
        console.log(`⚠️ Notícia ID ${relacao.noticia_id} não existe. Pulando relação notícia-tag.`);
        ignorados++;
        continue;
      }
      
      if (!tagExiste) {
        console.log(`⚠️ Tag ID ${relacao.tag_id} não existe. Pulando relação notícia-tag.`);
        ignorados++;
        continue;
      }

      // Verifica se a relação já existe
      const result = await db.execute(sql`
        SELECT 1 FROM noticias_tags 
        WHERE noticia_id = ${relacao.noticia_id} AND tag_id = ${relacao.tag_id}
      `);
      
      if (result.rows.length > 0) {
        console.log(`ℹ️ Relação notícia-tag já existe: ${relacao.noticia_id} - ${relacao.tag_id}`);
        ignorados++;
      } else {
        // Insere a relação
        await db.insert(noticiasTags).values({
          noticiaId: relacao.noticia_id,
          tagId: relacao.tag_id
        });
        console.log(`✅ Relação notícia-tag importada: ${relacao.noticia_id} - ${relacao.tag_id}`);
        importados++;
      }
    } catch (error) {
      console.error(`❌ Erro ao importar relação notícia-tag ${relacao.noticia_id} - ${relacao.tag_id}:`, error);
      ignorados++;
    }
  }

  console.log(`📊 Resumo de relações notícia-tag: ${importados} importadas, ${ignorados} ignoradas`);
}

async function importarTudo() {
  try {
    console.log("🚀 Iniciando importação dos dados de backup...");
    
    // Importando dados na ordem correta para manter as relações
    await importAutores();
    await importCategorias();
    await importTags();
    await importNoticias();
    await importNoticiasTags();
    
    console.log("\n✅ Importação concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante a importação:", error);
    process.exit(1);
  }
}

// Executa a importação
importarTudo(); 