URL: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br
---
[Ir para o conteúdo principal](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#main-content)

[![Google Search Central](https://developers.google.com/static/search/images/google-search-central-logo.svg?hl=pt-br)](https://developers.google.com/search?hl=pt-br)

- [GoogleSearch Central](https://developers.google.com/search?hl=pt-br)

`/`

- [English](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Deutsch](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=de)
- [Español](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=es)
- [Español – América Latina](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=es-419)
- [Français](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=fr)
- [Indonesia](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=id)
- [Italiano](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=it)
- [Polski](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pl)
- [Português – Brasil](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br)
- [Tiếng Việt](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=vi)
- [Türkçe](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=tr)
- [Русский](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=ru)
- [العربيّة](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=ar)
- [हिंदी](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=hi)
- [ภาษาไทย](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=th)
- [中文 – 简体](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=zh-cn)
- [中文 – 繁體](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=zh-tw)
- [日本語](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=ja)
- [한국어](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=ko)

[Fazer login](https://developers.google.com/_d/signin?continue=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fappearance%2Fstructured-data%2Fbreadcrumb%3Fhl%3Dpt-br&prompt=select_account)

- [Documentation](https://developers.google.com/search/docs?hl=pt-br)

[Search Console](https://goo.gle/searchconsole)

**Agora estamos no LinkedIn**: para acessar notícias e recursos da Pesquisa Google sobre como tornar seu site detectável, [siga nosso perfil no LinkedIn](https://www.linkedin.com/showcase/googlesearchcentral/).




- [Página inicial](https://developers.google.com/?hl=pt-br)
- [Search Central](https://developers.google.com/search?hl=pt-br)
- [Documentation](https://developers.google.com/search/docs?hl=pt-br)

Isso foi útil?



 Envie comentários



- Nesta página
- [Disponibilidade do recurso](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#availability)
- [Como adicionar dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#add-structured-data)
- [Exemplos](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#example)
  - [Trilha de navegação estrutural única](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#year-genre%20example)
  - [Trilha de navegação estrutural múltipla](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#html_example)
- [Diretrizes](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#guidelines)
- [Definições de tipos de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#structured-data-type-definitions)
  - [BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#breadcrumb-list)
  - [ListItem](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#list-item)
- [Monitorar pesquisas aprimoradas com o Search Console](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#monitor)
  - [Depois de implantar os dados estruturados pela primeira vez](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-deploying)
  - [Depois de lançar novos modelos ou atualizar o código](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-releasing)
  - [Análise periódica do tráfego](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#analyzing-periodically)
- [Solução de problemas](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#troubleshooting)

# Dados estruturados de navegação estrutural ( `BreadcrumbList`)

bookmark\_border

Mantenha tudo organizado com as coleções


Salve e categorize o conteúdo com base nas suas preferências.
![Navegação estrutural nos resultados da pesquisa](https://developers.google.com/static/search/docs/images/breadcrumb.png?hl=pt-br)

A trilha da navegação estrutural de uma página indica a posição dela na hierarquia do site e pode
ajudar os usuários a entender e analisar o conteúdo on-line de maneira eficaz. O usuário pode percorrer todo o caminho na hierarquia, um nível por
vez, a partir da última navegação na trilha atual.

## Disponibilidade do recurso

Esse recurso está disponível em computadores em todas as regiões e idiomas em que a Pesquisa Google está disponível.

## Como adicionar dados estruturados

Os dados estruturados são um formato padronizado para fornecer informações sobre uma página e classificar o
conteúdo dela. Caso você não saiba muito sobre o assunto, veja
[como os dados estruturados funcionam](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br).


Esta é uma visão geral de como criar, testar e lançar dados estruturados.

1. Adicione as [propriedades obrigatórias](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#structured-data-type-definitions). Com base no
    formato que você está usando, saiba onde [inserir dados estruturados na página](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br#format-placement).


2. Siga as [diretrizes](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#guidelines).
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

## Exemplos

A Pesquisa Google usa a marcação de navegação estrutural no corpo de uma página da Web para categorizar
as informações da página nos resultados da pesquisa. Geralmente, conforme ilustrado nos
casos de uso a seguir, os usuários podem chegar a uma página a partir de tipos muito diferentes de
consultas de pesquisa. Embora cada pesquisa possa retornar a mesma página da Web, a navegação estrutural
categoriza o conteúdo dentro do contexto da consulta da Pesquisa Google. A página
dos vencedores de um prêmio de livro fictício pode usar as seguintes trilhas de navegação estrutural:

### Trilha de navegação estrutural única

Se houver apenas uma trilha de navegação estrutural que leve à página, ela poderá especificar a
seguinte trilha de navegação estrutural:

[Livros](https://www.example.com/books)› [Ficção científica](https://www.example.com/books/sciencefiction)›
Vencedores de prêmios

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#json-ld)[RDFa](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#rdfa)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#microdados)[HTML](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#html)

Veja um exemplo em JSON-LD compatível com essa navegação estrutural:

```
<html>
  <head>
    <title>Award Winners</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{\
        "@type": "ListItem",\
        "position": 1,\
        "name": "Books",\
        "item": "https://example.com/books"\
      },{\
        "@type": "ListItem",\
        "position": 2,\
        "name": "Science Fiction",\
        "item": "https://example.com/books/sciencefiction"\
      },{\
        "@type": "ListItem",\
        "position": 3,\
        "name": "Award Winners"\
      }]
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

Veja um exemplo de RDFa compatível com essa navegação estrutural:

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/books">
          <span property="name">Books</span></a>
        <meta property="position" content="1">
      </li>
      ›
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/books/sciencefiction">
          <span property="name">Science Fiction</span></a>
        <meta property="position" content="2">
      </li>
      ›
      <li property="itemListElement" typeof="ListItem">
        <span property="name">Award Winners</span>
        <meta property="position" content="3">
      </li>
    </ol>
  </body>
</html>
```

Veja um exemplo em microdados compatível com essa navegação estrutural:

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="https://example.com/books">
            <span itemprop="name">Books</span></a>
        <meta itemprop="position" content="1" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/WebPage"
           itemprop="item" itemid="https://example.com/books/sciencefiction"
           href="https://example.com/books/sciencefiction">
          <span itemprop="name">Science Fiction</span></a>
        <meta itemprop="position" content="2" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <span itemprop="name">Award winners</span>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
  </body>
</html>
```

Veja um exemplo de um bloco de navegação estrutural em HTML na página como parte do design visual.

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol>
      <li>
        <a href="https://www.example.com/books">Books</a>
      </li>
      <li>
        <a href="https://www.example.com/sciencefiction">Science Fiction</a>
      </li>
      <li>
        Award Winners
      </li>
    </ol>
  </body>
</html>
```

### Trilha de navegação estrutural múltipla

Se houver várias maneiras de navegar até uma página no site, especifique várias trilhas de navegação estrutural
para uma única página. Veja um exemplo que leva a uma página
de livros premiados:

[Livros](https://www.example.com/books)› [Ficção científica](https://www.example.com/books/sciencefiction)›
Vencedores de prêmios

Veja outra trilha de navegação estrutural que leva à mesma página:

[Literatura](https://www.example.com/literature)›
Vencedores de prêmios

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#json-ld)[RDFa](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#rdfa)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#microdados)[HTML](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#html)

Veja um exemplo de JSON-LD compatível com várias trilhas de navegação estrutural:

```
<html>
  <head>
    <title>Award Winners</title>
    <script type="application/ld+json">
    [{\
      "@context": "https://schema.org",\
      "@type": "BreadcrumbList",\
      "itemListElement": [{\
        "@type": "ListItem",\
        "position": 1,\
        "name": "Books",\
        "item": "https://example.com/books"\
      },{\
        "@type": "ListItem",\
        "position": 2,\
        "name": "Science Fiction",\
        "item": "https://example.com/books/sciencefiction"\
      },{\
        "@type": "ListItem",\
        "position": 3,\
        "name": "Award Winners"\
      }]\
    },\
    {\
      "@context": "https://schema.org",\
      "@type": "BreadcrumbList",\
      "itemListElement": [{\
        "@type": "ListItem",\
        "position": 1,\
        "name": "Literature",\
        "item": "https://example.com/literature"\
      },{\
        "@type": "ListItem",\
        "position": 2,\
        "name": "Award Winners"\
      }]\
    }]
    </script>
  </head>
  <body>
  </body>
</html>
```

Veja um exemplo de RDFa compatível com várias trilhas de navegação estrutural:

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/books">
          <span property="name">Books</span></a>
        <meta property="position" content="1">
      </li>
      ›
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/books/sciencefiction">
          <span property="name">Science Fiction</span></a>
        <meta property="position" content="2">
      </li>
      ›
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/books/sciencefiction/awardwinners">
          <span property="name">Award Winners</span></a>
        <meta property="position" content="3">
      </li>
    </ol>
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li property="itemListElement" typeof="ListItem">
        <a property="item" typeof="WebPage"
            href="https://example.com/literature">
          <span property="name">Literature</span></a>
        <meta property="position" content="1">
      </li>
      ›
      <li property="itemListElement" typeof="ListItem">
        <span property="name">Award Winners</span>
        <meta property="position" content="2">
      </li>
    </ol>
  </body>
</html>
```

Veja um exemplo de microdados compatíveis com trilhas de navegação estrutural múltiplas:

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="https://example.com/books">
            <span itemprop="name">Books</span></a>
        <meta itemprop="position" content="1" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/WebPage"
           itemprop="item" itemid="https://example.com/books/sciencefiction"
           href="https://example.com/books/sciencefiction">
          <span itemprop="name">Science Fiction</span></a>
        <meta itemprop="position" content="2" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="https://example.com/books/sciencefiction/awardwinners">
          <span itemprop="name">Award Winners</span></a>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="https://example.com/literature">
          <span itemprop="name">Literature</span></a>
        <meta itemprop="position" content="1" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <span itemprop="name">Award Winners</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </body>
</html>
```

Veja um exemplo de um bloco de navegação estrutural em HTML na página como parte do design visual.

```
<html>
  <head>
    <title>Award Winners</title>
  </head>
  <body>
    <ol>
      <li>
        <a href="https://www.example.com/books">Books</a>
      </li>
      <li>
        <a href="https://www.example.com/books/sciencefiction">Science Fiction</a>
      </li>
      <li>
        Award Winners
      </li>
    </ol>
    <ol>
      <li>
        <a href="https://www.example.com/literature">Literature</a>
      </li>
      <li>
        Award Winners
      </li>
    </ol>
  </body>
</html>
```

## Diretrizes

Siga estas diretrizes e qualifique seu conteúdo para exibição com as navegações estruturais na Pesquisa Google.

- [Fundamentos da Pesquisa](https://developers.google.com/search/docs/essentials?hl=pt-br)
- [Diretrizes gerais de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=pt-br)

Recomendamos oferecer navegação estrutural que represente um caminho típico do usuário até uma página em vez de
simplesmente espelhar a estrutura do URL. Não é necessário incluir uma navegação estrutural `ListItem`
para o caminho de nível superior (nome do domínio ou do host do site) nem para a página em si.

## Definições de tipos de dados estruturados

Para especificar a navegação estrutural, defina um `BreadcrumbList` que contenha pelo menos dois
`ListItems`. É necessário incluir as propriedades obrigatórias para que seu conteúdo esteja qualificado
para exibição na navegação estrutural.

### `BreadcrumbList`

`BreadcrumbList` é o item de contêiner que tem todos os elementos da lista. A
definição completa de `BreadcrumbList` está disponível em
[schema.org/BreadcrumbList](https://schema.org/BreadcrumbList) (em inglês).
Veja as propriedades com suporte do Google:

| Propriedades obrigatórias |
| --- |
| `itemListElement` | `ListItem`<br>É uma matriz de navegações estruturais listadas em uma ordem específica. Especifique cada navegação estrutural com um<br>[`ListItem`](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#list-item). Exemplo:<br>```<br>{<br>"@context": "https://schema.org",<br>"@type": "BreadcrumbList",<br>  "itemListElement": [{<br>    "@type": "ListItem",<br>    "position": 1,<br>    "name": "Books",<br>    "item": "https://example.com/books"<br>  },{<br>    "@type": "ListItem",<br>    "position": 2,<br>    "name": "Authors",<br>    "item": "https://example.com/books/authors"<br>  },{<br>    "@type": "ListItem",<br>    "position": 3,<br>    "name": "Ann Leckie",<br>    "item": "https://example.com/books/authors/annleckie"<br>  }]<br>}<br>``` |

### `ListItem`

`ListItem` contém detalhes sobre um item individual na lista. A definição completa
de `ListItem` está disponível em
[schema.org/ListItem](https://schema.org/ListItem) (em inglês).
Veja as propriedades com suporte do Google:


| Propriedades obrigatórias |
| --- |
| `item` | `URL` ou um<br>subtipo de `Thing`<br>É o URL da página da Web que representa a navegação estrutural. Há duas maneiras de especificar<br>`item`:<br>- `URL`: especifique o URL da página. Exemplo:<br>   <br>  <br>  <br>  <br>  <br>  <br>  <br>  <br>  ```<br>  "item": "https://example.com/books"<br>  ```<br>  <br>- `Thing`: use um código para especificar o URL com base no formato de marcação usado:<br>   <br>  - **JSON-LD**: use `@id` para especificar o URL.<br>  - **Microdados**: é possível usar `href` ou `itemid`<br>     para especificar o URL.<br>  - **RDFa**: é possível usar `about`, `href`<br>     ou `resource` para especificar o URL.<br>Se a navegação estrutural for o último item na trilha, `item` não será<br>obrigatório. Se `item` não for incluído no último item, o Google usará o URL<br>da página que o contém. |
| `name` | `Text`<br>É o título da navegação estrutural que aparece para o usuário. Se você usar<br>`Thing` com `name` em vez de `URL` para especificar `item`, então `name` não é obrigatório. |
| `position` | `Integer`<br>É a posição da navegação estrutural na trilha. A posição 1<br>é o começo da trilha. |

## Monitorar pesquisas aprimoradas com o Search Console

O Search Console é uma ferramenta que ajuda você a monitorar o desempenho das suas páginas na Pesquisa Google.
Não é preciso se inscrever na plataforma para ser incluído nos resultados da Pesquisa Google,
mas isso pode ajudar você a entender e melhorar como vemos seu site. Recomendamos
verificar o Search Console nos seguintes casos:


1. [Depois de implantar os dados estruturados pela primeira vez](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-deploying)
2. [Depois de lançar novos modelos ou atualizar o código](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-releasing)
3. [Análise periódica do tráfego](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#analyzing-periodically)

Monitoring Rich Results in Search Console - Google Search Console Training - YouTube

Google Search Central

697K subscribers

[Monitoring Rich Results in Search Console - Google Search Console Training](https://www.youtube.com/watch?v=Vmfvf8nG09k)

Google Search Central

Search

Watch later

Share

Copy link

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

More videos

## More videos

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

[Watch on](https://www.youtube.com/watch?v=Vmfvf8nG09k&embeds_referring_euri=https%3A%2F%2Fdevelopers.google.com%2F&embeds_referring_origin=https%3A%2F%2Fdevelopers.google.com)

0:00

0:00 / 7:43•Live

•

[Watch on YouTube](https://www.youtube.com/watch?v=Vmfvf8nG09k "Watch on YouTube")

### Depois de implantar os dados estruturados pela primeira vez

Depois que o Google indexar as páginas, procure problemas com o
[relatório de status da pesquisa aprimorada](https://support.google.com/webmasters/answer/7552505?hl=pt-br) relevante.
Em condições ideais, vai haver um aumento de itens válidos e nenhum aumento de itens inválidos. Se você encontrar problemas
nos dados estruturados, faça o seguinte:

1. [Corrija os itens inválidos](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#troubleshooting).
2. [Inspecione um URL ativo](https://support.google.com/webmasters/answer/9012289?hl=pt-br#test_live_page) para verificar se o problema persiste.
3. [Solicite a validação](https://support.google.com/webmasters/answer/7552505?hl=pt-br#validation) com o relatório de status.

### Depois de lançar novos modelos ou atualizar o código

Ao fazer mudanças significativas no site, monitore aumentos nos itens inválidos de dados estruturados.


- Caso você perceba um **aumento nos itens inválidos**, talvez tenha lançado um novo modelo que não funcione ou o site esteja interagindo com o modelo
existente de uma maneira nova e incorreta.
- Caso você veja uma **diminuição nos itens válidos** (não correspondidos por um aumento nos itens inválidos), talvez não esteja
mais incorporando os dados estruturados às páginas. Use a [Ferramenta de inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-br) para saber o que está causando o problema.

### Análise periódica do tráfego

Analise o tráfego da Pesquisa Google com o [Relatório de desempenho](https://support.google.com/webmasters/answer/7576553?hl=pt-br).
Os dados vão mostrar com que frequência sua página aparece como aprimorada na Pesquisa, com que frequência os usuários clicam nela e qual é
a posição média dela nos resultados. Também é possível extrair automaticamente esses
resultados com a [API Search Console](https://developers.google.com/webmaster-tools/search-console-api-original/v3/how-tos/search_analytics?hl=pt-br).






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

- [Consulte as diretrizes](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#guidelines) novamente para identificar se o conteúdo não está em conformidade
com elas. O problema pode ser causado por conteúdo com spam ou uso de marcação com spam.
No entanto, talvez o problema não seja de sintaxe e, por isso, o teste de pesquisa aprimorada não poderá
identificá-lo.

- [Resolva problemas relacionados à ausência e à queda no total de pesquisas aprimoradas](https://support.google.com/webmasters/answer/7552505?hl=pt-br#missing-jobs).
- Aguarde algum tempo antes de voltar a rastrear e reindexar. Pode levar vários dias depois da publicação de uma página para que o Google a localize e rastreie. Para perguntas gerais sobre rastreamento e indexação, consulte as [Perguntas frequentes sobre rastreamento e indexação da Pesquisa Google](https://developers.google.com/search/help/crawling-index-faq?hl=pt-br).

- Poste uma pergunta no [fórum da Central da Pesquisa Google](https://support.google.com/webmasters/community?hl=pt-br)

Isso foi útil?



 Envie comentários



Exceto em caso de indicação contrária, o conteúdo desta página é licenciado de acordo com a [Licença de atribuição 4.0 do Creative Commons](https://creativecommons.org/licenses/by/4.0/), e as amostras de código são licenciadas de acordo com a [Licença Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). Para mais detalhes, consulte as [políticas do site do Google Developers](https://developers.google.com/site-policies?hl=pt-br). Java é uma marca registrada da Oracle e/ou afiliadas.

Última atualização 2025-02-18 UTC.

Informações


Chat


API


## Informações da página

bug\_reportfullscreenclose\_fullscreenclose

### Nesta página

- Nesta página
- [Disponibilidade do recurso](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#availability)
- [Como adicionar dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#add-structured-data)
- [Exemplos](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#example)
  - [Trilha de navegação estrutural única](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#year-genre%20example)
  - [Trilha de navegação estrutural múltipla](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#html_example)
- [Diretrizes](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#guidelines)
- [Definições de tipos de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#structured-data-type-definitions)
  - [BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#breadcrumb-list)
  - [ListItem](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#list-item)
- [Monitorar pesquisas aprimoradas com o Search Console](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#monitor)
  - [Depois de implantar os dados estruturados pela primeira vez](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-deploying)
  - [Depois de lançar novos modelos ou atualizar o código](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#after-releasing)
  - [Análise periódica do tráfego](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#analyzing-periodically)
- [Solução de problemas](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br#troubleshooting)

### Pontos principais

GERADO COM IA

- Breadcrumb structured data enhances a website's appearance in search results and improves user navigation by representing a page's position within the site hierarchy.
- Websites can implement BreadcrumbList structured data using JSON-LD (recommended), RDFa, or Microdata, ensuring the structured data accurately reflects typical user paths to a page.
- Key structured data properties include \`BreadcrumbList\`, \`ListItem\`, \`item\` for the breadcrumb URL, and \`position\` for its order; multiple \`BreadcrumbList\` items can be used for pages with multiple access paths.
- Utilize Google's Rich Results Test and URL Inspection tool to validate implementation and ensure Google can access and understand the structured data.
- Monitor structured data performance in Google Search Console and consult Google's guidelines to troubleshoot any errors or unexpected behavior.

outlined\_flag