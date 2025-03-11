import { db } from "../server/db";
import { autores, categorias, noticia, noticiasTags, tags } from "../shared/schema";
import fs from "fs";
import path from "path";
import '../server/env';

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

async function importAutores() {
  console.log("Importando autores...");
  const filePath = path.join(backupDir, "autores.json");
  const autoresData = await readJsonFile(filePath);
  
  if (autoresData.length === 0) {
    console.log("Nenhum autor para importar");
    return;
  }

  // Insere os autores preservando o ID original
  for (const autor of autoresData) {
    try {
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
      }).onConflictDoUpdate({
        target: autores.id,
        set: {
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
        }
      });
      console.log(`Autor importado: ${autor.nome}`);
    } catch (error) {
      console.error(`Erro ao importar autor ${autor.nome}:`, error);
    }
  }
}

async function importCategorias() {
  console.log("Importando categorias...");
  const filePath = path.join(backupDir, "categorias.json");
  const categoriasData = await readJsonFile(filePath);
  
  if (categoriasData.length === 0) {
    console.log("Nenhuma categoria para importar");
    return;
  }

  for (const categoria of categoriasData) {
    try {
      await db.insert(categorias).values({
        id: categoria.id,
        nome: categoria.nome,
        slug: categoria.slug,
        descricao: categoria.descricao,
        imageUrl: categoria.image_url,
        cor: categoria.cor || "#3b82f6",
        criadoEm: new Date(categoria.criado_em),
        atualizadoEm: new Date(categoria.atualizado_em)
      }).onConflictDoUpdate({
        target: categorias.id,
        set: {
          nome: categoria.nome,
          slug: categoria.slug,
          descricao: categoria.descricao,
          imageUrl: categoria.image_url,
          cor: categoria.cor || "#3b82f6",
          atualizadoEm: new Date(categoria.atualizado_em)
        }
      });
      console.log(`Categoria importada: ${categoria.nome}`);
    } catch (error) {
      console.error(`Erro ao importar categoria ${categoria.nome}:`, error);
    }
  }
}

async function importTags() {
  console.log("Importando tags...");
  const filePath = path.join(backupDir, "tags.json");
  const tagsData = await readJsonFile(filePath);
  
  if (tagsData.length === 0) {
    console.log("Nenhuma tag para importar");
    return;
  }

  for (const tag of tagsData) {
    try {
      await db.insert(tags).values({
        id: tag.id,
        nome: tag.nome,
        slug: tag.slug,
        descricao: tag.descricao,
        criadoEm: new Date(tag.criado_em),
        atualizadoEm: new Date(tag.atualizado_em)
      }).onConflictDoUpdate({
        target: tags.id,
        set: {
          nome: tag.nome,
          slug: tag.slug,
          descricao: tag.descricao,
          atualizadoEm: new Date(tag.atualizado_em)
        }
      });
      console.log(`Tag importada: ${tag.nome}`);
    } catch (error) {
      console.error(`Erro ao importar tag ${tag.nome}:`, error);
    }
  }
}

async function importNoticias() {
  console.log("Importando notícias...");
  const filePath = path.join(backupDir, "noticia.json");
  const noticiasData = await readJsonFile(filePath);
  
  if (noticiasData.length === 0) {
    console.log("Nenhuma notícia para importar");
    return;
  }

  for (const noticiaItem of noticiasData) {
    try {
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
      }).onConflictDoUpdate({
        target: noticia.id,
        set: {
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
        }
      });
      console.log(`Notícia importada: ${noticiaItem.titulo}`);
    } catch (error) {
      console.error(`Erro ao importar notícia ${noticiaItem.titulo}:`, error);
    }
  }
}

async function importNoticiasTags() {
  console.log("Importando relações entre notícias e tags...");
  const filePath = path.join(backupDir, "noticias_tags.json");
  const noticiasTagsData = await readJsonFile(filePath);
  
  if (noticiasTagsData.length === 0) {
    console.log("Nenhuma relação notícia-tag para importar");
    return;
  }

  for (const relacao of noticiasTagsData) {
    try {
      await db.insert(noticiasTags).values({
        noticiaId: relacao.noticia_id,
        tagId: relacao.tag_id
      }).onConflictDoNothing();
      console.log(`Relação notícia-tag importada: ${relacao.noticia_id} - ${relacao.tag_id}`);
    } catch (error) {
      console.error(`Erro ao importar relação notícia-tag ${relacao.noticia_id} - ${relacao.tag_id}:`, error);
    }
  }
}

async function importarTudo() {
  try {
    console.log("Iniciando importação dos dados de backup...");
    
    // Importando dados na ordem correta para manter as relações
    await importAutores();
    await importCategorias();
    await importTags();
    await importNoticias();
    await importNoticiasTags();
    
    console.log("Importação concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro durante a importação:", error);
    process.exit(1);
  }
}

// Executa a importação
importarTudo(); 