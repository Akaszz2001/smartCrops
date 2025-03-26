
import Navbar from '../Navbar/Navbar'

function Customer() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
    <Navbar />
    <div className="container mx-auto py-16 px-6">
      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Customer Profile</h2>
        <div className="grid md:grid-cols-2 gap-8">
        
          <div>
            <h3 className="text-lg font-bold text-gray-700">Personal Information</h3>
            <p className="mt-2 text-gray-600">Name: Jane Smith</p>
            <p className="mt-2 text-gray-600">Email: jane.smith@example.com</p>
            <p className="mt-2 text-gray-600">Phone: +987 654 3210</p>
          </div>

          
          <div>
            <h3 className="text-lg font-bold text-gray-700">Address</h3>
            <p className="mt-2 text-gray-600">Street: 123 Main Street</p>
            <p className="mt-2 text-gray-600">City: Springfield</p>
            <p className="mt-2 text-gray-600">ZIP Code: 62704</p>
          </div>
        </div>

   =
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700">Order History</h3>
          <ul className="mt-4 space-y-2">
            <li className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-600">Order ID: #12345</p>
              <p className="text-gray-600">Date: 2024-12-01</p>
              <p className="text-gray-600">Status: Delivered</p>
            </li>
            <li className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-600">Order ID: #67890</p>
              <p className="text-gray-600">Date: 2024-11-15</p>
              <p className="text-gray-600">Status: Pending</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  )
}

export default Customer