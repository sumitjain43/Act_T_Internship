import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'

function App() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <Header onSearch={setSearchQuery} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<><HeroBanner /><Home /></>} />
          <Route path="/products" element={<Products searchQuery={searchQuery} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
