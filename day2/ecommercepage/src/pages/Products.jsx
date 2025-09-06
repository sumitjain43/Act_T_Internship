import { useState } from "react";
import ProductCard from "../components/ProductCard";

const sampleProducts = [
  { id: 1, name: "iPhone 14", price: 799, category: "Mobiles", image: "/images/iphone.jpg" },
  { id: 2, name: "Samsung Galaxy S23", price: 699, category: "Mobiles", image: "/images/samsung.jpg" },
  { id: 3, name: "MacBook Air", price: 1199, category: "Laptops", image: "/images/macbook.jpg" },
  { id: 4, name: "Sony Headphones", price: 199, category: "Accessories", image: "/images/sony.jpg" },
  { id: 5, name: "Nike Shoes", price: 149, category: "Fashion", image: "/images/nike.jpg" },
  { id: 6, name: "Apple Watch", price: 399, category: "Accessories", image: "/images/watch.jpg" },
];


function Products({ searchQuery }) {
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

 
  const filteredProducts = sampleProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    const matchPrice =
      priceRange === "All" ||
      (priceRange === "0-500" && p.price <= 500) ||
      (priceRange === "500-1000" && p.price > 500 && p.price <= 1000) ||
      (priceRange === "1000+" && p.price > 1000);

    return matchSearch && matchCategory && matchPrice;
  });

  return (
    <div className="p-6">
    
      <h2 className="text-2xl font-semibold mb-6">All Products</h2>

    
      <div className="flex flex-wrap gap-4 mb-6">
       
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Laptops">Laptops</option>
          <option value="Accessories">Accessories</option>
          <option value="Fashion">Fashion</option>
        </select>

       
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Prices</option>
          <option value="0-500">₹0 - ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="1000+">₹1000+</option>
        </select>
      </div>

    
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}

export default Products;
