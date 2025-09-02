import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="border rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 bg-white">
      <div className="p-4">
        <div className="w-full aspect-square bg-gray-50 rounded flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-700">₹{product.price}</p>
        <div className="mt-3 flex justify-between">
          <Link
            to={`/products/${product.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
          <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
