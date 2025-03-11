import { put, del, list, head } from '@vercel/blob';
import type { PutBlobResult } from '@vercel/blob';
import { fileTypeFromBuffer } from 'file-type';

// Interface para o resultado de upload
export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Faz upload de um arquivo para o Vercel Blob Storage
 * @param buffer Buffer do arquivo
 * @param originalFilename Nome original do arquivo
 * @param mimeType Tipo MIME do arquivo
 */
export async function uploadFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    console.log("Fazendo upload para o Vercel Blob Storage", {
      mimeType,
      tamanhoBuffer: buffer.length
    });

    // Verificar se o buffer é válido
    if (!buffer || buffer.length === 0) {
      throw new Error('Buffer vazio recebido para upload');
    }

    // Gerar uma chave única para o arquivo
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const fileExtension = originalFilename.split('.').pop() || 'jpg';
    const pathname = `uploads/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Definir o tipo de acesso como público
    const access = 'public';

    // Fazer upload do arquivo para o Vercel Blob
    const blob: PutBlobResult = await put(pathname, buffer, {
      access,
      contentType: mimeType,
      cacheControlMaxAge: 31536000, // 1 ano em segundos
    });

    console.log("Upload para Vercel Blob Storage bem-sucedido:", blob.url);

    // Retornar a key e url
    return { 
      key: pathname,
      url: blob.url
    };
  } catch (error) {
    console.error('Erro ao fazer upload para o Vercel Blob Storage:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

/**
 * Obtém informações sobre um arquivo do Vercel Blob Storage
 * @param key Chave do arquivo
 */
export async function getFile(key: string): Promise<{data: Buffer, contentType: string}> {
  try {
    console.log("Obtendo arquivo com chave:", key);
    
    // Obter a URL do Vercel Blob
    // Como estamos usando acesso público, podemos buscar diretamente
    const blobInfo = await head(key);
    
    if (!blobInfo) {
      throw new Error(`Arquivo não encontrado: ${key}`);
    }
    
    // Baixar o arquivo
    const response = await fetch(blobInfo.url);
    if (!response.ok) {
      throw new Error(`Erro ao baixar o arquivo: ${response.statusText}`);
    }
    
    // Converter para buffer
    const data = Buffer.from(await response.arrayBuffer());
    
    // Determinar o tipo de conteúdo
    const contentType = blobInfo.contentType || 'application/octet-stream';
    
    return { data, contentType };
  } catch (error) {
    console.error('Erro ao obter arquivo do Vercel Blob Storage:', error);
    throw new Error(`Falha ao obter arquivo: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  }
}

/**
 * Remove um arquivo do Vercel Blob Storage
 * @param key Chave do arquivo
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    console.log("Removendo arquivo com chave:", key);
    await del(key);
    console.log(`Arquivo ${key} removido com sucesso`);
  } catch (error) {
    console.error('Erro ao remover arquivo do Vercel Blob Storage:', error);
    throw new Error(`Falha ao remover arquivo: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  }
}

/**
 * Gera a URL pública para um arquivo
 * @param key Chave do arquivo
 */
export function getPublicUrl(key: string): string {
  // Para arquivos públicos, o Vercel Blob já retorna uma URL pública
  // Mas mantemos essa função para compatibilidade com a interface anterior
  if (!key) return '';
  
  // Se a chave já for uma URL completa, retornamos como está
  if (key.startsWith('http')) {
    return key;
  }
  
  // Se não, precisaríamos ter um registro dessa URL
  // Como não temos sem chamar a API, vamos retornar apenas a chave
  return key;
}

/**
 * Baixa uma imagem de uma URL e salva no Vercel Blob Storage
 * @param url URL da imagem
 */
export async function downloadAndSaveImage(url: string): Promise<UploadResult> {
  try {
    console.log(`Baixando imagem de: ${url}`);
    
    // Usar fetch para baixar a imagem
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao baixar imagem: ${response.statusText}`);
    }
    
    // Obter o buffer da imagem
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Extrair o nome do arquivo da URL
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const originalFilename = pathname.split('/').pop() || 'image.jpg';
    
    // Determinar o tipo MIME
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Fazer upload do arquivo
    return await uploadFile(buffer, originalFilename, contentType);
  } catch (error) {
    console.error('Erro ao baixar e salvar imagem:', error);
    throw new Error('Falha ao baixar e salvar imagem');
  }
}

/**
 * Lista todos os arquivos no Vercel Blob Storage
 * @param prefixo Prefixo para filtrar arquivos (ex: 'uploads/')
 * @param limite Número máximo de arquivos a retornar
 */
export async function listarArquivos(prefixo: string = '', limite: number = 100): Promise<{files: {key: string, url: string}[], cursor?: string}> {
  try {
    console.log(`Listando arquivos com prefixo: ${prefixo}`);
    
    const resultado = await list({
      prefix: prefixo,
      limit: limite
    });
    
    const files = resultado.blobs.map(blob => ({
      key: blob.pathname,
      url: blob.url
    }));
    
    return {
      files,
      cursor: resultado.cursor
    };
  } catch (error) {
    console.error('Erro ao listar arquivos do Vercel Blob Storage:', error);
    throw new Error(`Falha ao listar arquivos: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  }
} 