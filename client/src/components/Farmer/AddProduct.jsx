import  { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';



import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cropType: '',
    quantity: '',
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

useEffect(() => {
    const validateUser = async () => {
      try {
        // Fetch the user's profile
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          withCredentials: true, // Include cookies for Passport.js session
        });

        const user = response.data.data;

        // Check if the user is not a farmer
        if (user.userType !== 'farmer') {
          navigate('/home'); // Redirect to customer home
        }
      } catch (error) {
        console.error('Error validating user:', error);

        // Redirect to login if not authenticated
        navigate('/login');
      }
    };

    validateUser();
  }, [navigate]);
  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const form = new FormData();
      form.append('image', image);
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('cropType', formData.cropType);
      form.append('quantity', formData.quantity);
  
      const response = await axios.post('http://localhost:5000/api/farmers/addProduct', form, {
          withCredentials: true, 
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
  
      if (response.data.success) {
          setSuccessMessage(response.data.message); // Success Message from Backend
          setFormData({
              name: '',
              description: '',
              price: '',
              cropType: '',
              quantity: '',
          });
          setImage(null);
      } else {
          setErrorMessage('Unexpected error occurred.');
      }
  } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Failed to add product.');
  } finally {
      setLoading(false);
  }
  
  };

  return (
    <div>
        <Navbar/>
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Crop Type</label>
          <input
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
