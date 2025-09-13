// Firebase configuration
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Firebase Storage bucket phải có dạng <project-id>.appspot.com
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Optional: Initialize App Check (helps when Storage enforces App Check)
// Chỉ bật nếu có cấu hình key, và hỗ trợ debug khi chạy dev/local
(() => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;
  if (!siteKey) return;

  if (import.meta.env.DEV) {
    try {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    } catch {
      // ignore if not in browser worker/global scope
    }
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
})();

// Initialize Analytics (optional) - Commented out to avoid tracking errors
// export const analytics = getAnalytics(app)

export default app;
