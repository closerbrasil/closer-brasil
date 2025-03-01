import { Client } from '@replit/object-storage';

// Configurar o cliente do Object Storage
const client = new Client();

// Obter o nome do bucket do arquivo .replit
const defaultBucketName = process.env.REPLIT_OBJECT_STORAGE_BUCKET_NAME || 'replit-objstore-1b0455e7-f57f-4137-a193-d9065de8ec41';

// Interface para o resultado do upload
export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Faz upload de um arquivo para o Object Storage
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
    // Gerar uma chave única para o arquivo
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const fileExtension = originalFilename.split('.').pop() || 'jpg';
    const key = `uploads/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Fazer upload do arquivo para o bucket
    const { ok, error } = await client.uploadFromBuffer(key, buffer, {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000',
    });

    if (!ok) {
      throw new Error(`Falha ao fazer upload: ${error}`);
    }

    // Gerar a URL pública do arquivo
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/object-storage/${key}`;

    return { key, url };
  } catch (error) {
    console.error('Erro ao fazer upload para o Object Storage:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

/**
 * Recupera um arquivo do Object Storage
 * @param key Chave do arquivo no bucket
 */
export async function getFile(key: string): Promise<{data: Buffer, contentType: string}> {
  try {
    // Obter o arquivo do bucket
    const { ok, value, error, metadata } = await client.downloadAsBuffer(key);

    if (!ok) {
      throw new Error(`Falha ao obter arquivo: ${error}`);
    }

    // Recuperar o tipo de conteúdo
    const contentType = metadata?.['Content-Type'] || 'application/octet-stream';

    return { 
      data: value, 
      contentType 
    };
  } catch (error) {
    console.error('Erro ao obter arquivo do Object Storage:', error);
    throw new Error('Arquivo não encontrado');
  }
}

/**
 * Obtém a URL pública de um arquivo
 * @param key Chave do arquivo no bucket
 */
export function getPublicUrl(key: string): string {
  return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/object-storage/${key}`;
}