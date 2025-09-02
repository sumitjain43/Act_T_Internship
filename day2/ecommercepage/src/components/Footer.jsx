import React from 'react'

function Footer() {
  return (
    <div>
      <section id="contact" className="py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Contact Me</h2>
      <form action="#" method="POST" className="space-y-4 max-w-lg mx-auto bg-white/10 p-6 rounded-lg shadow-2xl">
        <div>
          <label 
          htmlFor="name" 
          className="block font-medium mb-1">Name:</label>
          <input 
          type="text" 
          id="name" name="name" required 
                 className="w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email:</label>
          <input type="email" id="email" name="email" required 
                 className="w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"/>
        </div>
        <div>
          <label htmlFor="message" className="block font-medium mb-1">Message:</label>
          <textarea id="message" name="message" rows="4" required 
                    className="w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
        </div>
        <button type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Send
        </button>
      </form>
    </div>
     <footer className="bg-white py-6 w-full max-w-7xl mt-12 shadow-inner text-center flex related justify-between text-gray-600 p-3 rounded-md mx-auto">
        <ul className='flex flex-row space-x-8'>
          <li className=' hover:text-red-800'><a href="/about-us.html">About Us</a></li>
          <li className=' hover:text-red-800'><a href="/privacy-policy.html">Privacy Policy</a></li>
          <li className=' hover:text-red-800'><a href="/terms-of-service.html">Terms of Service</a></li>
       </ul>  
       <div className=' hover:text-red-800'> © {new Date().getFullYear()} All rights reserved.</div>
      </footer>
  </section>
    </div>
  )
}

export default Footer
