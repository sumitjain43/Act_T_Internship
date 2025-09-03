import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex space-x-4 bg-gray-100 p-4">
      <Link to="/" className="hover:text-blue-600">Home</Link>
      <Link to="/about" className="hover:text-blue-600">About</Link>
      <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
    </nav>
  );
}

export default Navbar;
