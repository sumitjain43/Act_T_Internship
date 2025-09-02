import React from 'react'
import { Link } from 'react-router-dom'

function HeroBanner() {
  return (
    <div className='max-w-7xl mx-auto relative flex items-center justify-center rounded-xl overflow-hidden'>
     <div className="absolute inset-0" />
         <img src="/saleimage.png" alt="Big Sale Banner" className=" bg-blue-300 w-auto h-96 md:h-96 object-cover" />
         <div className="absolute text-center px-6">
           <Link to="/products" className="inline-block mt-72 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700">Shop Now</Link>
         </div>
    </div>
  )
}

export default HeroBanner
