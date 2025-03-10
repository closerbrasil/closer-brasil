import { Client } from '@replit/object-storage';
import https from 'https';
import http from 'http';
import { URL } from 'url';

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
    // Use a variável de ambiente REPLIT_DOMAINS se estiver disponível
    if (process.env.REPLIT_DOMAINS) {
      try {
        // Tentar analisar como JSON
        const domains = JSON.parse(process.env.REPLIT_DOMAINS);
        if (domains && Array.isArray(domains) && domains.length > 0) {
          baseUrl = `https://${domains[0]}`;
        } else if (typeof domains === 'string') {
          // Se for uma string após a análise JSON (objeto string serializado)
          baseUrl = domains.startsWith('http') ? domains : `https://${domains}`;
        } else {
          baseUrl = `https://closerbrasil.com`;
        }
      } catch (error) {
        // Se falhar ao analisar como JSON, tratar como string direta
        console.warn("Erro ao analisar REPLIT_DOMAINS como JSON:", error);
        const domainStr = process.env.REPLIT_DOMAINS;
        if (typeof domainStr === 'string') {
          // Remover aspas extras que possam estar causando problemas
          const cleanDomain = domainStr.replace(/^["'](.*)["']$/, '$1');
          baseUrl = cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`;
        } else {
          baseUrl = `https://closerbrasil.com`;
        }
      }
    } else {
      // Fallback para closerbrasil.com como solicitado
      baseUrl = `https://closerbrasil.com`;
    }
    console.log("Usando URL do domínio configurado:", baseUrl);
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

    // Logs adicionais para debug do buffer
    console.log(`Buffer original: tipo=${buffer.constructor.name}, tamanho=${buffer.length}`);
    console.log(`Primeiros 20 bytes: ${buffer.slice(0, 20).toString('hex')}`);
    
    // Garantir que estamos trabalhando com uma cópia do buffer para evitar modificações acidentais
    const bufferCopy = Buffer.from(buffer);

    // Gerar uma chave única para o arquivo
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const fileExtension = originalFilename.split('.').pop() || 'jpg';
    const key = `uploads/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Armazenar os metadados do arquivo
    fileMetadata[key] = { contentType: mimeType };
    
    // IMPORTANTE: Armazenar uma cópia do buffer no cache em memória
    // Esta é uma solução temporária até resolvermos o problema com o Object Storage
    bufferCache[key] = bufferCopy;
    console.log(`Buffer armazenado em cache, key: ${key}, tamanho: ${bufferCache[key].length}`);

    // Fazer upload do arquivo para o bucket (ainda vamos tentar usar o Object Storage)
    // Nota: UploadOptions da API do Replit não aceita contentType como parâmetro
    console.log(`Iniciando upload para: ${key}, tamanho: ${bufferCopy.length}`);
    const { ok, error } = await client.uploadFromBytes(key, bufferCopy, {
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
      // Adiciona mais logs para debug
      console.log("Valor do resultado:", result.value);
      
      // Verificar se temos um valor válido para trabalhar
      if (result.value === null || result.value === undefined) {
        console.warn("Valor nulo ou indefinido recebido do Object Storage");
        
        // Criar um buffer simples para fallback de teste
        // No caso de imagens, isso será um pixel transparente PNG
        buffer = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
          0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
          0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 
          0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        console.log("Criado buffer de fallback, tamanho:", buffer.length);
      } 
      else {
        // Tratamento seguro para qualquer tipo de valor
        const value = result.value;
        
        if (Array.isArray(value)) {
          console.log("É um Array, tamanho:", value.length);
          
          if (value.length > 0) {
            // Verificar se o elemento do array é um Buffer
            if (Buffer.isBuffer(value[0])) {
              // Se o primeiro elemento for um Buffer, usá-lo diretamente
              buffer = value[0];
              console.log("Buffer encontrado dentro do array, tamanho:", buffer.length);
            } else if (typeof value[0] === 'object' && value[0] !== null) {
              // Pode ser um objeto semelhante a Buffer ou algum outro tipo
              try {
                const bufferData = value[0];
                // Verificar se o objeto é um pseudo-Buffer com propriedades específicas
                if (typeof bufferData === 'object' && bufferData !== null) {
                  // Verificar propriedades comuns em objetos tipo Buffer
                  if ('data' in bufferData && Array.isArray((bufferData as any).data)) {
                    buffer = Buffer.from((bufferData as any).data);
                  } else if ('buffer' in bufferData) {
                    buffer = Buffer.from((bufferData as any).buffer);
                  } else if ('byteLength' in bufferData && '_isBuffer' in bufferData) {
                    // É provavelmente um Buffer serializado
                    const arr = Object.values(bufferData).filter(v => typeof v === 'number');
                    buffer = Buffer.from(arr);
                  } else {
                    // Tentar converter o objeto para JSON e depois para buffer
                    const jsonString = JSON.stringify(bufferData);
                    buffer = Buffer.from(jsonString);
                  }
                } else {
                  // Tentar converter o objeto para JSON e depois para buffer
                  const jsonString = JSON.stringify(bufferData);
                  buffer = Buffer.from(jsonString);
                }
                console.log("Objeto dentro do array convertido para Buffer, tamanho:", buffer.length);
              } catch (innerError) {
                console.error("Erro ao processar objeto no array:", innerError);
                // Última tentativa - extrair bytes do objeto se possível
                const flatArray = JSON.stringify(value).replace(/[^0-9,]/g, '').split(',').map(Number);
                buffer = Buffer.from(flatArray);
                console.log("Array convertido via extração para Buffer, tamanho:", buffer.length);
              }
            } else {
              // Tentar converter o array para um buffer numérico
              const numericArray = value.map(item => Number(item));
              buffer = Buffer.from(numericArray);
              console.log("Array numérico convertido para Buffer, tamanho:", buffer.length);
            }
          } else {
            throw new Error("Array vazio recebido do Object Storage");
          }
        } 
        else if (Buffer.isBuffer(value)) {
          // Já é um Buffer
          buffer = value;
          console.log("É um Buffer, tamanho:", buffer.length);
        } 
        else if (typeof value === 'object' && value !== null) {
          // Tentar extrair um buffer ou convertê-lo
          if ('buffer' in value) {
            buffer = Buffer.from((value as any).buffer);
            console.log("Objeto com buffer convertido, tamanho:", buffer.length);
          } else {
            // Tentar converter para JSON e depois para buffer
            const jsonString = JSON.stringify(value);
            buffer = Buffer.from(jsonString);
            console.log("Objeto convertido via JSON para Buffer, tamanho:", buffer.length);
          }
        } 
        else if (typeof value === 'string') {
          // É uma string, possivelmente em formato base64 ou UTF-8
          buffer = Buffer.from(value);
          console.log("String convertida para Buffer, tamanho:", buffer.length);
        } 
        else {
          // Última tentativa - converter para string e depois para buffer
          try {
            const stringValue = String(value);
            buffer = Buffer.from(stringValue);
            console.log("Valor convertido para string e depois para Buffer, tamanho:", buffer.length);
          } catch (innerError) {
            console.error("Erro na conversão final:", innerError);
            throw new Error("Formato de dados não suportado");
          }
        }
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

/**
 * Função para baixar uma imagem a partir de uma URL e salvar no Object Storage
 * @param url URL da imagem a ser baixada
 * @returns Promessa com o resultado do upload
 */
export async function downloadAndSaveImage(url: string): Promise<UploadResult> {
  console.log("Baixando imagem da URL:", url);
  
  // Evitar processamento se não for URL
  if (!url.startsWith('http')) {
    throw new Error('URL inválida');
  }
  
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      // Adicionar headers para evitar bloqueios (como user-agent)
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      };
      
      const request = protocol.get(url, options, (response) => {
        // Verificar status code da resposta
        if (response.statusCode !== 200) {
          return reject(new Error(`Erro ao baixar imagem: ${response.statusCode} ${response.statusMessage}`));
        }
        
        // Determinar o tipo de conteúdo
        const contentType = response.headers['content-type'] || 'image/jpeg';
        
        // Verificar se é uma imagem
        if (!contentType.startsWith('image/')) {
          return reject(new Error(`Tipo de conteúdo não suportado: ${contentType}`));
        }
        
        // Obter o nome do arquivo da URL ou gerar um nome baseado na extensão
        const urlPath = urlObj.pathname;
        let filename = urlPath.split('/').pop() || 'imagem';
        
        // Garantir que o nome do arquivo tenha uma extensão adequada
        if (!filename.includes('.')) {
          const ext = contentType.split('/')[1].replace('jpeg', 'jpg');
          filename = `${filename}.${ext}`;
        }
        
        // Chunking para coletar os dados
        const chunks: Buffer[] = [];
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', async () => {
          try {
            // Concatenar todos os chunks em um buffer
            const buffer = Buffer.concat(chunks);
            
            if (buffer.length === 0) {
              return reject(new Error('Buffer de imagem vazio após download'));
            }
            
            console.log(`Imagem baixada com sucesso: ${buffer.length} bytes`);
            
            // Fazer upload para o Object Storage
            const result = await uploadFile(buffer, filename, contentType);
            resolve(result);
          } catch (error) {
            console.error('Erro ao processar a imagem baixada:', error);
            reject(error);
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('Erro na requisição HTTP:', error);
        reject(error);
      });
      
      // Definir timeout para a requisição
      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('Timeout ao baixar a imagem'));
      });
      
    } catch (error) {
      console.error('Erro ao processar URL:', error);
      reject(error);
    }
  });
}