#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Exemplo de utilização do script de publicação de artigos
"""

from publish_article import BlogPublisher

# URL base do blog (altere se necessário)
BASE_URL = "http://localhost:5000"

# Criar uma instância do publicador
publisher = BlogPublisher(base_url=BASE_URL)

# Imprimir categorias disponíveis para referência
print("Consultando categorias disponíveis...")
categories = publisher.get_categories()
print("\nCategorias disponíveis:")
for category in categories:
    print(f"- ID: {category['id']}")
    print(f"  Nome: {category['nome']}")
    print(f"  Slug: {category['slug']}")
    print(f"  Cor: {category.get('cor', '#3b82f6')}")
    print()

# Imprimir autores disponíveis para referência
print("Consultando autores disponíveis...")
authors = publisher.get_authors()
print("\nAutores disponíveis:")
for author in authors:
    print(f"- ID: {author['id']}")
    print(f"  Nome: {author['nome']}")
    print(f"  Slug: {author['slug']}")
    print()

# Exemplo de conteúdo HTML do artigo
article_content = """
<h2>Introdução à Revolução Digital</h2>
<p>A revolução digital está transformando rapidamente o mundo em que vivemos. Empresas, governos e indivíduos estão se adaptando a novas formas de trabalhar, comunicar e viver.</p>

<h2>Impacto da Inteligência Artificial</h2>
<p>A inteligência artificial está no centro desta revolução, oferecendo novas possibilidades em praticamente todos os setores da economia.</p>
<ul>
  <li>Automação de processos repetitivos</li>
  <li>Análise avançada de dados</li>
  <li>Personalização em escala</li>
  <li>Novos modelos de negócio</li>
</ul>

<h2>O Futuro do Trabalho</h2>
<p>Com o avanço das tecnologias digitais, o mercado de trabalho está mudando rapidamente. Novas profissões estão surgindo, enquanto outras estão sendo transformadas.</p>

<h2>Desafios da Transformação Digital</h2>
<p>Apesar dos benefícios, a transformação digital também traz desafios significativos:</p>
<ul>
  <li>Inclusão digital</li>
  <li>Privacidade e segurança de dados</li>
  <li>Regulamentação de novas tecnologias</li>
  <li>Adaptação da força de trabalho</li>
</ul>

<h2>Conclusão</h2>
<p>A revolução digital continuará a acelerar nos próximos anos. Empresas e profissionais que conseguirem se adaptar rapidamente estarão em melhor posição para aproveitar as oportunidades e enfrentar os desafios deste novo mundo digital.</p>
"""

# IMPORTANTE: Verifique se as IDs abaixo correspondem a dados existentes em seu banco de dados
# Os IDs usados aqui são apenas para exemplo e provavelmente não correspondem às suas categorias/autores

# Solicitar confirmação antes de publicar
print("\nDeseja prosseguir com a publicação do artigo? (s/n)")
choice = input().lower()

if choice != 's':
    print("Publicação cancelada.")
    exit()

# Publicar o artigo
try:
    print("\nIniciando publicação do artigo...")
    article = publisher.publish_article_with_tags(
        title="A Revolução Digital: Desafios e Oportunidades",
        content=article_content,
        category_id="f442c9ed-c6e4-4e87-918c-391df1bdb0dc",  # ID da categoria Tecnologia (exemplo)
        author_id="21b9a7d2-c8c6-40f5-b776-1a7327349a7a",    # ID do autor (exemplo)
        summary="Uma análise aprofundada sobre como a revolução digital está transformando empresas, governos e a sociedade, com foco nos impactos da inteligência artificial e no futuro do trabalho.",
        image_path="caminho/para/sua/imagem.jpg",            # Substitua pelo caminho da sua imagem
        image_credit="Crédito: Pexels",
        reading_time="5 min de leitura",
        tags=["Tecnologia", "Inteligência Artificial", "Futuro do Trabalho", "Transformação Digital"],
        meta_title="Revolução Digital: Impactos e Tendências para 2025",
        meta_description="Descubra como a revolução digital está transformando o mundo e quais são as principais tendências tecnológicas para os próximos anos."
    )
    
    print("\n✅ Artigo publicado com sucesso!")
    print(f"ID: {article.get('id')}")
    print(f"Título: {article.get('titulo')}")
    print(f"Slug: {article.get('slug')}")
    print(f"URL: {BASE_URL}/noticia/{article.get('slug')}")
    
except Exception as e:
    print(f"\n❌ Erro ao publicar artigo: {e}")