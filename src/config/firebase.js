// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBItOUh-Y6vSdQNue4lU5aAIcNFevDp1N4",
  authDomain: "form-to-pdf-52d69.firebaseapp.com",
  projectId: "form-to-pdf-52d69",
  storageBucket: "form-to-pdf-52d69.firebasestorage.app",
  messagingSenderId: "326642896214",
  appId: "1:326642896214:web:edf4d4f8c19067fef4daf7",
  measurementId: "G-PCXG4LQG2K"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Storage
export const storage = getStorage(app)

// Initialize Analytics (optional)
export const analytics = getAnalytics(app)

export default app
