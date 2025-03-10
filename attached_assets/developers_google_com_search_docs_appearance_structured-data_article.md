URL: https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br
---
[Ir para o conteúdo principal](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#main-content)

[![Google Search Central](https://developers.google.com/static/search/images/google-search-central-logo.svg)](https://developers.google.com/search?hl=pt-br)

- [GoogleSearch Central](https://developers.google.com/search?hl=pt-br)

`/`

- [English](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Deutsch](https://developers.google.com/search/docs/appearance/structured-data/article?hl=de)
- [Español](https://developers.google.com/search/docs/appearance/structured-data/article?hl=es)
- [Español – América Latina](https://developers.google.com/search/docs/appearance/structured-data/article?hl=es-419)
- [Français](https://developers.google.com/search/docs/appearance/structured-data/article?hl=fr)
- [Indonesia](https://developers.google.com/search/docs/appearance/structured-data/article?hl=id)
- [Italiano](https://developers.google.com/search/docs/appearance/structured-data/article?hl=it)
- [Polski](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pl)
- [Português – Brasil](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br)
- [Tiếng Việt](https://developers.google.com/search/docs/appearance/structured-data/article?hl=vi)
- [Türkçe](https://developers.google.com/search/docs/appearance/structured-data/article?hl=tr)
- [Русский](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ru)
- [العربيّة](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ar)
- [हिंदी](https://developers.google.com/search/docs/appearance/structured-data/article?hl=hi)
- [ภาษาไทย](https://developers.google.com/search/docs/appearance/structured-data/article?hl=th)
- [中文 – 简体](https://developers.google.com/search/docs/appearance/structured-data/article?hl=zh-cn)
- [中文 – 繁體](https://developers.google.com/search/docs/appearance/structured-data/article?hl=zh-tw)
- [日本語](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ja)
- [한국어](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ko)

[Fazer login](https://developers.google.com/_d/signin?continue=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fappearance%2Fstructured-data%2Farticle%3Fhl%3Dpt-br&prompt=select_account)

- [Documentation](https://developers.google.com/search/docs?hl=pt-br)

[Search Console](https://goo.gle/searchconsole)

**Agora estamos no LinkedIn**: para acessar notícias e recursos da Pesquisa Google sobre como tornar seu site detectável, [siga nosso perfil no LinkedIn](https://www.linkedin.com/showcase/googlesearchcentral/).




- [Página inicial](https://developers.google.com/?hl=pt-br)
- [Search Central](https://developers.google.com/search?hl=pt-br)
- [Documentation](https://developers.google.com/search/docs?hl=pt-br)

Isso foi útil?



 Envie comentários



- Nesta página
- [Exemplo](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#examples)
- [Como adicionar dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#add-structured-data)
- [Diretrizes](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#guidelines)
  - [Diretrizes técnicas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#technical-guidelines)
- [Definições de tipos de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#structured-data-type-definitions)
  - [Objetos Article](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#article-types)
- [Práticas recomendadas de marcação de autores](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#author-bp)
  - [Incluir todos os autores na marcação](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#include-all-authors-in-the-markup)
  - [Como especificar vários autores](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#specifying-multiple-authors)
  - [Usar outros campos](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#use-additional-fields)
  - [Inserir o nome do autor somente na propriedade author.name](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#only-specify-the-authors-name-in-the-author.name-property)
  - [Usar a propriedade Type correta](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#use-the-appropriate-type)
- [Solução de problemas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#troubleshooting)

# Dados estruturados de artigo ( `Article`, `NewsArticle`, `BlogPosting`)

bookmark\_borderbookmark

Mantenha tudo organizado com as coleções


Salve e categorize o conteúdo com base nas suas preferências.


Adicionar dados estruturados `Article` às suas páginas de notícias, blogs e artigos
esportivos pode ajudar o Google a entender mais sobre a página da Web e exibir anúncios melhor [o texto do título](https://developers.google.com/search/docs/appearance/title-link?hl=pt-br),
imagens e [informações de data](https://developers.google.com/search/docs/appearance/publication-dates?hl=pt-br)
do artigo nos resultados da pesquisa na Pesquisa Google e em outras propriedades
(por exemplo, no Google Notícias e no [Google Assistente](https://developers.google.com/assistant/content/overview?hl=pt-br)).
Embora não haja um requisito de marcação para se qualificar para os destaques do Google Notícias, como as [Principais notícias](https://support.google.com/news/publisher-center/answer/9607026?hl=pt-br), você pode adicionar `Article` para informar explicitamente ao Google sobre o que é seu conteúdo (por exemplo, que se trata de uma notícia, o nome do autor ou o título do artigo).

![Pesquisa aprimorada de artigos](https://developers.google.com/static/search/docs/images/article-rich-result.png?hl=pt-br)

## Exemplo

Veja um exemplo de página com dados estruturados de `Article`.

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#json-ld)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#microdados)Mais

```
<html>
  <head>
    <title>Title of a News Article</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Title of a News Article",
      "image": [\
        "https://example.com/photos/1x1/photo.jpg",\
        "https://example.com/photos/4x3/photo.jpg",\
        "https://example.com/photos/16x9/photo.jpg"\
       ],
      "datePublished": "2024-01-05T08:00:00+08:00",
      "dateModified": "2024-02-05T09:20:00+08:00",
      "author": [{\
          "@type": "Person",\
          "name": "Jane Doe",\
          "url": "https://example.com/profile/janedoe123"\
        },{\
          "@type": "Person",\
          "name": "John Doe",\
          "url": "https://example.com/profile/johndoe123"\
      }]
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

```
<html>
  <head>
    <title>Title of a News Article</title>
  </head>
  <body>
    <div itemscope itemtype="https://schema.org/NewsArticle">
      <div itemprop="headline">Title of News Article</div>
      <meta itemprop="image" content="https://example.com/photos/1x1/photo.jpg" />
      <meta itemprop="image" content="https://example.com/photos/4x3/photo.jpg" />
      <img itemprop="image" src="https://example.com/photos/16x9/photo.jpg" />
      <div>
        <span itemprop="datePublished" content="2024-01-05T08:00:00+08:00">
          January 5, 2024 at 8:00am
        </span>
        (last modified
        <span itemprop="dateModified" content="2024-02-05T09:20:00+08:00">
          February 5, 2024 at 9:20am
        </span>
        )
      </div>
      <div>
        by
        <span itemprop="author" itemscope itemtype="https://schema.org/Person">
          <a itemprop="url" href="https://example.com/profile/janedoe123">
            <span itemprop="name">Jane Doe</span>
          </a>
        </span>
        and
        <span itemprop="author" itemscope itemtype="https://schema.org/Person">
          <a itemprop="url" href="https://example.com/profile/johndoe123">
            <span itemprop="name">John Doe</span>
          </a>
        </span>
      </div>
    </div>
  </body>
</html>
```

## Como adicionar dados estruturados

Os dados estruturados são um formato padronizado para fornecer informações sobre uma página e classificar o
conteúdo dela. Caso você não saiba muito sobre o assunto, veja
[como os dados estruturados funcionam](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br).


Esta é uma visão geral de como criar, testar e lançar dados estruturados.

1. Adicione todas as [propriedades recomendadas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#structured-data-type-definitions) que se aplicam
    à página da Web. Não há propriedades obrigatórias; adicione as propriedades que se aplicam
    ao seu conteúdo. Com base no formato que você está usando, saiba onde [inserir dados estruturados na página](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br#format-placement).


2. Siga as [diretrizes](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#guidelines).
3. Valide o código com o
    [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results?hl=pt-br)
    e corrija os erros críticos. Corrija também os problemas não críticos que possam ser sinalizados
    na ferramenta, porque eles podem melhorar a qualidade dos dados estruturados, mas isso não é necessário para se qualificar para pesquisas aprimoradas.
4. Implante algumas páginas que incluam os dados estruturados e use a [Ferramenta de inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-br) para testar como o Google vê a página. Verifique se a página está
    acessível ao Google e se não está bloqueada por um arquivo robots.txt, pela tag `noindex` ou
    por requisitos de login. Se estiver tudo certo,
    [peça ao Google para rastrear novamente seus URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br).


5. Para informar o Google sobre mudanças futuras, recomendamos que você
    [envie um sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=pt-br). É possível automatizar isso com a [API Search Console Sitemap](https://developers.google.com/webmaster-tools/v1/sitemaps?hl=pt-br).

## Diretrizes

Siga estas diretrizes para que os dados estruturados sejam qualificados para inclusão nos resultados da Pesquisa Google.

- [Fundamentos da Pesquisa](https://developers.google.com/search/docs/essentials?hl=pt-br)
- [Diretrizes gerais de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=pt-br)
- [Diretrizes técnicas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#technical-guidelines)

### Diretrizes técnicas

- Para artigos com várias partes, verifique se os pontos `rel=canonical` estão
em todas as páginas ou em uma página "Visualizar tudo" (e não só na primeira de uma série). Saiba
mais [sobre a canonização](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=pt-br).
- Se você oferece acesso por assinatura ao conteúdo do site, ou os usuários precisam se cadastrar
para acessá-lo, considere adicionar dados estruturados para
[conteúdo de assinatura e com paywall](https://developers.google.com/search/docs/appearance/structured-data/paywalled-content?hl=pt-br).

## Definições de tipos de dados estruturados

Para ajudar o Google a entender melhor sua página, inclua todas as propriedades recomendadas que se aplicam à página da Web. Não há propriedades obrigatórias; adicione as propriedades que se aplicam
ao seu conteúdo.


### Objetos `Article`

Os objetos do artigo precisam se basear em um dos seguintes tipos
do schema.org: [`Article`](https://schema.org/Article),
[`NewsArticle`](https://schema.org/NewsArticle) ou [`BlogPosting`](https://schema.org/BlogPosting).

Veja as propriedades aceitas pelo Google:

| Propriedades recomendadas |
| --- |
| `author` | `Person` ou `Organization`<br>É o autor do artigo. Para ajudar o Google a entender melhor a autoria dos vários recursos,<br>recomendamos seguir as [práticas recomendadas de marcação de autores](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#author-bp). |
| `author.name` | `Text`<br>É o nome do autor. |
| `author.url` | `URL`<br>É um link para uma página da Web que identifica exclusivamente o autor do artigo, como uma página de mídia social, uma seção "Sobre" ou uma biografia, por exemplo.<br>Se o URL for uma página de perfil interna, recomendamos marcar esse autor usando<br>[dados estruturados da página de perfil](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=pt-br). |
| `dateModified` | `DateTime`<br>É a data e a hora em que o artigo foi modificado pela última vez, no [formato ISO 8601](https://wikipedia.org/wiki/ISO_8601).<br>Recomendamos que você forneça<br>informações de fuso horário. Caso contrário, o padrão vai ser o<br>[fuso horário usado pelo Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=pt-br#timezone).<br>Adicione a propriedade `dateModified` se você quiser fornecer informações de data mais precisas ao Google.<br>O<br>[teste de pesquisa aprimorada](https://search.google.com/test/rich-results?hl=pt-br) não mostra avisos sobre essa propriedade,<br>porque ela só é recomendada se você achar que ela se aplica ao seu site. |
| `datePublished` | `DateTime`<br>É a data e a hora em que o artigo foi publicado pela primeira vez, no<br>[formato ISO 8601](https://wikipedia.org/wiki/ISO_8601).<br>Recomendamos que você forneça<br>informações de fuso horário. Caso contrário, o padrão vai ser o<br>[fuso horário usado pelo Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=pt-br#timezone).<br>Adicione a propriedade `datePublished` se você quiser fornecer<br>informações de data mais precisas ao Google. O<br>[teste de pesquisa aprimorada](https://search.google.com/test/rich-results?hl=pt-br) não mostra avisos sobre essa propriedade,<br>porque ela só é recomendada se você achar que ela se aplica ao seu site. |
| `headline` | `Text`<br>O título do artigo. Use um título conciso, já que textos longos podem ser truncados em alguns dispositivos. |
| `image` | Repetição de `ImageObject` ou `URL`<br>É o URL para uma imagem representativa do artigo. Use imagens que sejam relevantes<br>para o artigo em vez de logotipos ou legendas.<br>Veja outras diretrizes relacionadas:<br> <br>- Os URLs das imagens precisam ser rastreáveis e indexáveis. Para verificar se o Google consegue acessar os URLs, use<br>   a [Ferramenta de inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-br).<br>- As imagens precisam representar o conteúdo marcado.<br>- O formato do arquivo precisa ser [compatível com o Imagens do Google](https://developers.google.com/search/docs/appearance/google-images?hl=pt-br#supported-image-formats).<br>- Para conseguir os melhores resultados, recomendamos fornecer várias imagens de alta resolução, com no mínimo 50 mil pixels ao<br>   multiplicar a largura e a altura, nas seguintes proporções: 16 x 9, 4 x 3 e 1 x 1.<br>Exemplo:<br>```<br>"image": [<br>  "https://example.com/photos/1x1/photo.jpg",<br>  "https://example.com/photos/4x3/photo.jpg",<br>  "https://example.com/photos/16x9/photo.jpg"<br>]<br>``` |

## Práticas recomendadas de marcação de autores

Para ajudar o Google a entender e representar melhor a autoria dos conteúdos, recomendamos fazer a marcação
seguindo as práticas recomendadas abaixo.

| Práticas recomendadas de marcação de autores |
| --- |
| ### Incluir todos os autores na marcação | Confira se todos aqueles que foram apresentados como autores na página da Web também estão na marcação. |
| ### Como especificar vários autores | Para fazer isso, liste cada um dos autores em campos `author` exclusivos.<br> <br>```<br>"author": [<br>  {"name": "Willow Lane"},<br>  {"name": "Regula Felix"}<br>]<br>```<br>Não misture vários autores em um único campo `author`:<br> <br>```<br>"author": {<br>  "name": "Willow Lane, Regula Felix"<br>}<br>``` |
| ### Usar outros campos | Para ajudar o Google a entender melhor quem é o autor, recomendamos o uso das propriedades<br>`type` e `url`<br>ou `sameAs`. Use URLs válidos para as propriedades `url` ou `sameAs`.<br> <br>Por exemplo, se o autor for uma pessoa, você pode vincular uma página<br>com mais informações sobre ele.<br> <br>```<br>"author": [<br>  {<br>    "@type": "Person",<br>    "name": "Willow Lane",<br>    "url": "https://www.example.com/staff/willow_lane"<br>  }<br>]<br>```<br>Se o autor for uma organização, é possível vincular a página inicial dela.<br> <br>```<br>"author":<br>  [<br>    {<br>      "@type":"Organization",<br>      "name": "Some News Agency",<br>      "url": "https://www.example.com/"<br>  }<br>]<br>``` |
| ### Inserir o nome do autor somente na propriedade `author.name` | Na propriedade `author.name`, especifique apenas o nome do autor. Não adicione<br>outras informações. Mais especificamente, não adicione as seguintes informações:<br> <br>- O nome do editor. Para isso, use a propriedade `publisher`.<br>- O cargo do autor. Se quiser adicionar essa informação, insira na propriedade correta ( [`jobTitle`](https://schema.org/jobTitle)).<br>- Prefixo ou sufixo honorífico. Se quiser adicionar essa informação, insira na propriedade correta<br>   ( [`honorificPrefix`](https://schema.org/honorificPrefix)<br>   ou [`honorificSuffix`](https://schema.org/honorificSuffix)).<br>- Palavras introdutórias (por exemplo, não inclua algo como "postado por").<br>```<br>"author":<br>  [<br>    {<br>      "@type": "Person",<br>      "name": "Echidna Jones",<br>      "honorificPrefix": "Dr",<br>      "jobTitle": "Editor in Chief"<br>    }<br>  ],<br>"publisher":<br>  [<br>    {<br>      "@type": "Organization",<br>      "name": "Bugs Daily"<br>    }<br>  ]<br>}<br>``` |
| ### Usar a propriedade `Type` correta | Use o tipo `Person` para pessoas e o `Organization` para organizações. Não use o tipo `Thing`, ou qualquer outro que não seja o correto<br>(por exemplo, usar o tipo `Organization` para uma pessoa). |

Veja um exemplo que aplica as práticas recomendadas de marcação de autores:

```
"author":
  [\
    {\
      "@type": "Person",\
      "name": "Willow Lane",\
      "jobTitle": "Journalist",\
      "url": "https://www.example.com/staff/willow-lane"\
    },\
    {\
      "@type": "Person",\
      "name": "Echidna Jones",\
      "jobTitle": "Editor in Chief",\
      "url": "https://www.example.com/staff/echidna-jones"\
    }\
  ],
"publisher":
  {
    "@type": "Organization",
    "name": "The Daily Bug",
    "url": "https://www.example.com"
  },
  // + Other fields related to the article...
}
```

## Solução de problemas

Se você tiver problemas para implementar ou depurar dados estruturados, veja alguns recursos que
podem ajudar.


- Se você usa um sistema de gerenciamento de conteúdo (CMS) ou se alguém está cuidando do seu site,
peça ajuda para o prestador de serviço. Não se esqueça de encaminhar todas as mensagens do Search Console com os detalhes do problema.
- O Google não garante que os recursos que consomem dados estruturados vão ser exibidos nos resultados da pesquisa.
Para ver uma lista de motivos comuns por que o Google pode não exibir seu conteúdo na pesquisa aprimorada, consulte as
[diretrizes gerais de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=pt-br).
- Pode haver um erro nos dados estruturados. Confira a
[lista de erros de dados estruturados](https://support.google.com/webmasters/answer/7552505?hl=pt-br#error_list)
e o [Relatório de dados estruturados que não podem ser analisados](https://support.google.com/webmasters/answer/9166415?hl=pt-br).
- Se você recebeu uma ação manual de dados estruturados relacionada à sua página, esses dados
serão ignorados, embora a página ainda possa aparecer nos resultados da Pesquisa Google. Para corrigir
[problemas de dados estruturados](https://support.google.com/webmasters/answer/9044175?hl=pt-br#zippy=,structured-data-issue), use o [Relatório de ações manuais](https://support.google.com/webmasters/answer/9044175?hl=pt-br).

- [Consulte as diretrizes](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#guidelines) novamente para identificar se o conteúdo não está em conformidade
com elas. O problema pode ser causado por conteúdo com spam ou uso de marcação com spam.
No entanto, talvez o problema não seja de sintaxe e, por isso, o teste de pesquisa aprimorada não poderá
identificá-lo.

- [Resolva problemas relacionados à ausência e à queda no total de pesquisas aprimoradas](https://support.google.com/webmasters/answer/7552505?hl=pt-br#missing-jobs).
- Aguarde algum tempo antes de voltar a rastrear e reindexar. Pode levar vários dias depois da publicação de uma página para que o Google a localize e rastreie. Para perguntas gerais sobre rastreamento e indexação, consulte as [Perguntas frequentes sobre rastreamento e indexação da Pesquisa Google](https://developers.google.com/search/help/crawling-index-faq?hl=pt-br).

- Poste uma pergunta no [fórum da Central da Pesquisa Google](https://support.google.com/webmasters/community?hl=pt-br)

Isso foi útil?



 Envie comentários



Exceto em caso de indicação contrária, o conteúdo desta página é licenciado de acordo com a [Licença de atribuição 4.0 do Creative Commons](https://creativecommons.org/licenses/by/4.0/), e as amostras de código são licenciadas de acordo com a [Licença Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). Para mais detalhes, consulte as [políticas do site do Google Developers](https://developers.google.com/site-policies?hl=pt-br). Java é uma marca registrada da Oracle e/ou afiliadas.

Última atualização 2025-02-25 UTC.

Informações


Chat


API


## Informações da página

bug\_reportfullscreenclose\_fullscreenclose

### Nesta página

- Nesta página
- [Exemplo](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#examples)
- [Como adicionar dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#add-structured-data)
- [Diretrizes](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#guidelines)
  - [Diretrizes técnicas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#technical-guidelines)
- [Definições de tipos de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#structured-data-type-definitions)
  - [Objetos Article](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#article-types)
- [Práticas recomendadas de marcação de autores](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#author-bp)
  - [Incluir todos os autores na marcação](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#include-all-authors-in-the-markup)
  - [Como especificar vários autores](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#specifying-multiple-authors)
  - [Usar outros campos](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#use-additional-fields)
  - [Inserir o nome do autor somente na propriedade author.name](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#only-specify-the-authors-name-in-the-author.name-property)
  - [Usar a propriedade Type correta](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#use-the-appropriate-type)
- [Solução de problemas](https://developers.google.com/search/docs/appearance/structured-data/article?hl=pt-br#troubleshooting)

### Pontos principais

GERADO COM IA

- Article structured data helps Google understand and display web page content more effectively in search results.
- Implement structured data using schema.org types like \`Article\`, \`NewsArticle\`, and \`BlogPosting\`, including recommended properties for optimal results.
- Ensure your structured data adheres to Google's guidelines to avoid manual actions and improve search performance.
- Leverage author markup best practices to provide comprehensive information about content creators.
- While Google doesn't guarantee search result features, utilizing structured data enhances the likelihood of rich results.

outlined\_flag

[iframe](https://scone-pa.clients6.google.com/static/proxy.html?usegapi=1&jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.en.z-CF99wuLeU.O%2Fd%3D1%2Frs%3DAHpOoo8yJLmK2FeQzRT4hxPn9_NEJo9eCg%2Fm%3D__features__#parent=https%3A%2F%2Fdevelopers.google.com&rpctoken=2122449635)