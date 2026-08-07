# AssetVerse - Client-Side 

**AssetVerse** is a B2B Corporate Asset Management web application built to help companies digitize their equipment inventory, streamline employee asset requests, and automate subscription package management for HR admins.

🌐 **Live Application:** [https://inspiring-medovik-fc9331.netlify.app](https://inspiring-medovik-fc9331.netlify.app)

---

##  Key Client Features

* **Dual Portal Dashboards:** Customized UI and permissions for HR Managers and Employees.
* **Stripe Subscriptions:** Integrated payment flow allowing HR admins to upgrade company limits securely.
* **Instant Dynamic Search & Filtering:** Fast inventory lookup with server-side pagination and category filters.
* **PDF Report Generation:** One-click automated PDF summary generation for HR inventory oversight.
* **Real-Time State Synchronization:** Powered by **TanStack Query** for background caching and instant UI re-renders without full-page reloads.
* **Dark Glassmorphic UI:** Built with Tailwind CSS and Framer Motion for smooth visual interactions.

---

## 🛠️ Frontend Tech Stack & Libraries

* **Core Framework:** React.js (Vite)
* **Styling & UI:** Tailwind CSS, DaisyUI, Framer Motion
* **Icons & Notifications:** Lucide React, SweetAlert2
* **State & Data Fetching:** TanStack Query (React Query), Axios, Context API
* **Routing:** React Router DOM
* **Authentication:** Firebase Authentication
* **Integrations:** Stripe JS SDK, HTML2PDF / jsPDF

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in your root folder and add your configuration credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PAYMENT_GATEWAY_PK=your_stripe_publishable_key
VITE_API_URL=your_backend_server_url
```
---

## 🚀 How to Run Locally
Clone the repository:

Bash
git clone [https://github.com/mostakim8/client-side-assetverse-ms011a011.git](https://github.com/mostakim8/client-side-assetverse-ms011a011.git)

cd client-side-assetverse-ms011a011

**Install dependencies:**

Bash

npm install


**Run the development server:**

Bash

npm run dev
