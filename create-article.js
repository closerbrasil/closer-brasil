import fetch from 'node-fetch';

/**
 * Função para revisar e formatar corretamente o conteúdo HTML do artigo
 * para garantir compatibilidade com o componente ArticleContent
 * @param {string} content - Conteúdo HTML original
 * @returns {string} - Conteúdo HTML formatado corretamente
 */
function formatarConteudoArtigo(content) {
  // Verifica se o conteúdo já está envolto na div com classe prose
  if (!content.trim().startsWith('<div class="prose')) {
    // Envolve o conteúdo com a div prose
    return `<div class="prose max-w-none">${content}</div>`;
  }
  return content;
}

/**
 * Função para verificar e corrigir problemas comuns de formatação HTML
 * @param {string} content - Conteúdo HTML para verificar
 * @returns {string} - Conteúdo HTML corrigido
 */
function corrigirProblemasFormatacao(content) {
  let corrigido = content;
  
  // Remover tags de negrito (strong e b)
  corrigido = corrigido.replace(/<\/?strong[^>]*>/g, '');
  corrigido = corrigido.replace(/<\/?b[^>]*>/g, '');
  
  // Corrigir espaçamento extra entre tags que pode causar problemas no Tailwind Typography
  corrigido = corrigido.replace(/>\s+</g, '><');
  
  // Garantir que listas estejam formatadas corretamente
  corrigido = corrigido.replace(/<ul>\s*<\/ul>/g, '');
  corrigido = corrigido.replace(/<ol>\s*<\/ol>/g, '');
  
  // Garantir que todas as tags estejam fechadas corretamente
  const tagsParaVerificar = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'ul', 'ol', 'li', 'blockquote', 'a'];
  
  tagsParaVerificar.forEach(tag => {
    const tagAbertaRegex = new RegExp(`<${tag}[^>]*>`, 'g');
    const tagFechadaRegex = new RegExp(`</${tag}>`, 'g');
    
    const tagAbertaMatch = corrigido.match(tagAbertaRegex);
    const tagFechadaMatch = corrigido.match(tagFechadaRegex);
    
    if (tagAbertaMatch && tagFechadaMatch && tagAbertaMatch.length > tagFechadaMatch.length) {
      console.warn(`Aviso: Tag <${tag}> não foi fechada corretamente no artigo.`);
    }
  });
  
  return corrigido;
}

// Definindo o conteúdo HTML do novo artigo
const articleContent = `
<h2>Inteligência Artificial na Educação: Transformando o Aprendizado</h2>

<p>A inteligência artificial (IA) está revolucionando diversos setores, e a educação não é exceção. Com avanços tecnológicos constantes, sistemas educacionais estão se transformando para oferecer experiências de aprendizado mais personalizadas e eficientes. Neste artigo, exploramos como a IA está redefinindo o futuro da educação e quais são seus principais benefícios e desafios.</p>

<h3>Aprendizado Personalizado</h3>

<p>Um dos maiores benefícios da IA na educação é a capacidade de personalizar a experiência de aprendizado. Algoritmos inteligentes podem analisar o desempenho individual de cada estudante, identificando padrões de aprendizado, pontos fortes e áreas que precisam de aprimoramento.</p>

<p>Plataformas como <a href="https://www.duolingo.com">Duolingo</a> e <a href="https://www.khanacademy.org">Khan Academy</a> utilizam IA para adaptar o conteúdo ao ritmo de cada aluno, oferecendo exercícios e explicações personalizados. Esta abordagem permite que cada estudante progrida no seu próprio ritmo, aumentando a eficiência do aprendizado.</p>

<blockquote>
  <p>"A personalização é o futuro da educação. Quando cada aluno recebe atenção individualizada, o aprendizado se torna mais eficaz e prazeroso." - Dr. Paulo Silva, especialista em Tecnologia Educacional</p>
</blockquote>

<h3>Assistentes Virtuais e Chatbots</h3>

<p>Assistentes de aprendizado baseados em IA estão se tornando cada vez mais sofisticados, oferecendo suporte 24/7 para estudantes. Estes assistentes virtuais podem:</p>

<ul>
  <li>Responder perguntas frequentes</li>
  <li>Fornecer feedback imediato</li>
  <li>Recomendar recursos adicionais</li>
  <li>Ajudar com dúvidas específicas sobre o conteúdo</li>
</ul>

<p>A Georgia Tech University, por exemplo, implementou um assistente virtual chamado Jill Watson, que responde perguntas dos alunos com tanta precisão que muitos nem perceberam que estavam interagindo com um bot.</p>

<h3>Automação de Tarefas Administrativas</h3>

<p>A IA também está transformando a vida dos educadores ao automatizar tarefas administrativas como:</p>

<ol>
  <li>Correção de provas e trabalhos</li>
  <li>Geração de relatórios de desempenho</li>
  <li>Organização de cronogramas</li>
  <li>Detecção de plágio</li>
</ol>

<p>Esta automação libera tempo valioso para que professores possam se concentrar no que realmente importa: interagir com os alunos e criar experiências de aprendizado mais enriquecedoras.</p>

<h3>Análise Preditiva e Prevenção de Evasão</h3>

<p>Um dos usos mais promissores da IA na educação é a análise preditiva. Sistemas inteligentes podem identificar estudantes em risco de evasão ou com dificuldades de aprendizado antes que problemas maiores se manifestem.</p>

<p>A Universidade de São Paulo implementou um sistema que analisa padrões de engajamento e desempenho para identificar alunos em risco de abandono, permitindo intervenções precoces e personalizadas.</p>

<h3>Desafios e Considerações Éticas</h3>

<p>Apesar dos benefícios, a implementação da IA na educação também apresenta desafios importantes:</p>

<ul>
  <li><strong>Privacidade e segurança de dados</strong>: O uso de dados de alunos levanta questões sobre privacidade e consentimento.</li>
  <li><strong>Acessibilidade</strong>: Existe o risco de criar uma divisão digital entre instituições com e sem acesso a tecnologias avançadas.</li>
  <li><strong>Dependência tecnológica</strong>: É importante equilibrar o uso da tecnologia com interações humanas significativas.</li>
  <li><strong>Vieses algorítmicos</strong>: Sistemas de IA podem perpetuar preconceitos existentes se não forem cuidadosamente projetados.</li>
</ul>

<h2>O Futuro da Educação com IA</h2>

<p>O futuro da educação com IA promete ser ainda mais transformador. Tecnologias emergentes como realidade virtual e aumentada, combinadas com IA, poderão criar ambientes de aprendizado imersivos e altamente interativos.</p>

<p>Imagine uma aula de história onde os alunos podem "visitar" civilizações antigas através de VR, enquanto um tutor de IA personaliza a experiência com base em seus interesses e estilo de aprendizado.</p>

<h3>Conclusão</h3>

<p>A inteligência artificial está redefinindo o que é possível na educação, oferecendo novas formas de personalizar o aprendizado, apoiar educadores e engajar estudantes. Embora existam desafios a serem superados, o potencial para transformar positivamente a educação é imenso.</p>

<p>À medida que estas tecnologias continuam a evoluir, será fundamental encontrar o equilíbrio certo entre inovação tecnológica e valores educacionais tradicionais, garantindo que a tecnologia sirva como uma ferramenta para aprimorar — e não substituir — a experiência humana na educação.</p>
`;

// Preparar os dados do artigo
function prepararArtigo(conteudo, dados) {
  // Formatar o conteúdo HTML
  const conteudoCorrigido = corrigirProblemasFormatacao(conteudo);
  const conteudoFormatado = formatarConteudoArtigo(conteudoCorrigido);
  
  // Retornar o artigo com o conteúdo formatado
  return {
    ...dados,
    conteudo: conteudoFormatado
  };
}

// Função para gerar um slug único com timestamp
function gerarSlugUnico(baseSlug) {
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
}

// Dados do novo artigo
const dadosArtigo = {
  titulo: "Inteligência Artificial na Educação: Transformando o Aprendizado",
  resumo: "Descubra como a inteligência artificial está revolucionando o setor educacional com personalização de conteúdo, assistentes virtuais e análise preditiva. Conheça os benefícios e desafios desta transformação tecnológica.",
  slug: gerarSlugUnico("inteligencia-artificial-na-educacao"),
  categoriaId: "f442c9ed-c6e4-4e87-918c-391df1bdb0dc", // ID da categoria Tecnologia
  autorId: "21b9a7d2-c8c6-40f5-b776-1a7327349a7a", // ID do autor João Silva
  imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1332&auto=format&fit=crop",
  destacado: true,
  publicadoEm: new Date().toISOString(),
  tempoLeitura: "7 min de leitura",
  imagemCredito: "Unsplash",
  metaTitulo: "IA na Educação: Como a Tecnologia está Transformando o Aprendizado",
  metaDescricao: "Artigo sobre como a inteligência artificial está revolucionando a educação através de personalização, assistentes virtuais e análise preditiva de dados."
};

// Preparar o artigo com o conteúdo formatado
const novoArtigo = prepararArtigo(articleContent, dadosArtigo);

// Função para criar o artigo
async function criarArtigo() {
  try {
    console.log('Iniciando publicação do artigo...');
    console.log('Revisando e formatando o conteúdo...');
    
    // O conteúdo já foi formatado na variável novoArtigo
    
    console.log('Enviando requisição para API...');
    const response = await fetch('http://localhost:5000/api/noticias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoArtigo),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Artigo criado com sucesso!');
    console.log(`Título: ${data.titulo}`);
    console.log(`ID: ${data.id}`);
    console.log(`URL: /noticia/${data.slug}`);
    
    return data;
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    throw error;
  }
}

// Função principal que executa todo o processo
async function publicarArtigo() {
  try {
    const resultado = await criarArtigo();
    console.log(`Artigo "${resultado.titulo}" publicado com sucesso!`);
  } catch (error) {
    console.error('Falha ao publicar o artigo:', error.message);
  }
}

// Executar a função
publicarArtigo();