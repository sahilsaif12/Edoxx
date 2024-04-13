import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'animate.css';
import { BrowserRouter } from 'react-router-dom';
import AppState from './context/AppState.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
  <BrowserRouter>
  <AppState>
    <App />
  </AppState>
  </BrowserRouter>
  </React.StrictMode>,
)
