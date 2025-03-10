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
        {/* Início (opcional) */}
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span className="sr-only">Página Inicial</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {/* Items do breadcrumb */}
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          
          return (
            <React.Fragment key={item.name + index}>
              <BreadcrumbItem>
                {isLastItem || !item.url ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.url}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}