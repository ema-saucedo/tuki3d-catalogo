'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Layers, Sparkles } from 'lucide-react';
import { Producto } from '@/types/database';
import { formatPrice, normalizeCategory } from '@/lib/utils';

interface ProductCardProps {
  product: Producto;
  onSelect: (product: Producto) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const hasMultipleSizes = product.tamanos && product.tamanos.length > 1;

  return (
    <motion.div
      id={`producto-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between rounded-2xl glass-card overflow-hidden border border-purple-500/25 transition-all duration-300 hover:border-tuki-yellow/50 hover:shadow-2xl hover:shadow-purple-900/30"
    >
      <div>
        {/* Contenedor de Imagen con fondo BLANCO LIMPIO para máximo contraste */}
        <div className="relative w-full aspect-square bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden m-2 sm:m-3 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] shadow-inner">
          <Image
            src={product.imagen_url}
            alt={product.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges superiores */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {product.destacado && (
              <span className="bg-neutral-900/90 text-tuki-yellow text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-neutral-700 shadow-md">
                <Sparkles className="w-2.5 h-2.5 fill-tuki-yellow" />
                Destacado
              </span>
            )}
            {hasMultipleSizes && (
              <span className="bg-purple-950/90 text-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-800 shadow-md">
                <Layers className="w-2.5 h-2.5" />
                Varios tamaños
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 bg-purple-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-600/40">
            {normalizeCategory(product.categoria)}
          </div>
        </div>

        {/* Info del Producto */}
        <div className="p-4 sm:p-5 pt-1 space-y-2">
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-tuki-yellow transition-colors line-clamp-2 leading-snug">
            {product.nombre}
          </h3>

          <p className="text-xs text-purple-300/70 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        </div>
      </div>

      {/* Precios y Botón de Acción */}
      <div className="p-4 sm:p-5 pt-0 border-t border-purple-900/40 mt-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-semibold text-purple-400 block -mb-0.5">
            Precio
          </span>
          <span className="text-xl sm:text-2xl font-black text-tuki-yellow tracking-tight">
            {formatPrice(product.precio)}
          </span>
        </div>

        <button
          onClick={() => onSelect(product)}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-tuki-yellow hover:to-amber-400 hover:text-neutral-950 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-purple-600/40 hover:border-yellow-400 transition-all shadow-md active:scale-95"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver detalle / Pedir
        </button>
      </div>
    </motion.div>
  );
};
