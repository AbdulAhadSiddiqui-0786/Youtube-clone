import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { SearchProvider } from './context/SearchContext'
import '../src/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AuthProvider>
  </BrowserRouter>

)