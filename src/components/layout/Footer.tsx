'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Heart, Shield, Sparkles } from 'lucide-react';
import { generateDirectWhatsAppInquiryLink } from '@/lib/whatsapp';

interface FooterProps {
  whatsappNumber?: string;
}

export const Footer: React.FC<FooterProps> = ({ whatsappNumber }) => {
  const whatsappUrl = generateDirectWhatsAppInquiryLink(whatsappNumber);

  return (
    <footer className="w-full bg-tuki-bg/90 border-t border-purple-500/20 pt-16 pb-12 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-900/40">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo-tuki3d.png"
                  alt="Tuki3d Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Tuki3d
              </span>
            </div>
            <p className="text-purple-300/80 text-sm max-w-md leading-relaxed">
              Diseño e impresiones 3D personalizadas de máxima calidad. Accesorios para tu setup gamer, organizadores de escritorio y figuras a tu medida.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Impresiones 3D con precisión milimétrica</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-purple-300/70">
              <li>
                <a href="#destacados" className="hover:text-tuki-yellow transition-colors">
                  Productos Destacados
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-tuki-yellow transition-colors">
                  Catálogo Completo
                </a>
              </li>
              <li>
                <a href="#personalizados" className="hover:text-tuki-yellow transition-colors">
                  Diseños Personalizados
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Contacto Directo
            </h4>
            <p className="text-sm text-purple-300/70">
              ¿Tenés dudas o querés pedir un presupuesto rápido? Escribinos directamente al WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-tuki-yellow hover:underline font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear por WhatsApp
            </a>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-xs text-purple-400/50 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Acceso Administración
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400/60 gap-4">
          <p>© {new Date().getFullYear()} Tuki3d. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para la comunidad gamer y creativa de Argentina
          </p>
        </div>
      </div>
    </footer>
  );
};
