'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Menu, X, Shield, Sparkles } from 'lucide-react';
import { generateDirectWhatsAppInquiryLink } from '@/lib/whatsapp';

interface NavbarProps {
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ whatsappNumber }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappUrl = generateDirectWhatsAppInquiryLink(whatsappNumber);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-tuki-dark/80 border-b border-purple-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo-tuki3d.png"
              alt="Tuki3d Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-tuki-yellow bg-clip-text text-transparent">
              Tuki3d
            </span>
            <span className="text-[10px] uppercase tracking-wider text-purple-300/80 font-medium -mt-1">
              Impresiones 3D a tu medida
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-purple-200/90">
          <button
            onClick={() => scrollToSection('destacados')}
            className="hover:text-tuki-yellow transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-tuki-yellow" />
            Destacados
          </button>
          <button
            onClick={() => scrollToSection('catalogo')}
            className="hover:text-tuki-yellow transition-colors"
          >
            Catálogo
          </button>
          <button
            onClick={() => scrollToSection('personalizados')}
            className="hover:text-tuki-yellow transition-colors"
          >
            Personalizados
          </button>
          <Link
            href="/admin"
            className="text-purple-400/60 hover:text-purple-300 transition-colors flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-950/40 border border-purple-800/30"
            title="Panel de Administración"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-tuki-yellow to-amber-400 text-neutral-950 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-neutral-950" />
            Consultá por WhatsApp
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-tuki-yellow text-neutral-950 rounded-full"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-neutral-950" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-purple-200 hover:text-white rounded-lg focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-tuki-dark/95 backdrop-blur-2xl border-b border-purple-500/30 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => scrollToSection('destacados')}
            className="flex items-center gap-2 text-left text-base font-medium text-white hover:text-tuki-yellow py-2"
          >
            <Sparkles className="w-4 h-4 text-tuki-yellow" />
            Productos Destacados
          </button>
          <button
            onClick={() => scrollToSection('catalogo')}
            className="text-left text-base font-medium text-white hover:text-tuki-yellow py-2"
          >
            Catálogo Completo
          </button>
          <button
            onClick={() => scrollToSection('personalizados')}
            className="text-left text-base font-medium text-white hover:text-tuki-yellow py-2"
          >
            Pedidos Personalizados
          </button>
          <div className="pt-2 border-t border-purple-800/40 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-purple-400 flex items-center gap-1.5 py-1"
            >
              <Shield className="w-4 h-4" />
              Panel de Administrador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
