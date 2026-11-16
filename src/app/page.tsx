'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SplashScreen } from '@/components/home/SplashScreen';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ProductDetailModal } from '@/components/home/ProductDetailModal';
import { OrderModal } from '@/components/home/OrderModal';
import { CustomOrderBanner } from '@/components/home/CustomOrderBanner';
import { Producto } from '@/types/database';
import { INITIAL_PRODUCTS, DEFAULT_WHATSAPP } from '@/data/seedProducts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function HomePage() {
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(DEFAULT_WHATSAPP);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Producto | null>(null);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<{
    product: Producto;
    selectedSize: string | null;
  } | null>(null);

  // Carga de productos y configuración desde Supabase
  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) return;

      try {
        // Cargar productos
        const { data: prods, error: prodsError } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .order('destacado', { ascending: false })
          .order('created_at', { ascending: false });

        if (!prodsError && prods && prods.length > 0) {
          setProducts(prods);
        }

        // Cargar configuración de WhatsApp
        const { data: config, error: configError } = await supabase
          .from('configuracion')
          .select('valor')
          .eq('clave', 'whatsapp_number')
          .single();

        if (!configError && config && config.valor) {
          setWhatsappNumber(config.valor);
        }
      } catch (err) {
        console.warn('[Tuki3d Data] Usando datos locales de catálogo:', err);
      }
    }

    loadData();
  }, []);

  const handleOpenDetail = (product: Producto) => {
    setSelectedProductForDetail(product);
  };

  const handleOpenOrder = (product: Producto, selectedSize: string | null) => {
    setSelectedProductForDetail(null);
    setSelectedProductForOrder({ product, selectedSize });
  };

  const handleCloseModals = () => {
    setSelectedProductForDetail(null);
    setSelectedProductForOrder(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Splash Screen animado de 3 segundos */}
      <SplashScreen />

      {/* Barra de Navegación */}
      <Navbar whatsappNumber={whatsappNumber} />

      <main className="flex-1 space-y-6">
        {/* Carrusel de Productos Destacados (Cabecera / Hero) */}
        <FeaturedCarousel
          products={products}
          onSelectProduct={handleOpenDetail}
        />

        {/* Catálogo Completo con Buscador y Filtros */}
        <ProductGrid
          products={products}
          onSelectProduct={handleOpenDetail}
        />

        {/* Banner de Pedidos y Diseños Personalizados */}
        <CustomOrderBanner whatsappNumber={whatsappNumber} />
      </main>

      {/* Pie de Página */}
      <Footer whatsappNumber={whatsappNumber} />

      {/* Modal Vista de Detalle */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={handleCloseModals}
        onOpenOrder={handleOpenOrder}
      />

      {/* Modal Formulario de Pedido */}
      <OrderModal
        product={selectedProductForOrder?.product || null}
        selectedSize={selectedProductForOrder?.selectedSize || null}
        whatsappNumber={whatsappNumber}
        onClose={handleCloseModals}
      />
    </div>
  );
}
