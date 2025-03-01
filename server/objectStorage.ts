import { Client } from '@replit/object-storage';

// Configurar o cliente do Object Storage
const client = new Client();

// Mapa para armazenar metadados dos arquivos em memória (já que a API não permite armazenar Content-Type)
const fileMetadata: Record<string, { contentType: string }> = {};

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

    // Armazenar os metadados do arquivo
    fileMetadata[key] = { contentType: mimeType };

    // Fazer upload do arquivo para o bucket
    const { ok, error } = await client.uploadFromBytes(key, buffer, {
      compress: true // Opção suportada pela API
    });

    if (!ok) {
      throw new Error(`Falha ao fazer upload: ${error}`);
    }

    // Gerar a URL pública do arquivo
    // Vamos usar uma URL relativa em vez de absoluta para evitar problemas de CORS
    // e para que funcione tanto em desenvolvimento quanto em produção
    const url = `/api/object-storage/${key}`;

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
    const result = await client.downloadAsBytes(key);

    if (!result.ok) {
      throw new Error(`Falha ao obter arquivo: ${result.error}`);
    }

    // Recuperar o tipo de conteúdo dos metadados que armazenamos
    // ou inferir pelo nome do arquivo
    let contentType = 'application/octet-stream';
    
    if (fileMetadata[key]) {
      contentType = fileMetadata[key].contentType;
    } else {
      // Inferir pelo tipo de arquivo
      const extension = key.split('.').pop()?.toLowerCase();
      if (extension) {
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            contentType = 'image/jpeg';
            break;
          case 'png':
            contentType = 'image/png';
            break;
          case 'gif':
            contentType = 'image/gif';
            break;
          case 'pdf':
            contentType = 'application/pdf';
            break;
          // Adicionar mais conforme necessário
        }
      }
    }

    // Obter o valor e garantir que ele seja um Buffer
    let buffer: Buffer;
    
    if (Array.isArray(result.value)) {
      // Se for um array, pegar o primeiro elemento
      buffer = Buffer.from(result.value[0]);
    } else if (Buffer.isBuffer(result.value)) {
      // Se já for um Buffer
      buffer = result.value;
    } else {
      // Caso seja outro tipo, converter para Buffer
      buffer = Buffer.from(result.value);
    }

    return { 
      data: buffer, 
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
  return `/api/object-storage/${key}`;
}