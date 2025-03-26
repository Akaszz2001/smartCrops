
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom'
function Farmer() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
    <Navbar />
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex">
     
        <div className="w-1/4 flex justify-center items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Farmer"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        
       
        <div className="w-3/4 pl-6">
          <h1 className="text-3xl font-semibold text-gray-800">John Doe</h1>
          <p className="text-lg text-gray-600">Location: XYZ Farm</p>
          <p className="text-lg text-gray-600">Experience: 5 Years</p>
          
          <div className="mt-8 space-y-4">
          
            <div className="flex justify-between items-center">
              <Link
                to="/soil-report-history"
                className="text-blue-600 hover:underline"
              >
                Soil Report History
              </Link>
              <Link
                to="/profile/edit"
                className="text-blue-600 hover:underline"
              >
                Edit Profile
              </Link>
              <Link
                to="/products-history"
                className="text-blue-600 hover:underline"
              >
                Products Sold History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Farmer