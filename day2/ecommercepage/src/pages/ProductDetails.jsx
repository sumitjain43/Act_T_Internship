import { useParams } from "react-router-dom";
import { useState } from "react";
import { PRODUCT_IMAGE_URL } from "../constants";

const sampleProducts = [
  { id: 1, name: "iPhone 14", price: 799, description: "Latest Apple iPhone with A15 Bionic chip.", image: PRODUCT_IMAGE_URL },
  { id: 2, name: "Samsung Galaxy S23", price: 699, description: "Flagship Samsung phone with AMOLED display.", image: PRODUCT_IMAGE_URL },
  { id: 3, name: "MacBook Air", price: 1199, description: "Lightweight Apple laptop with M1 chip.", image: PRODUCT_IMAGE_URL },
  { id: 4, name: "Sony Headphones", price: 199, description: "Noise-cancelling wireless headphones.", image: PRODUCT_IMAGE_URL },
  { id: 5, name: "Nike Shoes", price: 149, description: "Stylish running shoes for comfort and speed.", image: PRODUCT_IMAGE_URL },
  { id: 6, name: "Apple Watch", price: 399, description: "Smartwatch with fitness tracking and notifications.", image: PRODUCT_IMAGE_URL },
];

function ProductDetails() {
  const { id } = useParams();
  const product = sampleProducts.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <h2 className="p-6 text-xl">Product not found</h2>;
  }

  const handleAddToCart = () => {
    alert(`${quantity} x ${product.name} added to cart 🛒`);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-contain rounded-lg bg-white p-6 shadow"
        />
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
        <p className="text-xl text-gray-100 mb-4">₹{product.price}</p>
        <p className="text-gray-200 mb-6">{product.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <label className="font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 border rounded p-2 text-black bg-white"
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
