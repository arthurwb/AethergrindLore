import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

import Layout from './components/Layout'
import MarkdownPage from './pages/MarkdownPage'
import IndexPage from './pages/IndexPage'
import Maps from './pages/Maps'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="*" element={<MarkdownPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
