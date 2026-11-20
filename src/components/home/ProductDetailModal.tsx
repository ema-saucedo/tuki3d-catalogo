'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { Producto } from '@/types/database';
import { formatPrice, normalizeCategory } from '@/lib/utils';

interface ProductDetailModalProps {
  product: Producto | null;
  onClose: () => void;
  onOpenOrder: (product: Producto, selectedSize: string | null) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenOrder,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Inicializar el tamaño por defecto si tiene
  React.useEffect(() => {
    if (product && product.tamanos && product.tamanos.length > 0) {
      setSelectedSize(product.tamanos[0]);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  if (!product) return null;

  const hasSizes = product.tamanos && product.tamanos.length > 0;

  const handleProceedToOrder = () => {
    onOpenOrder(product, selectedSize);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl glass-card rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-purple-300 hover:text-white transition-colors border border-purple-500/20"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            {/* Contenedor de Imagen con fondo BLANCO LIMPIO */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-square bg-white rounded-2xl p-6 shadow-md flex items-center justify-center overflow-hidden">
                <Image
                  src={product.imagen_url}
                  alt={product.nombre}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                {product.destacado && (
                  <span className="absolute top-3 left-3 bg-neutral-900/90 text-tuki-yellow text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-neutral-700">
                    <Sparkles className="w-3.5 h-3.5 fill-tuki-yellow" />
                    Destacado
                  </span>
                )}
              </div>

              {/* Badges de calidad */}
              <div className="grid grid-cols-2 gap-3 w-full mt-4 text-[11px] text-purple-300/80">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-950/50 border border-purple-800/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Filamento premium de alta resistencia</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-950/50 border border-purple-800/30">
                  <Box className="w-4 h-4 text-tuki-yellow shrink-0" />
                  <span>Embalaje seguro y listo para regalar</span>
                </div>
              </div>
            </div>

            {/* Información del Producto */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                  {normalizeCategory(product.categoria)}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
                  {product.nombre}
                </h2>

                <div className="flex items-baseline gap-2 mt-3 mb-4">
                  <span className="text-3xl font-black text-tuki-yellow tracking-tight">
                    {formatPrice(product.precio)}
                  </span>
                  <span className="text-xs text-purple-300 font-medium">ARS</span>
                </div>

                <div className="border-t border-purple-900/50 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                    Descripción
                  </h4>
                  <p className="text-sm text-purple-200/90 leading-relaxed whitespace-pre-line">
                    {product.descripcion}
                  </p>
                </div>

                {/* Selector de Tamaño (Solo si el producto tiene tamaños configurados) */}
                {hasSizes && (
                  <div className="mt-5 border-t border-purple-900/50 pt-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">
                      Elegí tu tamaño o versión:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.tamanos.map((tamano) => {
                        const isSelected = selectedSize === tamano;
                        return (
                          <button
                            key={tamano}
                            type="button"
                            onClick={() => setSelectedSize(tamano)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-tuki-yellow text-neutral-950 font-bold shadow-md shadow-yellow-500/20'
                                : 'bg-purple-950/70 text-purple-200 border border-purple-800/40 hover:border-purple-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            {tamano}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de Acción Principal */}
              <div className="pt-4 border-t border-purple-900/50">
                <button
                  onClick={handleProceedToOrder}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-tuki-yellow to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 py-3.5 px-6 rounded-2xl font-black text-base shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Hacer pedido</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
                <p className="text-[11px] text-center text-purple-300/70 mt-2">
                  No requiere registro. Se coordinará directamente con vos por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
