import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'


import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import persistStore from 'redux-persist/es/persistStore'

const persistor = persistStore(store);
const router = createBrowserRouter([
  {
    path: "*",
    element: <App />
  }
], {
  future: {
    v7_startTransition: true,           // Envolver actualizaciones de estado con React.startTransition
    v7_relativeSplatPath: true,         // Resolución de rutas relativas en rutas tipo "*"
    v7_fetcherPersist: true,            // Persistencia de fetchers
    v7_normalizeFormMethod: true,       // Normalización de métodos en formularios
    v7_partialHydration: true,          // Hidratación parcial
    v7_skipActionErrorRevalidation: true, // Omisión de revalidación después de errores 4xx/5xx
  },
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router = {router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
