URL: https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br
---
[Ir para o conteúdo principal](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#main-content)

[![Google Search Central](https://developers.google.com/static/search/images/google-search-central-logo.svg?hl=pt-br)](https://developers.google.com/search?hl=pt-br)

- [GoogleSearch Central](https://developers.google.com/search?hl=pt-br)

`/`

- [English](https://developers.google.com/search/docs/appearance/structured-data/video)
- [Deutsch](https://developers.google.com/search/docs/appearance/structured-data/video?hl=de)
- [Español](https://developers.google.com/search/docs/appearance/structured-data/video?hl=es)
- [Español – América Latina](https://developers.google.com/search/docs/appearance/structured-data/video?hl=es-419)
- [Français](https://developers.google.com/search/docs/appearance/structured-data/video?hl=fr)
- [Indonesia](https://developers.google.com/search/docs/appearance/structured-data/video?hl=id)
- [Italiano](https://developers.google.com/search/docs/appearance/structured-data/video?hl=it)
- [Polski](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pl)
- [Português – Brasil](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br)
- [Tiếng Việt](https://developers.google.com/search/docs/appearance/structured-data/video?hl=vi)
- [Türkçe](https://developers.google.com/search/docs/appearance/structured-data/video?hl=tr)
- [Русский](https://developers.google.com/search/docs/appearance/structured-data/video?hl=ru)
- [العربيّة](https://developers.google.com/search/docs/appearance/structured-data/video?hl=ar)
- [हिंदी](https://developers.google.com/search/docs/appearance/structured-data/video?hl=hi)
- [ภาษาไทย](https://developers.google.com/search/docs/appearance/structured-data/video?hl=th)
- [中文 – 简体](https://developers.google.com/search/docs/appearance/structured-data/video?hl=zh-cn)
- [中文 – 繁體](https://developers.google.com/search/docs/appearance/structured-data/video?hl=zh-tw)
- [日本語](https://developers.google.com/search/docs/appearance/structured-data/video?hl=ja)
- [한국어](https://developers.google.com/search/docs/appearance/structured-data/video?hl=ko)

[Fazer login](https://developers.google.com/_d/signin?continue=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fappearance%2Fstructured-data%2Fvideo%3Fhl%3Dpt-br&prompt=select_account)

- [Documentation](https://developers.google.com/search/docs?hl=pt-br)

[Search Console](https://goo.gle/searchconsole)

**Agora estamos no LinkedIn**: para acessar notícias e recursos da Pesquisa Google sobre como tornar seu site detectável, [siga nosso perfil no LinkedIn](https://www.linkedin.com/showcase/googlesearchcentral/).




- [Página inicial](https://developers.google.com/?hl=pt-br)
- [Search Central](https://developers.google.com/search?hl=pt-br)
- [Documentation](https://developers.google.com/search/docs?hl=pt-br)



 Envie comentários



- Nesta página
- [Como adicionar dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#add-structured-data)
- [Exemplos](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#examples)
  - [Resultado de vídeo padrão](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#standard-example)
  - [Selo AO VIVO](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#live-example)
  - [Clip](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clips-example)
  - [SeekToAction](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seektoaction)
- [Diretrizes](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#guidelines)
  - [Diretrizes do selo AO VIVO](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#livestream-guidelines)
  - [Práticas recomendadas para fazer marcações de tempo no YouTube](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#best-practices-youtube)
  - [Diretrizes de Clip e SeekToAction](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip-guidelines)
- [Definições de tipos de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#structured-data-type-definitions)
  - [VideoObject](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object)
  - [BroadcastEvent](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event)
  - [Clip](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip)
  - [SeekToAction](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seek)
- [Monitorar pesquisas aprimoradas com o Search Console](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#monitor)
  - [Depois de implantar os dados estruturados pela primeira vez](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#after-deploying)
  - [Depois de lançar novos modelos ou atualizar o código](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#after-releasing)
  - [Análise periódica do tráfego](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#analyzing-periodically)
- [Solução de problemas](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#troubleshooting)

# Dados estruturados de vídeo ( `VideoObject`, `Clip`, `BroadcastEvent`)

bookmark\_border

Mantenha tudo organizado com as coleções


Salve e categorize o conteúdo com base nas suas preferências.


Embora o Google tente entender automaticamente os detalhes do vídeo, é possível marcar o vídeo com [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object) para influenciar as
informações que aparecem nos resultados, como a descrição, o URL da miniatura, a data do upload
e a duração. Adicionar dados estruturados de vídeo
às suas [páginas de exibição](https://developers.google.com/search/docs/appearance/video?hl=pt-br#watch-page) também pode facilitar
a descoberta do vídeo pelo Google. Os vídeos podem aparecer em vários locais
diferentes no Google, incluindo a página principal de resultados da pesquisa, o modo de vídeo, o Imagens do Google
e o [Google Discover](https://developers.google.com/search/docs/appearance/google-discover?hl=pt-br):

![Conteúdo de vídeo nos resultados da pesquisa do Google, na guia de vídeo e no Discover](https://developers.google.com/static/search/docs/images/video-on-google.png?hl=pt-br)

Com base na marcação da página de exibição, seus vídeos também podem se qualificar para os seguintes
recursos de vídeo específicos:

| **Recursos de vídeo** |
| --- |
| **Selo AO VIVO**: marque o vídeo com<br>[`BroadcastEvent`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event) para adicionar um selo AO VIVO a ele. O selo AO VIVO pode ser aplicado a vídeos públicos transmitidos ao vivo com qualquer duração. Veja alguns exemplos:<br>- Eventos esportivos<br>- Premiações<br>- Vídeos de influenciadores<br>- Jogos com streaming de vídeo ao vivo<br>Siga as [diretrizes do selo AO VIVO](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#livestream-guidelines) e use<br>a [API Indexing](https://developers.google.com/search/apis/indexing-api/v3/quickstart?hl=pt-br) para garantir que o<br>Google rastreie a página no momento certo. | ![Vídeos com selo AO VIVO nos resultados da pesquisa](https://developers.google.com/static/search/docs/images/video-livestream.png?hl=pt-br) |
| **Momentos importantes**<br>O recurso Momentos importantes é uma maneira de navegar por segmentos de vídeo como capítulos em um livro,<br>o que pode ajudar os usuários a interagir mais profundamente com o conteúdo. A Pesquisa Google tenta detectar automaticamente<br>os segmentos dos vídeos e mostrar os Momentos importantes para os usuários sem que você precise<br>fazer nada. Como alternativa, é possível informar manualmente ao Google sobre os pontos importantes do vídeo. Priorizamos os Momentos<br>importantes definidos por você, seja em dados estruturados ou na descrição do YouTube.<br> <br>- **Se o vídeo estiver incorporado à sua página da Web ou se você tiver uma plataforma de vídeo**, há duas maneiras de ativar os Momentos importantes:<br>   <br>  - [Dados estruturados `Clip`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip):<br>     especifique o ponto de início e de término exatos para cada segmento, assim como o rótulo que será exibido em cada<br>     um. Esse recurso está disponível em todos os idiomas em que é possível acessar a Pesquisa Google.<br>  - [Dados estruturados `SeekToAction`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seek):<br>     informe onde as marcações de tempo geralmente são inseridas na estrutura do seu URL<br>     para que o Google possa identificar de modo automático os Momentos importantes e vincular os usuários a esses pontos do vídeo. Esse<br>     recurso está disponível nos seguintes idiomas: inglês, espanhol, português, italiano, chinês,<br>     francês, japonês, alemão, turco, coreano, holandês e russo.<br>- **Se o vídeo estiver hospedado no YouTube**, especifique as marcações de tempo e os rótulos exatos<br>   na descrição do vídeo no YouTube. Veja as<br>   [práticas recomendadas para incluir marcações de tempo nas descrições do YouTube](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#best-practices-youtube).<br>   Esse recurso está disponível em todos os idiomas em que é possível acessar a Pesquisa Google. Se você quiser ativar os<br>   capítulos de vídeo no YouTube, siga estas<br>   [diretrizes adicionais](https://support.google.com/youtube/answer/9884579?hl=pt-br).<br>   <br>Para desativar completamente o recurso Momentos importantes e impedir que o Google tente mostrar<br>automaticamente esses pontos do seu vídeo, use a<br>tag [`nosnippet`](https://developers.google.com/search/docs/appearance/snippet?hl=pt-br#nosnippet) `meta`. | ![Vídeo com momentos importantes nos resultados da pesquisa](https://developers.google.com/static/search/docs/images/video-key-moments.png?hl=pt-br) |
| **Vídeos educacionais**:<br>ajude alunos e professores a encontrar seus vídeos educacionais adicionando dados estruturados relacionados a eles.<br>Para mais informações sobre disponibilidade de recursos,<br>diretrizes e exemplos, veja a<br>[documentação de vídeos educacionais](https://developers.google.com/search/docs/appearance/structured-data/learning-video?hl=pt-br). | ![Vídeos educacionais nos resultados da pesquisa](https://developers.google.com/static/search/docs/images/learning_videos_example.png?hl=pt-br) |

## Como adicionar dados estruturados

Os dados estruturados são um formato padronizado para fornecer informações sobre uma página e classificar o
conteúdo dela. Caso você não saiba muito sobre o assunto, veja
[como os dados estruturados funcionam](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br).


Esta é uma visão geral de como criar, testar e lançar dados estruturados.

1. Adicione as [propriedades obrigatórias](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#structured-data-type-definitions). Com base no
    formato que você está usando, saiba onde [inserir dados estruturados na página](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=pt-br#format-placement).


2. Siga as [diretrizes](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#guidelines).
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

### Resultado de vídeo padrão

![Exemplo de resultados padrão da pesquisa de vídeo](https://developers.google.com/static/search/docs/images/video-search-results.png?hl=pt-br)

Veja um exemplo de um único [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object).

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#json-ld)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#microdados)

```
<html>
  <head>
    <title>Introducing the self-driving bicycle in the Netherlands</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Introducing the self-driving bicycle in the Netherlands",
      "description": "This spring, Google is introducing the self-driving bicycle in Amsterdam, the world's premier cycling city. The Dutch cycle more than any other nation in the world, almost 900 kilometres per year per person, amounting to over 15 billion kilometres annually. The self-driving bicycle enables safe navigation through the city for Amsterdam residents, and furthers Google's ambition to improve urban mobility with technology. Google Netherlands takes enormous pride in the fact that a Dutch team worked on this innovation that will have great impact in their home country.",
      "thumbnailUrl": [\
        "https://example.com/photos/1x1/photo.jpg",\
        "https://example.com/photos/4x3/photo.jpg",\
        "https://example.com/photos/16x9/photo.jpg"\
       ],
      "uploadDate": "2024-03-31T08:00:00+08:00",
      "duration": "PT1M54S",
      "contentUrl": "https://www.example.com/video/123/file.mp4",
      "embedUrl": "https://www.example.com/embed/123",
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": 5647018
      },
      "regionsAllowed": ["US", "NL"]
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

```
<html itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
<head>
  <title itemprop="name">Introducing the self-driving bicycle in the Netherlands</title>
</head>
<body>
  <meta itemprop="uploadDate" content="2024-03-31T08:00:00+08:00" />
  <meta itemprop="duration" content="PT1M54S" />
  <p itemprop="description">This spring, Google is introducing the self-driving bicycle in Amsterdam, the world's premier cycling city. The Dutch cycle more than any other nation in the world, almost 900 kilometres per year per person, amounting to over 15 billion kilometres annually. The self-driving bicycle enables safe navigation through the city for Amsterdam residents, and furthers Google's ambition to improve urban mobility with technology. Google Netherlands takes enormous pride in the fact that a Dutch team worked on this innovation that will have great impact in their home country.</p>
  <div itemprop="interactionStatistic" itemtype="https://schema.org/InteractionCounter" itemscope>
    <meta itemprop="userInteractionCount" content="5647018" />
    <meta itemprop="interactionType" itemtype="https://schema.org/WatchAction" />
  </div>
  <link itemprop="embedUrl" href="https://www.example.com/embed/123" />
  <meta itemprop="contentUrl" content="https://www.example.com/video/123/file.mp4" />
  <meta itemprop="regionsAllowed" content="US" />
  <meta itemprop="regionsAllowed" content="NL" />
  <meta itemprop="thumbnailUrl" content="https://example.com/photos/1x1/photo.jpg" />
</body>
</html>
```

### Selo AO VIVO

![Exemplo de um vídeo nos resultados da pesquisa com um selo AO VIVO](https://developers.google.com/static/search/docs/images/video-livestream.png?hl=pt-br)

Veja um exemplo de [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object) e [`BroadcastEvent`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event).

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#json-ld)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#microdados)

```
<html>
  <head>
    <title>Bald Eagle at the Park - Livestream</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "contentURL": "https://example.com/bald-eagle-at-the-park.mp4",
      "description": "Bald eagle at the park livestream.",
      "duration": "PT37M14S",
      "embedUrl": "https://example.com/bald-eagle-at-the-park",
      "expires": "2024-10-30T14:37:14+00:00",
      "regionsAllowed": "US",
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": 4756
      },
      "name": "Bald eagle nest livestream!",
      "thumbnailUrl": "https://example.com/bald-eagle-at-the-park",
      "uploadDate": "2024-10-27T14:00:00+00:00",
      "publication": [\
        {\
          "@type": "BroadcastEvent",\
          "isLiveBroadcast": true,\
          "startDate": "2024-10-27T14:00:00+00:00",\
          "endDate": "2024-10-27T14:37:14+00:00"\
        },\
        {\
          "@type": "BroadcastEvent",\
          "isLiveBroadcast": true,\
          "startDate": "2024-10-27T18:00:00+00:00",\
          "endDate": "2024-10-27T18:37:14+00:00"\
        }\
      ]
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

```
<html itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
<head>
  <title itemprop="name">Bald Eagle at the Park - Livestream</title>
</head>
<body>
  <meta itemprop="uploadDate" content="2024-10-27T14:00:00+00:00" />
  <meta itemprop="duration" content="PT37M14S" />
  <p itemprop="description">Bald eagle at the park livestream.</p>
  <div itemprop="interactionStatistic" itemtype="https://schema.org/InteractionCounter" itemscope>
    <meta itemprop="userInteractionCount" content="4756" />
    <meta itemprop="interactionType" itemtype="https://schema.org/WatchAction" />
  </div>
  <link itemprop="embedUrl" href="https://example.com/bald-eagle-at-the-park" />
  <meta itemprop="expires" content="2024-10-30T14:37:14+00:00" />
  <meta itemprop="contentUrl" content="https://example.com/bald-eagle-at-the-park.mp4" />
  <meta itemprop="regionsAllowed" content="US" />
  <meta itemprop="thumbnailUrl" content="https://example.com/bald-eagle-at-the-park" />
  <div itemprop="publication" itemtype="https://schema.org/BroadcastEvent" itemscope>
    <meta itemprop="isLiveBroadcast" content="true" />
    <meta itemprop="startDate" content="2024-10-27T14:00:00+00:00" />
    <meta itemprop="endDate" content="2024-10-27T14:37:14+00:00" />
  </div>
  <div itemprop="publication" itemtype="https://schema.org/BroadcastEvent" itemscope>
    <meta itemprop="isLiveBroadcast" content="true" />
    <meta itemprop="startDate" content="2024-10-27T18:00:00+00:00" />
    <meta itemprop="endDate" content="2024-10-27T18:37:14+00:00" />
  </div>
</body>
</html>
```

### `Clip`

![Exemplo de um vídeo nos resultados da pesquisa com Momentos importantes](https://developers.google.com/static/search/docs/images/video-key-moments.png?hl=pt-br)

Veja um exemplo de [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object)
e [`Clip`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip).

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#json-ld)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#microdados)

```
<html>
  <head>
    <title>Cat jumps over the fence</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "VideoObject",
      "name": "Cat video",
      "duration": "PT10M",
      "uploadDate": "2024-07-19T08:00:00+08:00",
      "thumbnailUrl": "https://www.example.com/cat.jpg",
      "description": "Watch this cat jump over a fence!",
      "contentUrl": "https://www.example.com/cat_video_full.mp4",
      "ineligibleRegion": "US",
      "hasPart": [{\
        "@type": "Clip",\
        "name": "Cat jumps",\
        "startOffset": 30,\
        "endOffset": 45,\
        "url": "https://www.example.com/example?t=30"\
      },\
      {\
        "@type": "Clip",\
        "name": "Cat misses the fence",\
        "startOffset": 111,\
        "endOffset": 150,\
        "url": "https://www.example.com/example?t=111"\
      }]
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

```
<html itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
<head>
  <title itemprop="name">Cat jumps over the fence</title>
</head>
<body>
  <meta itemprop="uploadDate" content="2024-07-19" />
  <meta itemprop="duration" content="P10M" />
  <p itemprop="description">Watch this cat jump over a fence!</p>
  <div itemprop="interactionStatistic" itemtype="https://schema.org/InteractionCounter" itemscope>
    <meta itemprop="userInteractionCount" content="5647018" />
    <meta itemprop="interactionType" itemtype="https://schema.org/WatchAction" />
  </div>
  <div itemprop="hasPart" itemtype="https://schema.org/Clip" itemscope>
    <meta itemprop="name" content="Cat jumps" />
    <meta itemprop="startOffset" content="30" />
    <meta itemprop="endOffset" content="45" />
    <meta itemprop="url" content="https://www.example.com/example?t=30" />
  </div>
  <div itemprop="hasPart" itemtype="https://schema.org/Clip" itemscope>
    <meta itemprop="name" content="Cat misses the fence" />
    <meta itemprop="startOffset" content="111" />
    <meta itemprop="endOffset" content="150" />
    <meta itemprop="url" content="https://www.example.com/example?t=111" />
  </div>
  <link itemprop="embedUrl" href="https://www.example.com/embed/123" />
  <meta itemprop="contentUrl" content="https://www.example.com/cat_video_full.mp4" />
  <meta itemprop="ineligibleRegion" content="US" />
  <meta itemprop="thumbnailUrl" content="https://www.example.com/cat.jpg" />
</body>
</html>
```

### `SeekToAction`

Veja um exemplo de um único [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object)
que inclui as [propriedades adicionais](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seek) necessárias para a marcação `SeekToAction`.

[JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#json-ld)[Microdados](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#microdados)

```
<html>
  <head>
    <title>John Smith (@johnsmith123) on VideoApp: My daily workout! #stayingfit</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "potentialAction" : {
        "@type": "SeekToAction",
        "target": "https://video.example.com/watch/videoID?t={seek_to_second_number}",
        "startOffset-input": "required name=seek_to_second_number"
      },
      "name": "My daily workout!",
      "uploadDate": "2024-07-19T08:00:00+08:00",
      "thumbnailUrl": "https://www.example.com/daily-workout.jpg",
      "description": "My daily workout!",
      "embedUrl": "https://example.com/daily-workout"
    }
    </script>
  </head>
  <body>
  </body>
</html>
```

```
<html itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
<head>
  <title itemprop="name">John Smith (@johnsmith123) on VideoApp: My daily workout! #stayingfit</title>
</head>
<body>
  <meta itemprop="uploadDate" content="2024-07-19" />
  <p itemprop="description">My daily workout!</p>
  <div itemprop="potentialAction" itemtype="https://schema.org/SeekToAction" itemscope>
    <meta itemprop="target" content="https://video.example.com/watch/videoID?t={seek_to_second_number}" />
    <meta itemprop="startOffset-input" content="required name=seek_to_second_number" />
  </div>
  <link itemprop="embedUrl" href="https://example.com/daily-workout" />
  <meta itemprop="thumbnailUrl" content="https://www.example.com/daily-workout.jpg" />
</body>
</html>
```

## Diretrizes

Para que os dados estruturados de vídeo se qualifiquem para uso na Pesquisa Google, siga os
[Fundamentos da Pesquisa](https://developers.google.com/search/docs/essentials?hl=pt-br),
as [diretrizes gerais de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=pt-br)
e os [requisitos de indexação de vídeo](https://developers.google.com/search/docs/appearance/video?hl=pt-br#indexing-criteria).

Além disso, recomendamos que você confira estas diretrizes caso elas se apliquem ao conteúdo do seu vídeo:

- [Diretrizes de transmissões ao vivo](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#livestream-guidelines)
- [Diretrizes de `Clip` e `SeekToAction`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip-guidelines)
- [Práticas recomendadas para fazer marcações de tempo no YouTube](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#best-practices-youtube)

### Diretrizes do selo AO VIVO

Se você quiser adicionar [`BroadcastEvent`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event) para marcar vídeos de transmissões ao vivo,
siga estas diretrizes:


- Não use linguagem vulgar ou possivelmente ofensiva nos dados estruturados.
- Para garantir que o Google rastreie seu vídeo de transmissão ao vivo no momento certo, use a
[API Indexing](https://developers.google.com/search/apis/indexing-api/v3/quickstart?hl=pt-br). Chame a API para os seguintes eventos:
   - Quando o vídeo for transmitido ao vivo.
  - Quando o vídeo parar de transmitir e a marcação da página for atualizada para indicar a `endDate`.
  - Sempre que uma mudança acontecer na marcação e o Google precisar ser notificado.

### Práticas recomendadas para fazer marcações de tempo no YouTube

Se o vídeo estiver hospedado no YouTube, é possível que a Pesquisa Google ative os Momentos importantes automaticamente com base
na descrição do vídeo.
Nesse caso, não será necessário fazer as marcações de tempo específicas. No entanto, é possível que você nos informe mais explicitamente sobre os pontos importantes
do vídeo. Nós damos preferência a essas informações. O diagrama a seguir mostra como as marcações de tempo
e as etiquetas de uma descrição do YouTube aparecem nos resultados da pesquisa:

![Um vídeo com marcações de tempo e etiquetas nos resultados da pesquisa](https://developers.google.com/static/search/docs/images/video-timestamps-on-youtube.png?hl=pt-br)**1\. Etiqueta**: é o título do clipe.

**2\. Marcação de tempo**: é o momento em que um clipe começa.

Tenha em mente as seguintes diretrizes ao formatar marcações de tempo e etiquetas nas descrições do YouTube:

- Formate a marcação de tempo desta maneira: `[hour]:[minute]:[second]`. Se não houver hora, não é necessário incluí-la.
- Especifique a etiqueta e a marcação de tempo na mesma linha.
- Coloque cada marcação de tempo em uma nova linha na descrição do vídeo.
- Vincule a marcação de tempo ao ponto especificado no vídeo.
- Verifique se a etiqueta contém pelo menos uma palavra.
- Liste as marcações de tempo em ordem cronológica.

Se você quiser ativar os capítulos de vídeo no YouTube, siga estas [diretrizes adicionais](https://support.google.com/youtube/answer/9884579?hl=pt-br).

### Diretrizes de `Clip` e `SeekToAction`

Ao adicionar dados estruturados [`Clip`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip) ou [`SeekToAction`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seek) para
marcar segmentos de vídeos, siga estas diretrizes:

- O vídeo precisa conseguir criar links diretos para um ponto que não seja o início no URL dele. Por exemplo, `https://www.example.com/example?t=30` inicia o vídeo 30 segundos depois do começo.
- Dados estruturados `VideoObject` precisam ser adicionados a uma página em que os usuários consigam assistir o vídeo. Não direcione os usuários a uma página que não exibe o vídeo.
- A duração total do vídeo precisa ser de no mínimo 30 segundos.
- O vídeo precisa incluir as propriedades obrigatórias listadas na documentação de dados estruturados [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object).
- **Somente para dados estruturados `Clip`**: confira se não há dois clipes no mesmo vídeo definidos na mesma página e que compartilhem um tempo de
início.
- **Somente para dados estruturados `SeekToAction`**: o Google precisa conseguir
[buscar os arquivos de conteúdo em vídeo](https://developers.google.com/search/docs/appearance/video?hl=pt-br#allow-fetch).

## Definições de tipos de dados estruturados

Esta seção descreve os tipos de dados estruturados relacionados a recursos de vídeo da Pesquisa Google.
É necessário incluir as propriedades [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object) obrigatórias para que o conteúdo seja qualificado para uso na Pesquisa Google. Você também pode incluir as propriedades recomendadas para adicionar mais informações sobre o `VideoObject`,
o que pode proporcionar uma melhor experiência do usuário. Além de [`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object), também é possível adicionar os
seguintes tipos de dados para ativar os aprimoramentos de vídeo na Pesquisa Google:

- **[`BroadcastEvent`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event)**: marque vídeos de transmissões ao vivo
para incluir um selo AO VIVO neles.
- **[`Clip`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip)**: marque segmentos importantes do vídeo para ajudar
os usuários a navegar rapidamente até pontos específicos dele.

- **[`SeekToAction`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#seek)**: para ativar os Momentos importantes, indique como a estrutura do URL
funciona. Assim o Google poderá identificar automaticamente os Momentos importantes e fornecer aos usuários os links desses pontos do vídeo.

- **[Vídeos educacionais](https://developers.google.com/search/docs/appearance/structured-data/learning-video?hl=pt-br)**:
ajude alunos e professores a encontrar seus vídeos educacionais adicionando dados estruturados relacionados a eles.


### `VideoObject`

A definição completa de `VideoObject` está disponível em
[schema.org/VideoObject](https://schema.org/VideoObject) (em inglês).
Se você não incluir as propriedades obrigatórias, talvez o Google não consiga extrair informações sobre o vídeo. Você também pode incluir as propriedades recomendadas para adicionar mais informações sobre o conteúdo,
o que pode proporcionar uma melhor experiência do usuário.

| Propriedades obrigatórias |
| --- |
| `name` | `Text`<br>É o título do vídeo. Use um texto exclusivo na propriedade `name`.<br>para cada vídeo no site. |
| `thumbnailUrl` | `URL` repetido<br>É um URL que aponta para o arquivo de imagem de miniatura exclusivo do vídeo. Siga as [diretrizes para imagens de miniaturas](https://developers.google.com/search/docs/appearance/video?hl=pt-br#provide-a-high-quality-thumbnail). |
| `uploadDate` | `DateTime`<br>É a data e a hora em que o vídeo foi publicado pela primeira vez, no<br>[formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).<br>Recomendamos que você forneça informações de fuso horário. Caso contrário, o padrão vai ser o<br>[fuso horário usado pelo Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=pt-br#timezone). |

| Propriedades recomendadas |
| --- |
| `contentUrl` | `URL`<br>Um URL que aponta para os bytes de conteúdo reais do arquivo de vídeo, em um dos<br>[tipos de arquivos compatíveis](https://developers.google.com/search/docs/appearance/video?hl=pt-br#supported-video-files).<br>Não crie um link para a página em que o vídeo está localizado. Ele precisa ser o<br>URL dos bytes de conteúdo real do arquivo de vídeo.<br>```<br>"contentUrl": "https://www.example.com/video/123/file.mp4"<br>```<br>Siga nossas<br>[práticas recomendadas de vídeo](https://developers.google.com/search/docs/appearance/video?hl=pt-br). |
| `description` | `Text`<br>É a descrição do vídeo. Use um texto exclusivo na propriedade `description`<br>para cada vídeo no site. As tags HTML são ignoradas. |
| `duration` | `Duration`<br>É a duração do vídeo, no<br>[formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations).<br>Por exemplo, `PT00H30M5S` representa uma duração de "30 minutos e 5 segundos". |
| `embedUrl` | `URL`<br>É um URL que aponta para um player do vídeo específico. Não crie um link para a página em que o vídeo está localizado.<br>Ele precisa ser o URL do próprio player de vídeo. Geralmente, essa é a informação no<br>atributo `src` de um elemento `<embed>`.<br>```<br>"embedUrl": "https://www.example.com/embed/123"<br>```<br>Siga nossas<br>[práticas recomendadas de vídeo](https://developers.google.com/search/docs/appearance/video?hl=pt-br). |
| `expires` | `DateTime` <br>Se aplicável, a data e a hora finais em que o vídeo vai estar disponível, no<br>[formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Não<br>forneça essa informação se o vídeo não for expirar. Recomendamos que você forneça<br>informações de fuso horário. Caso contrário, o padrão vai ser o<br>[fuso horário usado pelo Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=pt-br#timezone). |
| `hasPart` | Se o vídeo tiver segmentos importantes, aninhe as [propriedades `Clip` obrigatórias](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#clip) em seu `VideoObject`. Exemplo:<br>```<br><script type="application/ld+json"><br>{<br>  "@context": "https://schema.org/",<br>  "@type": "VideoObject",<br>  "name": "Cat video",<br>  "hasPart": {<br>    "@type": "Clip",<br>    "name": "Cat jumps",<br>    "startOffset": 30,<br>    "url": "https://www.example.com/example?t=30"<br>  }<br>}<br></script><br>``` |
| `ineligibleRegion` | `Place`<br>É a região em que o vídeo não é permitido, se aplicável. Se não especificado, o Google vai presumir que ele é<br>permitido em qualquer lugar. Especifique os países no<br>[formato ISO 3166-1 de duas ou três letras](https://en.wikipedia.org/wiki/ISO_3166-1). Para<br>diversos valores, use vários códigos de país (por exemplo, uma matriz JSON-LD ou várias<br>tags `meta` em microdados). |
| `interactionStatistic` | `InteractionCounter`<br>É o número de visualizações do vídeo. Exemplo:<br>```<br>"interactionStatistic":<br>  {<br>    "@type": "InteractionCounter",<br>    "interactionType": { "@type": "WatchAction" },<br>    "userInteractionCount": 12345<br>  }<br>``` |
| `publication` | Se o vídeo estiver sendo transmitido ao vivo e você quiser se qualificar para o selo AO VIVO, aninhe<br>as [propriedades `BroadcastEvent`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#broadcast-event) em<br>`VideoObject`. Exemplo:<br>```<br><script type="application/ld+json"><br>{<br>  "@context": "https://schema.org/",<br>  "@type": "VideoObject",<br>  "name": "Cat video",<br>  "publication": {<br>    "@type": "BroadcastEvent",<br>    "name": "First scheduled broadcast",<br>    "isLiveBroadcast": true,<br>    "startDate": "2018-10-27T14:00:00+00:00",<br>    "endDate": "2018-10-27T14:37:14+00:00"<br>  }<br>}<br></script><br>``` |
| `regionsAllowed` | `Place`<br>São as regiões onde o vídeo é permitido, se aplicável. Se não especificado, o Google vai presumir que ele é<br>permitido em qualquer lugar. Especifique os países no<br>[formato ISO 3166-1 de duas ou três letras](https://en.wikipedia.org/wiki/ISO_3166-1).<br>Para diversos valores, use vários códigos de país (por exemplo, uma matriz JSON-LD ou várias<br>tags `meta` em microdados). |

### `BroadcastEvent`

Para se qualificar para exibição com um selo AO VIVO, aninhe as seguintes
propriedades em [VideoObject](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object). Ainda que as propriedades
`BroadcastEvent` não sejam obrigatórias, você precisa incluir as propriedades a seguir
para que o vídeo se qualifique para ser exibido com um selo AO VIVO.

A definição completa de `BroadcastEvent` está disponível em
[schema.org/BroadcastEvent](https://schema.org/BroadcastEvent) (em inglês).

| Propriedades obrigatórias |
| --- |
| `publication` | `BroadcastEvent`<br>Descreve quando o vídeo será transmitido ao vivo. Pode ser uma lista ou uma única instância. |
| `publication.endDate` | `DateTime`<br>É a hora e a data de quando a transmissão ao vivo termina, ou está prevista para terminar, no<br>[formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).<br>É necessário fornecer `endDate` quando o vídeo terminar e não estiver<br>mais ativo. Se a `endDate` esperada for desconhecida antes do início da transmissão ao vivo, recomendamos fornecer uma `endDate` aproximada.<br>Se a `endDate` estiver no passado ou presente, ela indica que a transmissão terminou e não está mais ao vivo. Se a `endDate` estiver no futuro, ela indica que a transmissão está programada para terminar naquele momento. |
| `publication.isLiveBroadcast` | Booleano<br>Defina como `true` se o vídeo for, tiver sido ou será transmitido<br>ao vivo. |
| `publication.startDate` | `DateTime`<br>Hora e data de início ou início previsto da transmissão ao vivo, no<br>[formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Se a `startDate` estiver no passado ou presente, ela indica que a transmissão começou. Se a `startDate` estiver no futuro, ela vai indicar que a transmissão está programada para começar naquele momento. |

### `Clip`

Para informar ao Google a marcação de tempo e a etiqueta a serem usadas no recurso Momentos importantes, aninhe as seguintes propriedades em
[`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object). Ainda que
as propriedades `Clip` não sejam obrigatórias, é preciso incluir as seguintes propriedades para que
o Google exiba as etiquetas e as marcações de tempo especificadas para o vídeo, em vez dos
segmentos de vídeo que podem ser exibidos automaticamente.

A definição completa de `Clip` está
disponível em [schema.org/Clip](https://schema.org/Clip) (em inglês).


| Propriedades obrigatórias |
| --- |
| `name` | `Text`<br>É um título que descreve o conteúdo do clipe. |
| `startOffset` | `Number`<br>É o tempo de início do clipe expresso como o número em segundos depois do início da obra. |
| `url` | `URL`<br>É um URL que aponta para o tempo de início do clipe.<br>O URL do clipe precisa apontar para o mesmo caminho do URL que o vídeo com parâmetros de consulta adicionais que especificam o tempo. <br>Por exemplo, o URL a seguir significa que o vídeo começa aos dois minutos:<br>```<br>"url": "https://www.example.com/example?t=120"<br>``` |

| Propriedades recomendadas |
| --- |
| `endOffset` | `Number`<br>É o tempo de término do clipe exibido como o número em segundos depois do<br>início da obra. |

### `SeekToAction`

Se quiser informar ao Google como sua estrutura de URL funciona, para que ele possa exibir Momentos importantes
identificados automaticamente no vídeo, aninhe as seguintes propriedades em
[`VideoObject`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#video-object). Ainda que as
propriedades `SeekToAction` não sejam obrigatórias, você precisa incluir as propriedades a seguir
para que o Google entenda como funciona a estrutura do URL e possa fornecer aos usuários links de um ponto do vídeo.

A definição completa de `SeekToAction` está
disponível em [schema.org/SeekToAction](https://schema.org/SeekToAction) (em inglês).


| Propriedades obrigatórias |
| --- |
| `potentialAction` | `SeekToAction`<br>Indica uma possível ação. Inclui as seguintes propriedades aninhadas:<br>- [`potentialAction.startOffset-input`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#start-offset-input)<br>- [`potentialAction.target`](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#target)<br>Exemplo:<br>```<br>{<br>  "@context": "https://schema.org",<br>  "@type": "VideoObject",<br>  "potentialAction" : {<br>    "@type": "SeekToAction",<br>    "target": "https://video.example.com/watch/videoID?t={seek_to_second_number}",<br>    "startOffset-input": "required name=seek_to_second_number"<br>  }<br>}<br>``` |
| `potentialAction.startOffset-input` | `Text`<br>É a string do marcador que o Google identificará como a estrutura de marcação de tempo e<br>substituirá pelo número de segundos para pular. Use o seguinte valor:<br>```<br>"startOffset-input": "required name=seek_to_second_number"<br>```<br>`startOffset-input` é uma propriedade com anotação. Consulte<br>a página [`Potential Actions`](https://schema.org/docs/actions.html#part-4)<br>para mais informações. |
| `potentialAction.target` | `EntryPoint`<br>É o URL da página que contém este `VideoObject`, incluindo um marcador na estrutura do URL<br>que indica onde o Google pode inserir o número de segundos para pular no vídeo.<br>É assim que o Google entende a estrutura do URL e como você formata as marcações de tempo.<br>Substitua a parte da marcação de tempo do URL pela seguinte string de<br>marcador:<br>```<br>{seek_to_second_number}<br>```<br>Por exemplo, substitua a parte da marcação de tempo do URL:<br> <br>```<br>"target": "https://video.example.com/watch/videoID?t=30"<br>```<br>Agora a marcação de tempo tem a seguinte aparência:<br>```<br>"target": "https://video.example.com/watch/videoID?t={seek_to_second_number}"<br>``` |

## Monitorar pesquisas aprimoradas com o Search Console

O Search Console é uma ferramenta que ajuda você a monitorar o desempenho das suas páginas na Pesquisa Google.
Não é preciso se inscrever na plataforma para ser incluído nos resultados da Pesquisa Google,
mas isso pode ajudar você a entender e melhorar como vemos seu site. Recomendamos
verificar o Search Console nos seguintes casos:


1. [Depois de implantar os dados estruturados pela primeira vez](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#after-deploying)
2. [Depois de lançar novos modelos ou atualizar o código](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#after-releasing)
3. [Análise periódica do tráfego](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#analyzing-periodically)

YouTube

### Depois de implantar os dados estruturados pela primeira vez

Depois que o Google indexar as páginas, procure problemas com o
[relatório de status da pesquisa aprimorada](https://support.google.com/webmasters/answer/7552505?hl=pt-br) relevante.
Em condições ideais, vai haver um aumento de itens válidos e nenhum aumento de itens inválidos. Se você encontrar problemas
nos dados estruturados, faça o seguinte:

1. [Corrija os itens inválidos](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#troubleshooting).
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

- [Consulte as diretrizes](https://developers.google.com/search/docs/appearance/structured-data/video?hl=pt-br#guidelines) novamente para identificar se o conteúdo não está em conformidade
com elas. O problema pode ser causado por conteúdo com spam ou uso de marcação com spam.
No entanto, talvez o problema não seja de sintaxe e, por isso, o teste de pesquisa aprimorada não poderá
identificá-lo.

- [Resolva problemas relacionados à ausência e à queda no total de pesquisas aprimoradas](https://support.google.com/webmasters/answer/7552505?hl=pt-br#missing-jobs).
- Aguarde algum tempo antes de voltar a rastrear e reindexar. Pode levar vários dias depois da publicação de uma página para que o Google a localize e rastreie. Para perguntas gerais sobre rastreamento e indexação, consulte as [Perguntas frequentes sobre rastreamento e indexação da Pesquisa Google](https://developers.google.com/search/help/crawling-index-faq?hl=pt-br).

- Poste uma pergunta no [fórum da Central da Pesquisa Google](https://support.google.com/webmasters/community?hl=pt-br)



 Envie comentários



Exceto em caso de indicação contrária, o conteúdo desta página é licenciado de acordo com a [Licença de atribuição 4.0 do Creative Commons](https://creativecommons.org/licenses/by/4.0/), e as amostras de código são licenciadas de acordo com a [Licença Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). Para mais detalhes, consulte as [políticas do site do Google Developers](https://developers.google.com/site-policies?hl=pt-br). Java é uma marca registrada da Oracle e/ou afiliadas.

Última atualização 2025-02-25 UTC.

Informações


Chat


API