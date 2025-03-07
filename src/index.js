import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "./styles/App.scss"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)