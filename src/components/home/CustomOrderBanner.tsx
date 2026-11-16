'use client';

import React from 'react';
import { Sparkles, MessageCircle, FileCode2, Palette, ShieldCheck } from 'lucide-react';
import { generateDirectWhatsAppInquiryLink } from '@/lib/whatsapp';

interface CustomOrderBannerProps {
  whatsappNumber?: string;
}

export const CustomOrderBanner: React.FC<CustomOrderBannerProps> = ({ whatsappNumber }) => {
  const whatsappUrl = generateDirectWhatsAppInquiryLink(
    whatsappNumber,
    '¡Hola Tuki3d! Tengo un proyecto/archivo 3D personalizado que me gustaría cotizar e imprimir.'
  );

  return (
    <section id="personalizados" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl glass-card border border-purple-500/30 p-8 sm:p-12 shadow-2xl bg-gradient-to-br from-purple-950/80 via-tuki-purple/90 to-tuki-dark/95">
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-tuki-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tuki-yellow bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700/50">
              <Sparkles className="w-3.5 h-3.5 fill-tuki-yellow" />
              Proyectos Especiales
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              ¿Tenés una idea o diseño propio? <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-tuki-yellow via-amber-300 to-white bg-clip-text text-transparent">
                Te lo imprimimos a tu medida.
              </span>
            </h3>

            <p className="text-sm sm:text-base text-purple-200/90 max-w-2xl leading-relaxed">
              Mandanos tu archivo STL, OBJ, foto de referencia o plano. Fabricamos repuestos, prototipos, merchandising para eventos, trofeos de torneos gaming y piezas exclusivas en filamentos PLA, PETG y TPU flexible.
            </p>

            {/* Ventajas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <FileCode2 className="w-4 h-4 text-tuki-yellow shrink-0" />
                <span>Formatos STL, OBJ, STEP</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <Palette className="w-4 h-4 text-fuchsia-400 shrink-0" />
                <span>Amplia variedad de colores</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Asesoramiento técnico sin cargo</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-tuki-yellow via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto text-center"
            >
              <MessageCircle className="w-5 h-5 fill-neutral-950" />
              Pedir cotización por WhatsApp
            </a>
            <span className="text-xs text-purple-300/70 mt-3 text-center lg:text-right">
              Respuesta rápida y presupuesto en el día
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
