import React from 'react';
import { Link } from 'wouter';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';

export interface BreadcrumbItemType {
  name: string;
  url?: string;
  position?: number;
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
  showHomeIcon?: boolean;
}

/**
 * Componente de breadcrumb com suporte a SEO
 * Implementa tanto o aspecto visual quanto fornece os dados para o JSON-LD
 */
export function SEOBreadcrumb({ items, className = '', showHomeIcon = true }: SEOBreadcrumbProps) {
  // Validar que temos pelo menos um item
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={`text-xs md:text-sm overflow-x-auto ${className}`}>
      <BreadcrumbList className="flex-nowrap">
        {/* Items do breadcrumb começando pelo Início (home) se solicitado */}
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          
          // Se for o primeiro item e showHomeIcon for true, mostrar ícone home
          const isFirstItem = index === 0;
          const showHomeForThis = isFirstItem && showHomeIcon && item.name.toLowerCase().includes('iníc');
          
          // Usando div com classe personalizada para substituir o React.Fragment e evitar erros com data-replit-metadata
          return (
            <div key={`breadcrumb-item-${index}`} className="contents">
              {/* Adicionar separador antes dos itens (exceto o primeiro) */}
              {!isFirstItem && <BreadcrumbSeparator />}
              
              <BreadcrumbItem>
                {isLastItem || !item.url ? (
                  <BreadcrumbPage className="truncate max-w-[150px] md:max-w-none">{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.url}>
                      {showHomeForThis ? (
                        <HomeIcon className="h-3 w-3 md:h-4 md:w-4" />
                      ) : (
                        item.name
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}