'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Producto } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateWhatsAppOrderLink } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';

interface OrderModalProps {
  product: Producto | null;
  selectedSize: string | null;
  whatsappNumber?: string;
  onClose: () => void;
  onOrderSuccess?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  selectedSize,
  whatsappNumber,
  onClose,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    aclaraciones: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.email.trim()) {
      setErrorMsg('Por favor completá tu nombre, teléfono y correo electrónico.');
      return;
    }

    setLoading(true);

    try {
      // 1. Guardar en Supabase (si está configurado)
      if (isSupabaseConfigured) {
        const { error: dbError } = await supabase.from('pedidos').insert([
          {
            producto_id: product.id.startsWith('seed-') ? null : product.id,
            producto_nombre: product.nombre,
            tamano_elegido: selectedSize,
            precio: product.precio,
            cliente_nombre: formData.nombre.trim(),
            cliente_telefono: formData.telefono.trim(),
            cliente_email: formData.email.trim(),
            aclaraciones: formData.aclaraciones.trim() || null,
            estado: 'Pendiente',
          },
        ]);

        if (dbError) {
          console.warn('[Tuki3d Pedidos] Advertencia al guardar en Supabase:', dbError.message);
        }
      }

      // 2. Envío opcional por Web3Forms si está configurado
      const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (web3FormsKey) {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: web3FormsKey,
              subject: `Nuevo pedido Tuki3d: ${product.nombre} - ${formData.nombre}`,
              from_name: 'Tuki3d Catálogo Web',
              producto: product.nombre,
              tamano: selectedSize || 'Estándar',
              precio: `$${product.precio}`,
              cliente_nombre: formData.nombre,
              cliente_telefono: formData.telefono,
              cliente_email: formData.email,
              aclaraciones: formData.aclaraciones,
            }),
          });
        } catch (mailErr) {
          console.warn('[Web3Forms] Error no crítico al enviar email:', mailErr);
        }
      }

      // 3. Generar enlace de WhatsApp
      const waLink = generateWhatsAppOrderLink({
        phoneNumber: whatsappNumber,
        productoNombre: product.nombre,
        tamanoElegido: selectedSize,
        precio: product.precio,
        clienteNombre: formData.nombre.trim(),
        clienteTelefono: formData.telefono.trim(),
        clienteEmail: formData.email.trim(),
        aclaraciones: formData.aclaraciones.trim(),
      });

      // 4. Abrir WhatsApp en nueva pestaña
      window.open(waLink, '_blank');

      setSuccess(true);
      if (onOrderSuccess) onOrderSuccess();
    } catch (err: unknown) {
      console.error('[Error de pedido]:', err);
      setErrorMsg('Ocurrió un error al procesar el pedido. No te preocupes, podés enviarlo por WhatsApp igualmente.');
    } finally {
      setLoading(false);
    }
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
          className="relative w-full max-w-lg glass-card rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl z-10 p-6 sm:p-8 my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-purple-300 hover:text-white transition-colors border border-purple-500/20"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>

          {!success ? (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-bold text-tuki-yellow tracking-wider">
                  Completá tu pedido
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {product.nombre}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-purple-200">
                  {selectedSize && (
                    <span className="bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800">
                      Tamaño: <strong className="text-white">{selectedSize}</strong>
                    </span>
                  )}
                  <span className="text-tuki-yellow font-extrabold text-base">
                    {formatPrice(product.precio)}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Nombre y Apellido <span className="text-tuki-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Lucas González"
                    className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      Teléfono / WhatsApp <span className="text-tuki-yellow">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Ej. 3718 123456"
                      className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      Correo Electrónico <span className="text-tuki-yellow">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="lucas@gmail.com"
                      className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Aclaraciones o personalización <span className="text-purple-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.aclaraciones}
                    onChange={(e) => setFormData({ ...formData, aclaraciones: e.target.value })}
                    placeholder="Ej. Color negro mate, grabado de iniciales o consulta especial..."
                    className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-tuki-yellow to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 py-3.5 px-6 rounded-2xl font-black text-base shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-neutral-950" />
                        <span>Confirmar y enviar por WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-purple-300/60 mt-2">
                    Al confirmar, se guardará el pedido y se abrirá WhatsApp con el mensaje listo.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            /* Estado de Éxito */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                ¡Pedido registrado con éxito!
              </h3>
              <p className="text-sm text-purple-200/80 max-w-sm mx-auto leading-relaxed">
                Ya guardamos tu solicitud. Si no se abrió WhatsApp de forma automática, podés hacer clic en el botón de abajo para enviar el mensaje:
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const waLink = generateWhatsAppOrderLink({
                      phoneNumber: whatsappNumber,
                      productoNombre: product.nombre,
                      tamanoElegido: selectedSize,
                      precio: product.precio,
                      clienteNombre: formData.nombre.trim(),
                      clienteTelefono: formData.telefono.trim(),
                      clienteEmail: formData.email.trim(),
                      aclaraciones: formData.aclaraciones.trim(),
                    });
                    window.open(waLink, '_blank');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-tuki-yellow text-neutral-950 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-yellow-400 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-neutral-950" />
                  Abrir WhatsApp ahora
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-purple-300 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
