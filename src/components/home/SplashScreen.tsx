'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState<boolean | null>(null);

  const handleDismiss = React.useCallback(() => {
    sessionStorage.setItem('tuki3d_splash_seen', 'true');
    setVisible(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Verificar si ya se mostró en esta sesión de navegación
    const hasSeenSplash = sessionStorage.getItem('tuki3d_splash_seen');
    if (hasSeenSplash) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    setVisible(true);

    // Temporizador de 3 segundos exactos
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleDismiss, onComplete]);

  if (visible === null || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tuki-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-tuki-bg"
          onClick={handleDismiss}
        >
          {/* Fondo Texturizado */}
          <div className="absolute inset-0 bg-[url('/images/fondo-2.png')] bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none" />
          
          {/* Resplandor violeta y amarillo central */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-purple-700/40 via-purple-500/20 to-tuki-yellow/20 blur-3xl pointer-events-none"
          />

          {/* Contenido Central */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Logo Tuki3d con escala y flotación suave */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-44 h-44 sm:w-56 sm:h-56 mb-6 drop-shadow-[0_15px_35px_rgba(147,51,234,0.4)]"
            >
              <Image
                src="/images/logo-tuki3d.png"
                alt="Tuki3d Logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Título de Marca */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2"
            >
              <span className="bg-gradient-to-r from-white via-purple-100 to-tuki-yellow bg-clip-text text-transparent">
                Tuki3d
              </span>
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg sm:text-xl font-medium text-purple-200/90 tracking-wide mb-8"
            >
              &ldquo;Impresiones 3D a tu medida&rdquo;
            </motion.p>

            {/* Barra de progreso de 3 segundos */}
            <div className="w-48 sm:w-64 h-1.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-tuki-yellow"
              />
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-4 text-xs text-purple-400/70"
            >
              Tocá para continuar
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
