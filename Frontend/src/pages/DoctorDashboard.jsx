import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClientsList from './ViewClient';
import Clientfit from './Clientfit';
import "./maindocter.css";

const DoctorDashboard = () => {
  const [centerInfo, setCenterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const centerId = localStorage.getItem("center");

  // Log the centerId for debugging
  console.log("Center ID:", centerId);

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchCenterInfo = async () => {
      console.log("Fetching center info...");
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/centers/${centerId}`);
        console.log("Fetched Center Info:", response.data);
        if (response.data) {
          setCenterInfo(response.data);
        } else {
          setError('No center information found.');
        }
      } catch (err) {
        console.error('Error fetching center info:', err);
        setError('Failed to fetch center information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (centerId) {
      fetchCenterInfo();
    } else {
      setError('Center ID not found in local storage');
      setLoading(false);
    }
  }, [centerId]);
  

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId); 
  };

  // Debugging logs
  
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Center Info:", centerInfo);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      {loading && <p>Loading center information...</p>}
      {error && <p className="error">{error}</p>}
      {centerInfo && (
        <div>
          <h2>Center Information</h2>
          <p>{centerInfo.name}</p>
        </div>
      )}
      <ClientsList centerId={centerId} onClientSelect={handleClientSelect} />
      {selectedClientId && <Clientfit clientId={selectedClientId} />}
    </div>
  );
};

export default DoctorDashboard;
