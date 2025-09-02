import React from 'react'
import { Link } from 'react-router-dom'

function Cart() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="bg-white/10 p-6 rounded-md">
        <p className="mb-4">Your cart is empty.</p>
        <Link to="/products" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Browse products</Link>
      </div>
    </div>
  )
}

export default Cart
