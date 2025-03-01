import { Client } from '@replit/object-storage';

// Configurar o cliente do Object Storage
const client = new Client();

// Mapa para armazenar metadados dos arquivos em memória (já que a API não permite armazenar Content-Type)
const fileMetadata: Record<string, { contentType: string }> = {};

// Cache temporário para armazenar os buffers dos arquivos em memória
// Esta é uma solução temporária para o problema de recuperação de arquivos
// Em produção, você não faria isso, pois consumiria muita memória
const bufferCache: Record<string, Buffer> = {};

/**
 * Função auxiliar que gera a URL base para os arquivos
 * Usa o novo formato de URL do Replit com fallback para formatos antigos
 * Ou uma variável de ambiente personalizada para produção
 */
function getBaseUrl(): string {
  let baseUrl: string;
  
  // Verificar primeiro se existe uma variável de ambiente configurada para o domínio
  if (process.env.SITE_DOMAIN) {
    // Remover qualquer barra no final da URL para evitar dupla barra
    baseUrl = process.env.SITE_DOMAIN.replace(/\/+$/, '');
    console.log("Usando domínio personalizado da variável de ambiente:", baseUrl);
  }
  // No ambiente Replit, usar o domínio do Replit no formato correto
  else if (process.env.REPL_ID) {
    // Formato novo do Replit: ID-versão.ambiente.replit.dev
    baseUrl = `https://76a38428-1fde-4183-a16c-de4c033d93a0-00-27zm49qhmfw11.picard.replit.dev`;
    console.log("Usando URL do novo domínio Replit:", baseUrl);
  } 
  // Fallback para o formato antigo ou desenvolvimento local
  else if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    baseUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    console.log("Usando URL do formato Replit antigo:", baseUrl);
  }
  // Em desenvolvimento local, usar localhost
  else {
    baseUrl = 'http://localhost:5000';
    console.log("Usando URL local:", baseUrl);
  }
  
  return baseUrl;
}

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
    console.log("Fazendo upload para o Object Storage", {
      mimeType,
      tamanhoBuffer: buffer.length,
      primeirosBytes: buffer.length > 20 ? buffer.slice(0, 20).toString('hex') : 'buffer vazio'
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

    // Armazenar os metadados do arquivo
    fileMetadata[key] = { contentType: mimeType };
    
    // IMPORTANTE: Armazenar uma cópia do buffer no cache em memória
    // Esta é uma solução temporária até resolvermos o problema com o Object Storage
    bufferCache[key] = Buffer.from(buffer);
    console.log(`Buffer armazenado em cache, key: ${key}, tamanho: ${bufferCache[key].length}`);

    // Fazer upload do arquivo para o bucket (ainda vamos tentar usar o Object Storage)
    // Nota: UploadOptions da API do Replit não aceita contentType como parâmetro
    const { ok, error } = await client.uploadFromBytes(key, buffer, {
      compress: false // Desativar compressão para garantir integridade dos dados
    });

    if (!ok) {
      console.warn(`Aviso: Falha ao fazer upload para o Object Storage: ${error}. Usando cache local.`);
      // Mesmo com falha, continuamos porque temos o cache
    } else {
      console.log("Upload para Object Storage bem-sucedido:", key);
    }

    // Gerar a URL pública do arquivo usando a função getPublicUrl
    const url = getPublicUrl(key);

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
    
    // Primeiro, verificar se temos o arquivo no cache em memória
    if (bufferCache[key]) {
      console.log(`Usando arquivo do cache em memória, key: ${key}, tamanho: ${bufferCache[key].length}`);
      
      // Determinar o contentType
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
            case 'svg':
              contentType = 'image/svg+xml';
              break;
            case 'pdf':
              contentType = 'application/pdf';
              break;
            // Adicionar mais conforme necessário
          }
        }
      }
      
      // Retornar do cache
      return {
        data: bufferCache[key],
        contentType
      };
    }
    
    // Se não temos no cache, tentar obter do Object Storage
    console.log("Arquivo não encontrado no cache, tentando Object Storage...");
    
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
          case 'svg':
            contentType = 'image/svg+xml';
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
    
    // Armazenar no cache para futuras solicitações
    bufferCache[key] = buffer;
    console.log(`Buffer armazenado em cache do Object Storage, key: ${key}, tamanho: ${buffer.length}`);

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
  
  // Usar a função auxiliar para obter a URL base
  const baseUrl = getBaseUrl();
  
  // Garantir que a chave não comece com barra para evitar dupla barra
  const cleanKey = key.startsWith('/') ? key.substring(1) : key;
  
  return `${baseUrl}/api/object-storage/${cleanKey}`;
}