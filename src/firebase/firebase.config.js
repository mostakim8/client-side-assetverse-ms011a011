import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5wT6wLaFxqAn2iLEY1q1j_y2d3prHfSA",
  authDomain: "assetverse-5cb01.firebaseapp.com",
  projectId: "assetverse-5cb01",
  storageBucket: "assetverse-5cb01.firebasestorage.app",
  messagingSenderId: "410005825384",
  appId: "1:410005825384:web:cb8fa17dd39538f94318dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { app };