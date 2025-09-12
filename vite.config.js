import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  // Log keys loaded from .env for debugging
  console.log('Vite loadEnv keys:', Object.keys(env).filter(k => k.startsWith('VITE_')))
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY': JSON.stringify(env.VITE_RECAPTCHA_V3_SITE_KEY),
      'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(env.VITE_EMAILJS_SERVICE_ID),
      'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(env.VITE_EMAILJS_TEMPLATE_ID),
      'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(env.VITE_EMAILJS_PUBLIC_KEY),
    },
    server: {
      proxy: {
        // Proxy /uploadPdf requests to Firebase Cloud Functions
        '/uploadPdf': {
          target: 'https://us-central1-form-to-pdf-52d69.cloudfunctions.net',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/uploadPdf/, '/uploadPdf')
        }
      }
    }
  }
})
