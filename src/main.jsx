import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Routes.jsx'
import AuthProvider from './providers/AuthProvider.jsx'

// TanStack Query ইমপোর্ট করুন
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// একটি নতুন QueryClient তৈরি করুন
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* QueryClientProvider দিয়ে পুরো অ্যাপকে মুড়িয়ে দিন */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)