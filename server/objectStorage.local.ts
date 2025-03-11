import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

// Garantir que o diretório de uploads existe
async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretório de uploads:', error);
  }
}

// Chamar imediatamente para garantir que o diretório existe
ensureUploadsDir();

// Interface para o resultado do upload
export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Faz upload de um arquivo para o sistema de arquivos local
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
    console.log("Fazendo upload para o sistema de arquivos local", {
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
    const key = `uploads/${timestamp}-${randomSuffix}.${fileExtension}`;
    const filePath = path.resolve(uploadsDir, `${timestamp}-${randomSuffix}.${fileExtension}`);

    // Salvar o arquivo no sistema de arquivos local
    await fs.writeFile(filePath, buffer);
    console.log(`Arquivo salvo em: ${filePath}`);

    // Gerar a URL pública do arquivo
    const url = getPublicUrl(key);

    return { key, url };
  } catch (error) {
    console.error('Erro ao fazer upload para o sistema de arquivos local:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

/**
 * Recupera um arquivo do sistema de arquivos local
 * @param key Chave do arquivo
 */
export async function getFile(key: string): Promise<{data: Buffer, contentType: string}> {
  try {
    console.log("Obtendo arquivo com chave:", key);
    
    // Extrair o nome do arquivo da chave
    const filename = key.split('/').pop() || '';
    const filePath = path.resolve(uploadsDir, filename);
    
    // Ler o arquivo do sistema de arquivos
    const data = await fs.readFile(filePath);
    
    // Determinar o contentType pelo tipo de arquivo
    let contentType = 'application/octet-stream';
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
        case 'svg':
          contentType = 'image/svg+xml';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        // Adicionar mais conforme necessário
      }
    }
    
    return { data, contentType };
  } catch (error: any) {
    console.error('Erro ao obter arquivo do sistema de arquivos local:', error);
    throw new Error(`Falha ao obter arquivo: ${error.message}`);
  }
}

/**
 * Gera a URL pública para um arquivo
 * @param key Chave do arquivo
 */
export function getPublicUrl(key: string): string {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}/api/files/${key.replace('uploads/', '')}`;
}

/**
 * Baixa uma imagem de uma URL e salva localmente
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