import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';

function Header({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    navigate('/products');
  };

  return (
        <div className='fixed z-10 w-full mb-10 max-w-7xl'>
             <nav className="w-full ">
        <div className="max-w-7xl bg-white shadow-md mx-auto px-4 flex items-center rounded-full justify-between h-16">
            <div className="flex-shrink-0">
                <Link to="/" className="font-bold text-xl text-blue-600">
                    <img src="https://thumbs.dreamstime.com/b/creative-simple-dragons-silhouettes-logo-stylized-vector-illustrations-simple-dragons-silhouettes-logo-130475058.jpg" 
                     alt="Logo" className="h-10 w-auto" />
                </Link>
            </div>

               {/* Search bar */}
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 ml-3"
                >
                  Search
                </button>
              </form>
            
            <ul className="hidden md:flex space-x-8 text-black">
                <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                <li><Link to="/products" className="hover:text-blue-600">Products</Link></li>
                <li><Link to="/cart" className="hover:text-blue-600">Cart</Link></li>
                <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
            <button id="menu-btn" className="md:hidden flex items-center px-3 py-2 border rounded text-blue-600 border-blue-600">
                <img className="h-6 w-6" src="align-justified-svgrepo-com.svg" alt="" />
            </button>
        </div>
        <ul id="mobile-menu" className="md:hidden px-4 pb-4 space-y-2 hidden">
            <li><Link to="/" className="block py-2 hover:text-blue-600">Home</Link></li>
            <li><Link to="/products" className="block py-2 hover:text-blue-600">Products</Link></li>
            <li><Link to="/cart" className="block py-2 hover:text-blue-600">Cart</Link></li>
            <li><a href="#contact" className="block py-2 hover:text-blue-600">Contact</a></li>
        </ul>
    </nav>
    </div>
  )
}

export default Header
