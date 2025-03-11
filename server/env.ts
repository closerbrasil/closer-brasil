import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Carregar variáveis de ambiente de diferentes arquivos em ordem de prioridade
dotenv.config({ path: path.resolve(rootDir, '.env.local') });
dotenv.config({ path: path.resolve(rootDir, '.env') });

// Verificar se DATABASE_URL está definido
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não está definido. Verifique seus arquivos .env ou .env.local');
}

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SITE_DOMAIN: process.env.SITE_DOMAIN,
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY
}; 