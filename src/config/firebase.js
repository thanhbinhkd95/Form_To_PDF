// Firebase configuration
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBItOUh-Y6vSdQNue4lU5aAIcNFevDp1N4",
  authDomain: "form-to-pdf-52d69.firebaseapp.com",
  projectId: "form-to-pdf-52d69",
  // Firebase Storage bucket phải có dạng <project-id>.appspot.com
  storageBucket: "form-to-pdf-52d69.appspot.com",
  messagingSenderId: "326642896214",
  appId: "1:326642896214:web:edf4d4f8c19067fef4daf7",
  measurementId: "G-PCXG4LQG2K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Optional: Initialize App Check (helps when Storage enforces App Check)
// Chỉ bật nếu có cấu hình key, và hỗ trợ debug khi chạy dev/local
(() => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;
  try {
    console.log("AppCheck siteKey =", siteKey);
    console.log(
      "VITE_RECAPTCHA_V3_SITE_KEY =",
      import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY
    );
    console.log(
      "All import.meta.env keys =",
      Object.keys(import.meta.env || {})
    );
  } catch {
    // ignore console errors in non-browser environments
  }
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
