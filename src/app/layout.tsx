import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tuki3d.vercel.app'),
  title: 'Tuki3d | Impresiones 3D a tu medida',
  description: 'Catálogo oficial de impresiones 3D personalizadas, accesorios gamer para setup, organización y decoración en Formosa y toda Argentina.',
  keywords: ['impresiones 3d', 'gaming setup', 'soporte joysticks', 'nintendo switch', 'tuki3d', 'decoracion gamer'],
  authors: [{ name: 'Tuki3d' }],
  icons: {
    icon: '/images/logo-tuki3d.png',
    apple: '/images/logo-tuki3d.png',
  },
  openGraph: {
    title: 'Tuki3d | Impresiones 3D a tu medida',
    description: 'Accesorios para tu setup, organización y diseños 3D personalizados listos para pedir por WhatsApp.',
    images: ['/images/logo-tuki3d.png'],
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={poppins.variable}>
      <body className="font-sans antialiased selection:bg-tuki-yellow selection:text-neutral-950 min-h-screen relative">
        {/* Capas de Fondo Texturizado Oficial */}
        <div className="tuki-bg-layer" aria-hidden="true" />
        <div className="tuki-overlay-layer" aria-hidden="true" />

        {/* Contenido de la Aplicación */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
