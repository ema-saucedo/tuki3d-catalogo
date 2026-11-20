'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';
import { Producto } from '@/types/database';
import { normalizeCategory } from '@/lib/utils';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Producto[];
  onSelectProduct: (product: Producto) => void;
}

const CATEGORIES = [
  'Todos',
  'Setup & Gaming',
  'Coleccionables',
  'Multimedia',
  'Otros',
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.activo) return false;

      const normCat = normalizeCategory(product.categoria);

      const matchesCategory =
        selectedCategory === 'Todos' ||
        normCat.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        product.nombre.toLowerCase().includes(query) ||
        product.descripcion.toLowerCase().includes(query) ||
        product.categoria.toLowerCase().includes(query) ||
        normCat.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="catalogo" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Título de la sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-tuki-yellow bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800/40 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Elegí lo que querés imprimir
          </h2>
          <p className="text-sm text-purple-300/80 mt-1 max-w-xl">
            Explorá nuestros modelos listos para entrega o consultanos por modificaciones de color y tamaño personalizadas.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto o accesorio..."
            className="w-full pl-10 pr-4 py-3 bg-purple-950/60 border border-purple-500/30 rounded-2xl text-sm text-white placeholder-purple-400/60 focus:outline-none focus:border-tuki-yellow focus:ring-2 focus:ring-tuki-yellow/20 transition-all backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros por Categoría */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        <SlidersHorizontal className="w-4 h-4 text-purple-400 shrink-0 ml-1 mr-2 hidden sm:block" />
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'text-neutral-950 shadow-md font-bold'
                  : 'text-purple-200/80 hover:text-white bg-purple-950/40 border border-purple-800/30 hover:border-purple-600/50'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-tuki-yellow to-amber-400 rounded-xl -z-10 shadow-lg shadow-yellow-500/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {category}
            </button>
          );
        })}
      </div>

      {/* Grilla de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl glass-card border border-purple-500/20">
          <div className="p-4 rounded-2xl bg-purple-900/40 text-purple-300 mb-4 border border-purple-700/30">
            <PackageX className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            No encontramos productos con ese criterio
          </h3>
          <p className="text-sm text-purple-300/70 max-w-sm mb-6">
            Probá buscando con otro término o cambiá la categoría seleccionada.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-purple-800 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </section>
  );
};
