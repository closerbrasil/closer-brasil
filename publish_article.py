#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script para publicar artigos no blog via API

Este script permite a criação e publicação automática de artigos no blog
utilizando a API REST disponibilizada pelo portal de notícias.

Funcionalidades:
- Criar artigo com todas as propriedades
- Fazer upload de imagens
- Adicionar tags ao artigo
- Publicar o artigo automaticamente
"""

import requests
import json
import os
import argparse
import time
from datetime import datetime
from typing import Dict, List, Optional, Any, Union


class BlogPublisher:
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        """
        Inicializa o publicador com URL base da API e chave de autenticação opcional
        
        Args:
            base_url: URL base da API (ex: "http://localhost:5000")
            api_key: Chave de API para autenticação (opcional)
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            'Content-Type': 'application/json'
        }
        
        if api_key:
            self.headers['Authorization'] = f'Bearer {api_key}'
    
    def format_html_content(self, content: str) -> str:
        """
        Formata o conteúdo HTML para garantir compatibilidade com o componente ArticleContent
        e aplicar as classes de estilo corretas.
        
        Args:
            content: Conteúdo HTML original
            
        Returns:
            Conteúdo HTML formatado
        """
        # Adiciona a classe "prose" necessária para a formatação Tailwind
        if "<div class=\"prose" not in content:
            content = f'<div class="prose prose-lg max-w-none">{content}</div>'
            
        return content
    
    def get_categories(self) -> List[Dict[str, Any]]:
        """
        Obtém a lista de categorias disponíveis
        
        Returns:
            Lista de categorias
        """
        response = requests.get(f"{self.base_url}/api/categorias", headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_authors(self) -> List[Dict[str, Any]]:
        """
        Obtém a lista de autores disponíveis
        
        Returns:
            Lista de autores
        """
        response = requests.get(f"{self.base_url}/api/autores", headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_tags(self) -> List[Dict[str, Any]]:
        """
        Obtém a lista de tags disponíveis
        
        Returns:
            Lista de tags
        """
        response = requests.get(f"{self.base_url}/api/tags", headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def upload_image(self, image_path: str) -> Dict[str, str]:
        """
        Faz upload de uma imagem para o servidor
        
        Args:
            image_path: Caminho para o arquivo de imagem
            
        Returns:
            Dados da imagem no servidor (url, etc)
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Imagem não encontrada: {image_path}")
        
        with open(image_path, 'rb') as image_file:
            files = {'image': (os.path.basename(image_path), image_file)}
            response = requests.post(
                f"{self.base_url}/api/upload",
                files=files,
                headers={k: v for k, v in self.headers.items() if k != 'Content-Type'}
            )
        
        response.raise_for_status()
        return response.json()
    
    def create_tag_if_not_exists(self, tag_name: str) -> str:
        """
        Cria uma tag se ela não existir
        
        Args:
            tag_name: Nome da tag
            
        Returns:
            ID da tag criada ou existente
        """
        # Converter para slug para verificar se já existe
        tag_slug = tag_name.lower().replace(' ', '-')
        
        # Obter todas as tags
        tags = self.get_tags()
        
        # Verificar se a tag já existe
        for tag in tags:
            if tag.get('slug') == tag_slug:
                return tag.get('id')
        
        # Se não existe, criar a tag
        new_tag_data = {
            'nome': tag_name,
            'slug': tag_slug,
            'descricao': f'Artigos relacionados a {tag_name}'
        }
        
        response = requests.post(
            f"{self.base_url}/api/tags",
            headers=self.headers,
            json=new_tag_data
        )
        
        response.raise_for_status()
        return response.json().get('id')
    
    def create_article(self, article_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Cria um novo artigo
        
        Args:
            article_data: Dados do artigo
            
        Returns:
            Dados do artigo criado
        """
        # Garantir que o conteúdo HTML está formatado corretamente
        if 'conteudo' in article_data:
            article_data['conteudo'] = self.format_html_content(article_data['conteudo'])
        
        # Criar o artigo
        response = requests.post(
            f"{self.base_url}/api/noticias",
            headers=self.headers,
            json=article_data
        )
        
        response.raise_for_status()
        return response.json()
    
    def add_tags_to_article(self, article_id: str, tag_ids: List[str]) -> None:
        """
        Adiciona tags a um artigo
        
        Args:
            article_id: ID do artigo
            tag_ids: Lista de IDs das tags
        """
        for tag_id in tag_ids:
            response = requests.post(
                f"{self.base_url}/api/noticias/{article_id}/tags",
                headers=self.headers,
                json={'tagId': tag_id}
            )
            response.raise_for_status()
            # Pequena pausa para evitar sobrecarga na API
            time.sleep(0.2)
    
    def publish_article_with_tags(
        self, 
        title: str, 
        content: str, 
        category_id: str, 
        author_id: str,
        summary: str, 
        image_path: str,
        image_credit: Optional[str] = None,
        reading_time: Optional[str] = None,
        tags: Optional[List[str]] = None,
        publish_date: Optional[str] = None,
        meta_title: Optional[str] = None,
        meta_description: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Publica um artigo completo com imagem e tags
        
        Args:
            title: Título do artigo
            content: Conteúdo HTML do artigo
            category_id: ID da categoria
            author_id: ID do autor
            summary: Resumo do artigo
            image_path: Caminho para a imagem principal
            image_credit: Crédito da imagem (opcional)
            reading_time: Tempo de leitura (opcional, ex: "5 min de leitura")
            tags: Lista de nomes de tags (opcional)
            publish_date: Data de publicação (opcional, formato ISO)
            meta_title: Título para SEO (opcional)
            meta_description: Descrição para SEO (opcional)
            
        Returns:
            Dados do artigo publicado
        """
        # Se não houver data de publicação, usar a data atual
        if not publish_date:
            publish_date = datetime.now().isoformat()
        
        # Upload da imagem
        image_data = self.upload_image(image_path)
        image_url = image_data.get('imageUrl')  # Ajustado para 'imageUrl' conforme a API
        
        # Preparar dados do artigo
        article_data = {
            'titulo': title,
            'slug': title.lower().replace(' ', '-') + f"-{int(time.time())}",
            'conteudo': content,
            'categoriaId': category_id,
            'autorId': author_id,
            'resumo': summary,
            'imageUrl': image_url,
            'publicadoEm': publish_date,
            'status': 'publicado'
        }
        
        if image_credit:
            article_data['imagemCredito'] = image_credit
        
        if reading_time:
            article_data['tempoLeitura'] = reading_time
            
        if meta_title:
            article_data['metaTitulo'] = meta_title
            
        if meta_description:
            article_data['metaDescricao'] = meta_description
        
        # Criar o artigo
        created_article = self.create_article(article_data)
        article_id = created_article.get('id')
        
        # Adicionar tags ao artigo, se houver
        if tags and article_id:
            tag_ids = []
            for tag_name in tags:
                tag_id = self.create_tag_if_not_exists(tag_name)
                tag_ids.append(tag_id)
            
            self.add_tags_to_article(article_id, tag_ids)
        
        return created_article


def main():
    """Função principal para execução via linha de comando"""
    parser = argparse.ArgumentParser(description="Publicador de artigos para o blog")
    
    parser.add_argument('--url', type=str, required=True, help="URL base da API (ex: http://localhost:5000)")
    parser.add_argument('--key', type=str, help="Chave de API (opcional)")
    parser.add_argument('--title', type=str, required=True, help="Título do artigo")
    parser.add_argument('--content', type=str, required=True, help="Caminho para arquivo HTML com conteúdo")
    parser.add_argument('--category', type=str, required=True, help="ID da categoria")
    parser.add_argument('--author', type=str, required=True, help="ID do autor")
    parser.add_argument('--summary', type=str, required=True, help="Resumo do artigo")
    parser.add_argument('--image', type=str, required=True, help="Caminho para imagem principal")
    parser.add_argument('--image-credit', type=str, help="Crédito da imagem")
    parser.add_argument('--reading-time', type=str, help="Tempo de leitura (ex: '5 min de leitura')")
    parser.add_argument('--tags', type=str, help="Lista de tags separadas por vírgula")
    parser.add_argument('--meta-title', type=str, help="Título para SEO")
    parser.add_argument('--meta-description', type=str, help="Descrição para SEO")
    
    args = parser.parse_args()
    
    # Ler o conteúdo do arquivo HTML
    try:
        with open(args.content, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Erro ao ler arquivo de conteúdo: {e}")
        return
    
    # Processar tags
    tags = None
    if args.tags:
        tags = [tag.strip() for tag in args.tags.split(',')]
    
    # Inicializar o publicador
    publisher = BlogPublisher(args.url, args.key)
    
    try:
        # Publicar o artigo
        article = publisher.publish_article_with_tags(
            title=args.title,
            content=content,
            category_id=args.category,
            author_id=args.author,
            summary=args.summary,
            image_path=args.image,
            image_credit=args.image_credit,
            reading_time=args.reading_time,
            tags=tags,
            meta_title=args.meta_title,
            meta_description=args.meta_description
        )
        
        print(f"Artigo publicado com sucesso!")
        print(f"ID: {article.get('id')}")
        print(f"Slug: {article.get('slug')}")
        print(f"URL: {args.url}/noticia/{article.get('slug')}")
        
    except Exception as e:
        print(f"Erro ao publicar artigo: {e}")


if __name__ == "__main__":
    main()