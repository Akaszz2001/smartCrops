import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Indian states and their districts data
const indiaData = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Kadapa", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Roing", "Pasighat"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Ambala", "Karnal", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Shimoga"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Kannur", "Alappuzha","Idukki",],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Nongpoh", "Jowai", "Cherrapunji"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Berhampur"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Pelling", "Ravangla"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
  "Uttarakhand": ["Dehradun", "Nainital", "Haridwar", "Rudrapur", "Almora"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Asansol", "Durgapur"],
};

const CompleteFarmerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  const [farmName, setFarmName] = useState("");
  const [statedata, setStatedata] = useState("");
  const [districtdata, setDistrictdata] = useState("");
  const [crops, setCrops] = useState("");
  const [districts, setDistricts] = useState([]); // Districts of the selected state

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setStatedata(selectedState);
    setDistricts(indiaData[selectedState] || []);
    setDistrictdata("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/complete-farmer-details", {
        userId,
        farmName,
        state: statedata,
        district: districtdata,
        crops: crops.split(","), // Convert comma-separated crops into an array
      });
      console.log("response", response);

      alert("Farmer details updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating farmer details:", error);
      alert("Failed to update details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Complete Farmer Details</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Farm Name"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg"
        />

        {/* State Dropdown */}
        <select
          value={statedata}
          onChange={handleStateChange}
          className="block w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select State</option>
          {Object.keys(indiaData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* District Dropdown */}
        <select
          value={districtdata}
          onChange={(e) => setDistrictdata(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Crops (comma-separated)"
          value={crops}
          onChange={(e) => setCrops(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompleteFarmerDetails;
