/**
 * config.js
 * Completa estos valores cuando tengas tu proyecto de Supabase listo.
 * Mientras SUPABASE_URL esté vacío, el sitio funciona 100% con los datos
 * locales de data.js (modo demo), así puedes publicar en GitHub Pages
 * y probar el flujo antes de conectar la base de datos.
 *
 * IMPORTANTE: la "anon key" de Supabase es pública por diseño (se usa desde
 * el navegador) siempre y cuando tengas Row Level Security (RLS) activado
 * con las políticas del archivo supabase/schema.sql. Nunca pongas aquí la
 * "service_role key".
 */
window.APP_CONFIG = {
  SUPABASE_URL: "", // ej: "https://xxxxxxxx.supabase.co"
  SUPABASE_ANON_KEY: "", // ej: "eyJhbGciOi..."

  // Nombre del canal WhatsApp / línea de cotizaciones a mostrar en el sitio
  WHATSAPP_COTIZACIONES: "3024754841",

  // Opcional: si prefieres que el navegador llame directamente a un webhook
  // de n8n en lugar de depender del Database Webhook de Supabase, pon la URL
  // aquí. Se usará como respaldo si INSERT en Supabase fue exitoso.
  N8N_PRERESERVA_WEBHOOK_URL: "",
};
