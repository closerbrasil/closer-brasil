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
    // Nota: Desativamos a compressão, que pode estar causando problemas com alguns tipos de arquivo
    const { ok, error } = await client.uploadFromBytes(key, buffer, {
      compress: false // Desativar compressão para garantir integridade dos dados
    });

    if (!ok) {
      throw new Error(`Falha ao fazer upload: ${error}`);
    }

    // Gerar a URL pública do arquivo com URL completa
    // A URL completa é necessária para que funcione nos previews
    const baseUrl = process.env.BASE_URL || 'https://workspace.contatovoicefy.repl.co';
    const url = `${baseUrl}/api/object-storage/${key}`;

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
    console.log("Obtendo arquivo com chave:", key);
    // Obter o arquivo do bucket
    const result = await client.downloadAsBytes(key);
    
    // Adicionar logs para debug
    console.log("Resultado do download:", result.ok ? "Sucesso" : "Falha");

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
    
    // Adicionado para debug
    console.log("Tipo do valor do resultado:", typeof result.value);
    
    // Simplificar o tratamento para garantir que o buffer esteja correto
    try {
      // Abordagem mais simples para lidar com os buffers
      if (Buffer.isBuffer(result.value)) {
        // Já é um Buffer
        buffer = result.value;
        console.log("É um Buffer, tamanho:", buffer.length);
      } else if (result.value instanceof Uint8Array) {
        // É um Uint8Array
        buffer = Buffer.from(result.value);
        console.log("É um Uint8Array, tamanho:", buffer.length);
      } else if (Array.isArray(result.value)) {
        // É um array, provavelmente de bytes
        buffer = Buffer.from(result.value as unknown as number[]);
        console.log("É um Array, tamanho:", buffer.length);
      } else {
        // Tentar direto - dependendo da implementação da API do Replit
        buffer = Buffer.from(result.value as any);
        console.log("Convertido para Buffer, tamanho:", buffer.length);
      }
    } catch (e) {
      console.error("Erro ao processar o buffer:", e);
      throw new Error("Não foi possível processar o buffer de dados");
    }
    
    // Verificar se o buffer é válido
    if (!buffer || buffer.length === 0) {
      throw new Error("Buffer vazio ou inválido");
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
  // Usar a URL atual da aplicação em vez de uma URL codificada
  // Isso garantirá que a URL funcione independentemente de onde a aplicação estiver rodando
  // Tentar usar a URL do ambiente, ou cair para localhost no ambiente de desenvolvimento
  let baseUrl = process.env.BASE_URL;
  
  if (!baseUrl) {
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      baseUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    } else {
      baseUrl = 'http://localhost:5000';
    }
  }
  
  return `${baseUrl}/api/object-storage/${key}`;
}