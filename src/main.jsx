import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom' // এটি ইমপোর্ট করতে হবে
import router from './routes/Routes.jsx' // আপনার রাউটার ফাইলের পাথ
import AuthProvider from './providers/AuthProvider.jsx' // আপনার অথপ্রোভাইডার ফাইলের পাথ

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* সবার উপরে AuthProvider থাকবে যাতে পুরো অ্যাপ ইউজার ডাটা পায় */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)