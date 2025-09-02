import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCT_IMAGE_URL } from '../constants'

const featured = [
  { id: 1, name: "iPhone 14", price: 799, category: "Mobiles", image: PRODUCT_IMAGE_URL },
  { id: 2, name: "Samsung Galaxy S23", price: 699, category: "Mobiles", image: PRODUCT_IMAGE_URL },
  { id: 3, name: "MacBook Air", price: 1199, category: "Laptops", image: PRODUCT_IMAGE_URL },
  { id: 4, name: "Sony Headphones", price: 199, category: "Accessories", image: PRODUCT_IMAGE_URL },
  { id: 5, name: "Nike Shoes", price: 149, category: "Fashion", image: PRODUCT_IMAGE_URL },
  { id: 6, name: "Apple Watch", price: 399, category: "Accessories", image: PRODUCT_IMAGE_URL },
]

function Home() {
  return (
    <div className=" w-full  mx-auto p-6">
     <img src='homeproductimage.png'/>
    </div>
  )
}

export default Home
