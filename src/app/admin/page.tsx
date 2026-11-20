'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  LogOut,
  Plus,
  Package,
  ShoppingBag,
  Phone,
  Save,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Upload,
  MessageCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Producto, Pedido, PedidoEstado } from '@/types/database';
import { INITIAL_PRODUCTS, DEFAULT_WHATSAPP } from '@/data/seedProducts';
import { formatPrice, normalizeCategory } from '@/lib/utils';
import { sanitizePhoneNumber } from '@/lib/whatsapp';

export default function AdminPage() {
  // Estado de autenticación
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs de administración
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'whatsapp'>('productos');

  // Datos
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(DEFAULT_WHATSAPP);

  // Estados de carga y feedback
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formulario nuevo producto
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Setup & Gaming');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDestacado, setNewProdDestacado] = useState(false);
  const [newProdActivo, setNewProdActivo] = useState(true);
  const [newProdSizes, setNewProdSizes] = useState('');
  const [newProdFile, setNewProdFile] = useState<File | null>(null);
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  // 1. Escuchar sesión de Supabase Auth
  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error al verificar sesión:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  // 2. Cargar datos si está autenticado
  const fetchData = async () => {
    if (!isSupabaseConfigured) return;

    try {
      // Productos
      const { data: prods } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });
      if (prods) setProducts(prods);

      // Pedidos
      const { data: ords } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });
      if (ords) setPedidos(ords);

      // WhatsApp
      const { data: cfg } = await supabase
        .from('configuracion')
        .select('valor')
        .eq('clave', 'whatsapp_number')
        .single();
      if (cfg && cfg.valor) setWhatsappNumber(cfg.valor);
    } catch (err) {
      console.error('Error al sincronizar datos admin:', err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAction('login');

    if (!isSupabaseConfigured) {
      setAuthError('Supabase no está configurado en las variables de entorno aún.');
      setLoadingAction(null);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setAuthError('Credenciales incorrectas o usuario no registrado.');
      } else {
        setSession(data.session);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error de conexión.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // Actualizar número de WhatsApp
  const handleUpdateWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('whatsapp');

    const cleanNumber = sanitizePhoneNumber(whatsappNumber);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('configuracion')
        .upsert({ clave: 'whatsapp_number', valor: cleanNumber });

      if (error) {
        showFeedback('Error al actualizar en la base de datos: ' + error.message, true);
        setLoadingAction(null);
        return;
      }
    }

    setWhatsappNumber(cleanNumber);
    showFeedback('¡Número de WhatsApp actualizado correctamente!');
    setLoadingAction(null);
  };

  // Toggle rápido de Destacado / Activo en producto
  const handleToggleProductField = async (productId: string, field: 'destacado' | 'activo', currentVal: boolean) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, [field]: !currentVal } : p
    );
    setProducts(updated);

    if (isSupabaseConfigured && !productId.startsWith('seed-')) {
      const { error } = await supabase
        .from('productos')
        .update({ [field]: !currentVal })
        .eq('id', productId);

      if (error) {
        showFeedback('Error al actualizar producto: ' + error.message, true);
        fetchData();
        return;
      }
    }
    showFeedback(`Producto ${field === 'destacado' ? 'en carrusel' : 'visibilidad'} actualizado.`);
  };

  // Guardar edición rápida de precio y descripción
  const handleQuickSaveProduct = async (product: Producto) => {
    setLoadingAction(`save-${product.id}`);

    if (isSupabaseConfigured && !product.id.startsWith('seed-')) {
      const { error } = await supabase
        .from('productos')
        .update({
          precio: Number(product.precio),
          descripcion: product.descripcion,
          destacado: product.destacado,
        })
        .eq('id', product.id);

      if (error) {
        showFeedback('Error al guardar: ' + error.message, true);
        setLoadingAction(null);
        return;
      }
    }

    showFeedback('Cambios guardados con éxito.');
    setLoadingAction(null);
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    setProducts(products.filter((p) => p.id !== productId));

    if (isSupabaseConfigured && !productId.startsWith('seed-')) {
      const { error } = await supabase.from('productos').delete().eq('id', productId);
      if (error) {
        showFeedback('Error al eliminar: ' + error.message, true);
        fetchData();
        return;
      }
    }
    showFeedback('Producto eliminado.');
  };

  // Actualizar estado de pedido
  const handleUpdateOrderStatus = async (pedidoId: string, nuevoEstado: PedidoEstado) => {
    setPedidos(
      pedidos.map((o) => (o.id === pedidoId ? { ...o, estado: nuevoEstado } : o))
    );

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId);

      if (error) {
        showFeedback('Error al actualizar estado del pedido: ' + error.message, true);
        return;
      }
    }
    showFeedback(`Pedido marcado como: ${nuevoEstado}`);
  };

  // Crear nuevo producto con upload a Storage
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('create-product');

    try {
      let finalImageUrl = newProdImageUrl.trim() || '/images/logo-tuki3d.png';

      // Si subió un archivo desde móvil o PC, subir a Supabase Storage
      if (newProdFile && isSupabaseConfigured) {
        const fileExt = newProdFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `catalogo/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('productos-imagenes')
          .upload(filePath, newProdFile);

        if (uploadError) {
          throw new Error('Error al subir foto a Storage: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('productos-imagenes')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // Procesar tamaños opcionales (separados por coma)
      const tamanosArray = newProdSizes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const newProductPayload = {
        nombre: newProdName.trim(),
        descripcion: newProdDesc.trim(),
        precio: parseFloat(newProdPrice) || 0,
        categoria: newProdCategory,
        imagen_url: finalImageUrl,
        destacado: newProdDestacado,
        activo: newProdActivo,
        tamanos: tamanosArray,
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('productos')
          .insert([newProductPayload])
          .select()
          .single();

        if (error) throw error;
        if (data) setProducts([data, ...products]);
      } else {
        const localNew: Producto = {
          id: `local-${Date.now()}`,
          ...newProductPayload,
          created_at: new Date().toISOString(),
        };
        setProducts([localNew, ...products]);
      }

      showFeedback('¡Nuevo producto agregado con éxito!');
      setShowNewProductModal(false);
      // Reset form
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdSizes('');
      setNewProdFile(null);
      setNewProdImageUrl('');
      setNewProdDestacado(false);
    } catch (err: any) {
      showFeedback(err.message || 'Error al crear producto.', true);
    } finally {
      setLoadingAction(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tuki-bg text-purple-300">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // PANTALLA DE LOGIN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo-tuki3d.png"
                alt="Tuki3d Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-tuki-yellow bg-purple-950 px-3 py-1 rounded-full border border-purple-800 mb-2">
              <Shield className="w-3.5 h-3.5" />
              Acceso Restringido
            </div>
            <h1 className="text-2xl font-black text-white">Panel de Administración</h1>
            <p className="text-xs text-purple-300/80 mt-1">
              Ingresá con tu cuenta autorizada para gestionar catálogo y pedidos.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tuki3d.com"
                className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-tuki-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'login'}
              className="w-full py-3 bg-gradient-to-r from-tuki-yellow to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black rounded-xl text-sm shadow-lg shadow-yellow-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingAction === 'login' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Ingresar al Panel</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Catálogo Público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA PRINCIPAL DE ADMINISTRACIÓN
  return (
    <div className="min-h-screen pb-16">
      {/* Header Admin */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-tuki-dark/90 border-b border-purple-500/30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group" title="Ir al catálogo">
            <div className="relative w-9 h-9">
              <Image
                src="/images/logo-tuki3d.png"
                alt="Tuki3d"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-white text-lg group-hover:text-tuki-yellow transition-colors">
              Tuki3d
            </span>
          </Link>
          <span className="text-xs text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-purple-300 hover:text-white px-3 py-1.5 rounded-lg border border-purple-800/40 hover:bg-purple-950/60 flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Sitio Web</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Notificaciones flotantes */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navegación por Pestañas */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-800/40 mb-8">
          <div className="flex items-center gap-2 bg-purple-950/50 p-1.5 rounded-2xl border border-purple-800/40">
            <button
              onClick={() => setActiveTab('productos')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'productos'
                  ? 'bg-tuki-yellow text-neutral-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Productos & Carrusel ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'pedidos'
                  ? 'bg-tuki-yellow text-neutral-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Bandeja de Pedidos ({pedidos.length})
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-tuki-yellow text-neutral-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              Ajuste de WhatsApp
            </button>
          </div>

          {activeTab === 'productos' && (
            <button
              onClick={() => setShowNewProductModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-tuki-yellow to-amber-400 text-neutral-950 font-black text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + Agregar nuevo producto
            </button>
          )}
        </div>

        {/* TAB 1: PRODUCTOS */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="glass-card rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col justify-between p-5 space-y-4"
                >
                  <div className="flex gap-4 items-start">
                    {/* Imagen del producto en blanco puro */}
                    <div className="relative w-24 h-24 bg-white rounded-xl p-2 shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src={prod.imagen_url}
                        alt={prod.nombre}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-purple-400">
                        {normalizeCategory(prod.categoria)}
                      </span>
                      <h4 className="font-extrabold text-white text-base truncate">
                        {prod.nombre}
                      </h4>

                      {/* Control de Destacado / Carrusel */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductField(prod.id, 'destacado', prod.destacado)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                            prod.destacado
                              ? 'bg-tuki-yellow text-neutral-950 border border-yellow-400'
                              : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          {prod.destacado ? 'En Carrusel' : 'No destacado'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleProductField(prod.id, 'activo', prod.activo)}
                          className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${
                            prod.activo
                              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                              : 'text-neutral-400 bg-neutral-900 border border-neutral-700'
                          }`}
                        >
                          {prod.activo ? 'Visible' : 'Oculto'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edición rápida de Precio y Descripción */}
                  <div className="space-y-3 pt-2 border-t border-purple-900/40">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-purple-300 block mb-1">
                        Precio ($ ARS)
                      </label>
                      <input
                        type="number"
                        value={prod.precio}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setProducts(
                            products.map((p) => (p.id === prod.id ? { ...p, precio: val } : p))
                          );
                        }}
                        className="w-full px-3 py-1.5 bg-purple-950/70 border border-purple-700/40 rounded-lg text-sm text-tuki-yellow font-bold focus:outline-none focus:border-tuki-yellow"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-purple-300 block mb-1">
                        Descripción
                      </label>
                      <textarea
                        rows={2}
                        value={prod.descripcion}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProducts(
                            products.map((p) => (p.id === prod.id ? { ...p, descripcion: val } : p))
                          );
                        }}
                        className="w-full px-3 py-1.5 bg-purple-950/70 border border-purple-700/40 rounded-lg text-xs text-purple-200 focus:outline-none focus:border-tuki-yellow"
                      />
                    </div>

                    {prod.tamanos && prod.tamanos.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-purple-300/80">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Tamaños: {prod.tamanos.join(', ')}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleQuickSaveProduct(prod)}
                        disabled={loadingAction === `save-${prod.id}`}
                        className="inline-flex items-center gap-1.5 bg-purple-900/80 hover:bg-tuki-yellow hover:text-neutral-950 text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-purple-700 transition-all"
                      >
                        {loadingAction === `save-${prod.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Guardar cambios</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-950/50 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            {pedidos.length === 0 ? (
              <div className="text-center py-16 rounded-2xl glass-card border border-purple-500/20">
                <ShoppingBag className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white">No hay pedidos registrados todavía</h4>
                <p className="text-xs text-purple-300/70 mt-1">
                  Cuando un cliente realice un pedido desde el catálogo, aparecerá acá automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="glass-card rounded-2xl p-5 border border-purple-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-base">
                          {pedido.producto_nombre}
                        </span>
                        {pedido.tamano_elegido && (
                          <span className="text-xs bg-purple-950 text-purple-200 px-2 py-0.5 rounded border border-purple-800">
                            {pedido.tamano_elegido}
                          </span>
                        )}
                        <span className="text-tuki-yellow font-black text-sm">
                          {formatPrice(pedido.precio)}
                        </span>
                      </div>

                      <div className="text-xs text-purple-200/90 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong>Cliente:</strong> {pedido.cliente_nombre}</span>
                        <span><strong>Tel:</strong> {pedido.cliente_telefono}</span>
                        <span><strong>Email:</strong> {pedido.cliente_email}</span>
                        <span className="text-purple-400">
                          {new Date(pedido.created_at).toLocaleString('es-AR')}
                        </span>
                      </div>

                      {pedido.aclaraciones && (
                        <p className="text-xs text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                          <strong>Aclaraciones:</strong> {pedido.aclaraciones}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Selector de estado */}
                      <select
                        value={pedido.estado}
                        onChange={(e) => handleUpdateOrderStatus(pedido.id, e.target.value as PedidoEstado)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none ${
                          pedido.estado === 'Entregado'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : pedido.estado === 'En producción'
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-purple-950 text-purple-300 border-purple-700'
                        }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En producción">En producción</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>

                      {/* Abrir WhatsApp del cliente */}
                      <a
                        href={`https://wa.me/${sanitizePhoneNumber(pedido.cliente_telefono)}?text=${encodeURIComponent(
                          `¡Hola ${pedido.cliente_nombre}! Te escribimos de Tuki3d con respecto a tu pedido de ${pedido.producto_nombre}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition-colors"
                        title="Abrir chat de WhatsApp con el cliente"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AJUSTE DE WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-tuki-yellow text-neutral-950 rounded-2xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Número de WhatsApp Receptor</h3>
                <p className="text-xs text-purple-300/80">
                  Es el número al cual los clientes envían sus consultas y confirmaciones de pedidos.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateWhatsApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Número de teléfono (con código de país y área)
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5493718545385"
                  className="w-full px-4 py-3 bg-purple-950/70 border border-purple-700/50 rounded-xl text-base text-white font-mono focus:outline-none focus:border-tuki-yellow"
                />
                <span className="text-[11px] text-purple-400 mt-1 block">
                  Ejemplo: <code>5493718545385</code> (corresponde a +54 9 3718 54-5385). Podés escribirlo con o sin signos; el sistema lo normaliza automáticamente.
                </span>
              </div>

              <button
                type="submit"
                disabled={loadingAction === 'whatsapp'}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-tuki-yellow to-amber-400 text-neutral-950 font-black rounded-xl text-sm shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loadingAction === 'whatsapp' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Actualizar número receptor</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: AGREGAR NUEVO PRODUCTO */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
            onClick={() => setShowNewProductModal(false)}
          />

          <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 z-10 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-2xl font-black text-white mb-2">
              Agregar nuevo producto al catálogo
            </h3>
            <p className="text-xs text-purple-300/80 mb-6">
              Completá los datos y subí una foto nítida (preferentemente con fondo blanco).
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ej. Soporte para volante gamer"
                  className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-tuki-yellow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-tuki-yellow"
                  >
                    <option value="Setup & Gaming">Setup & Gaming</option>
                    <option value="Coleccionables">Coleccionables</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Precio ($ ARS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-tuki-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Descripción completa *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detalles del accesorio, medidas y compatibilidad..."
                  className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-tuki-yellow"
                />
              </div>

              {/* Foto: Subir archivo o ingresar URL */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-3">
                <label className="block text-xs font-bold text-tuki-yellow">
                  Foto del producto (Subida a Supabase Storage)
                </label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewProdFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-800 file:text-white hover:file:bg-purple-700"
                  />
                </div>
                <div className="text-[11px] text-purple-400 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>O ingresar una URL externa si ya la tenés:</span>
                </div>
                <input
                  type="url"
                  value={newProdImageUrl}
                  onChange={(e) => setNewProdImageUrl(e.target.value)}
                  placeholder="https://... o dejar vacío si subiste archivo"
                  className="w-full px-3 py-2 bg-purple-950/70 border border-purple-700/40 rounded-lg text-xs text-white focus:outline-none focus:border-tuki-yellow"
                />
              </div>

              {/* Tamaños opcionales */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Tamaños opcionales <span className="text-purple-400 font-normal">(separados por coma, opcional)</span>
                </label>
                <input
                  type="text"
                  value={newProdSizes}
                  onChange={(e) => setNewProdSizes(e.target.value)}
                  placeholder="Ej. Chico (10cm), Mediano (15cm), Grande (20cm)"
                  className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-tuki-yellow"
                />
              </div>

              {/* Switches Destacado y Activo */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdDestacado}
                    onChange={(e) => setNewProdDestacado(e.target.checked)}
                    className="w-4 h-4 rounded text-tuki-yellow focus:ring-tuki-yellow bg-purple-950 border-purple-700"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-tuki-yellow" />
                    Mostrar en Carrusel Destacado
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdActivo}
                    onChange={(e) => setNewProdActivo(e.target.checked)}
                    className="w-4 h-4 rounded text-tuki-yellow focus:ring-tuki-yellow bg-purple-950 border-purple-700"
                  />
                  <span className="text-xs font-bold text-white">
                    Visible en catálogo
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-purple-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'create-product'}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-tuki-yellow to-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-yellow-500/25 flex items-center gap-2"
                >
                  {loadingAction === 'create-product' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[3]" />
                  )}
                  <span>Crear y Publicar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
