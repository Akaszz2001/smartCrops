import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make the API request to fetch user profile
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          // With Passport.js and session-based authentication, credentials are included automatically
          withCredentials: true, // Ensures cookies (session) are sent with the request
        });

        setProfile(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
        <Navbar/>
   
    <div className="p-4 max-w-lg mx-auto border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.displayName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>User Type:</strong> {profile.userType}</p>
        {profile.photo && (
          <div className="mb-4">
            <img
              src={profile.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}
        {profile.userType === 'farmer' && profile.farmDetails && (
          <div>
            <h2 className="text-lg font-semibold mt-4">Farm Details</h2>
            <p><strong>Farm Name:</strong> {profile.farmDetails.farmName || 'N/A'}</p>
            <p><strong>Location:</strong> {profile.farmDetails.location || 'N/A'}</p>
            <p><strong>Crops:</strong> {profile.farmDetails.crops.join(', ') || 'N/A'}</p>
          </div>
        )}
        <p><strong>Account Created:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    
    
</div>
  );
};

export default Profile;
