import { Producto } from '@/types/database';

export const INITIAL_PRODUCTS: Producto[] = [
  {
    id: 'seed-1-soporte-controles',
    nombre: 'Soporte para controles y auricular',
    descripcion: 'El toque final que le falta a tu setup. Ahorrá espacio en tu escritorio y exhibí hasta dos joysticks y tus auriculares siempre listos para jugar. Impresión 3D resistente con excelente terminación.',
    precio: 15000,
    categoria: 'Setup & Gaming',
    imagen_url: '/images/soporte-controles-auricular.png',
    destacado: true,
    activo: true,
    tamanos: ['Estándar (2 controles + 1 auricular)'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-2-organizador-switch',
    nombre: 'Organizador para juegos de Nintendo Switch',
    descripcion: 'Mantené tu colección de Nintendo Switch ordenada y a mano. Soporte impreso en 3D con ranuras individuales para cajas de juegos y detalle frontal en relieve.',
    precio: 12000,
    categoria: 'Setup & Gaming',
    imagen_url: '/images/organizador-nintendo-switch.png',
    destacado: true,
    activo: true,
    tamanos: ['10 juegos', '15 juegos'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-3-lampara-cubo-rgb',
    nombre: 'Lámpara Cubo Led RGB Gamer',
    descripcion: 'Iluminá tu rincón gamer con estilo geométrico futurista. Fabricada en filamento translúcido con soporte negro mate, diseñada para tiras led o velas led seguras.',
    precio: 18500,
    categoria: 'Decoración',
    imagen_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    destacado: false,
    activo: true,
    tamanos: ['12x12 cm', '16x16 cm'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-4-llavero-dragon',
    nombre: 'Llavero Articulado Dragón Custom',
    descripcion: 'Dragón fidget articulado impreso en una sola pieza con movimiento hiper fluido. Ideal para mochilas, llaves o desestresarse en el escritorio.',
    precio: 5500,
    categoria: 'Llaveros',
    imagen_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    destacado: false,
    activo: true,
    tamanos: ['Chico (12 cm)', 'Grande (18 cm)'],
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_WHATSAPP = '5493718545385';
