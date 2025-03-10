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
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* Items do breadcrumb começando pelo Início (home) se solicitado */}
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          
          // Se for o primeiro item e showHomeIcon for true, mostrar ícone home
          const isFirstItem = index === 0;
          const showHomeForThis = isFirstItem && showHomeIcon && item.name.toLowerCase().includes('iníc');
          
          return (
            <React.Fragment key={`breadcrumb-item-${index}`}>
              {/* Adicionar separador antes dos itens (exceto o primeiro) */}
              {!isFirstItem && <BreadcrumbSeparator />}
              
              <BreadcrumbItem>
                {isLastItem || !item.url ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.url}>
                      {showHomeForThis ? (
                        <HomeIcon className="h-4 w-4" />
                      ) : (
                        item.name
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}