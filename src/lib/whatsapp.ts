import { DEFAULT_WHATSAPP } from '@/data/seedProducts';

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return DEFAULT_WHATSAPP;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 ? digits : DEFAULT_WHATSAPP;
}

export interface OrderWhatsAppParams {
  phoneNumber?: string;
  productoNombre: string;
  tamanoElegido?: string | null;
  precio: number;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  aclaraciones?: string | null;
}

export function generateWhatsAppOrderLink(params: OrderWhatsAppParams): string {
  const phone = sanitizePhoneNumber(params.phoneNumber || DEFAULT_WHATSAPP);

  const lines = [
    `*¡Hola Tuki3d! Quiero realizar un pedido:*`,
    ``,
    `*Producto:* ${params.productoNombre}`,
  ];

  if (params.tamanoElegido) {
    lines.push(`*Tamaño / Versión:* ${params.tamanoElegido}`);
  }

  lines.push(`*Precio estimado:* $${params.precio.toLocaleString('es-AR')}`);
  lines.push(``);
  lines.push(`*Mis datos:*`);
  lines.push(`- *Nombre:* ${params.clienteNombre}`);
  lines.push(`- *Teléfono:* ${params.clienteTelefono}`);
  lines.push(`- *Email:* ${params.clienteEmail}`);

  if (params.aclaraciones && params.aclaraciones.trim().length > 0) {
    lines.push(``);
    lines.push(`*Aclaraciones / Personalización:*`);
    lines.push(`${params.aclaraciones.trim()}`);
  }

  lines.push(``);
  lines.push(`_Enviado desde el catálogo web oficial de Tuki3d_`);

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${message}`;
}

export function generateDirectWhatsAppInquiryLink(phoneNumber?: string, queryText?: string): string {
  const phone = sanitizePhoneNumber(phoneNumber || DEFAULT_WHATSAPP);
  const text = queryText || '¡Hola Tuki3d! Me gustaría hacer una consulta sobre impresiones 3D personalizadas.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
