import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  // Log keys loaded from .env for debugging
  console.log(
    "Vite loadEnv keys:",
    Object.keys(env).filter((k) => k.startsWith("VITE_"))
  );
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@/components": fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        "@/hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
        "@/utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        "@/constants": fileURLToPath(
          new URL("./src/constants", import.meta.url)
        ),
        "@/context": fileURLToPath(new URL("./src/context", import.meta.url)),
        "@/config": fileURLToPath(new URL("./src/config", import.meta.url)),
        "@/styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
    define: {
      "import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY": JSON.stringify(
        env.VITE_RECAPTCHA_V3_SITE_KEY
      ),
      "import.meta.env.VITE_EMAILJS_SERVICE_ID": JSON.stringify(
        env.VITE_EMAILJS_SERVICE_ID
      ),
      "import.meta.env.VITE_EMAILJS_TEMPLATE_ID": JSON.stringify(
        env.VITE_EMAILJS_TEMPLATE_ID
      ),
      "import.meta.env.VITE_EMAILJS_PUBLIC_KEY": JSON.stringify(
        env.VITE_EMAILJS_PUBLIC_KEY
      ),
    },
    server: {
      port: 5175,
      open: true,
      proxy: {
        // Proxy /uploadPdf requests to Firebase Cloud Functions
        "/uploadPdf": {
          target: "https://us-central1-form-to-pdf-52d69.cloudfunctions.net",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/uploadPdf/, "/uploadPdf"),
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            firebase: ["firebase"],
            pdf: ["html2canvas", "jspdf", "jszip"],
            email: ["@emailjs/browser"],
          },
        },
      },
    },
  };
});
