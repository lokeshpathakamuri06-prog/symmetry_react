import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter variable font served from our own server (one file for all weights; Latin subset as needed)
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import { clearLegacyStorage } from './lib/legacyStorage'

clearLegacyStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
