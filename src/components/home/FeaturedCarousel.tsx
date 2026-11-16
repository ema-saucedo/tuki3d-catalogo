'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowDown } from 'lucide-react';
import { Producto } from '@/types/database';
import { formatPrice } from '@/lib/utils';

interface FeaturedCarouselProps {
  products: Producto[];
  onSelectProduct: (product: Producto) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products,
  onSelectProduct,
}) => {
  const featured = products.filter((p) => p.destacado && p.activo);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length, isPaused]);

  if (featured.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleOrderClick = (product: Producto) => {
    // 1. Smooth scroll a la tarjeta del producto en el catálogo
    const targetElement = document.getElementById(`producto-${product.id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 2. Resaltado temporal
      targetElement.classList.add('ring-4', 'ring-tuki-yellow', 'scale-[1.03]');
      setTimeout(() => {
        targetElement.classList.remove('ring-4', 'ring-tuki-yellow', 'scale-[1.03]');
      }, 1400);
    } else {
      const catalogEl = document.getElementById('catalogo');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // 3. Abrir la Vista de Detalle
    setTimeout(() => {
      onSelectProduct(product);
    }, 450);
  };

  const currentProduct = featured[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="destacados"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header de la Sección */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-500/30 text-tuki-yellow">
            <Sparkles className="w-5 h-5 fill-tuki-yellow" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Productos Destacados
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/80">
              Las piezas más solicitadas por la comunidad gamer y de diseño
            </p>
          </div>
        </div>

        {/* Flechas de navegación para desktop */}
        {featured.length > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-800/60 hover:border-tuki-yellow/50 transition-all active:scale-95"
              aria-label="Producto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-800/60 hover:border-tuki-yellow/50 transition-all active:scale-95"
              aria-label="Siguiente producto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Contenedor del Slide */}
      <div
        className="relative overflow-hidden rounded-3xl glass-card p-4 sm:p-8 border border-purple-500/25 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentProduct.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center"
          >
            {/* Foto del Producto con contenedor Blanco Puro para máximo contraste */}
            <div className="md:col-span-7 flex justify-center">
              <div className="relative w-full max-w-md h-64 sm:h-80 md:h-96 bg-white rounded-2xl p-4 sm:p-6 shadow-inner flex items-center justify-center overflow-hidden group">
                <Image
                  src={currentProduct.imagen_url}
                  alt={currentProduct.nombre}
                  fill
                  priority
                  className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-tuki-yellow text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-neutral-700">
                  <Sparkles className="w-3 h-3 fill-tuki-yellow" />
                  Destacado
                </div>
              </div>
            </div>

            {/* Info Limpia del Slide (Solo Título, Precio y Botón Pedir) */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-5 text-left">
              <div className="inline-block text-xs font-semibold uppercase tracking-wider text-purple-300/80 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-700/40 w-fit">
                {currentProduct.categoria}
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {currentProduct.nombre}
              </h3>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-tuki-yellow tracking-tight">
                  {formatPrice(currentProduct.precio)}
                </span>
                <span className="text-xs text-purple-300/70 font-medium">ARS</span>
              </div>

              {currentProduct.tamanos && currentProduct.tamanos.length > 1 && (
                <p className="text-xs text-purple-300/80">
                  ⚡ Disponible en {currentProduct.tamanos.length} tamaños diferentes
                </p>
              )}

              <div className="pt-2">
                <button
                  onClick={() => handleOrderClick(currentProduct)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-tuki-yellow via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 px-8 py-3.5 rounded-2xl font-black text-base shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Realizar pedido
                  <ArrowDown className="w-4 h-4 text-neutral-950 stroke-[3]" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de Puntos (Dots) */}
        {featured.length > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6 sm:pt-4">
            {featured.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2.5 bg-tuki-yellow'
                    : 'w-2.5 h-2.5 bg-purple-800/70 hover:bg-purple-600'
                }`}
                aria-label={`Ir al producto ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
