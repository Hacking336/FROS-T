import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import BrandPage from './pages/BrandPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServicePage from './pages/ServicePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:brand" element={<BrandPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}
