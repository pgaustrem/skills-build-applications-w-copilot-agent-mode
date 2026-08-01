import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
if (!codespaceName) {
  console.info('VITE_CODESPACE_NAME is unset; frontend will use the localhost API fallback.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
