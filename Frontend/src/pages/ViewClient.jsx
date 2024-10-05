import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientsList = ({ centerId, onClientSelect }) => {
  const [clients, setClients] = useState([]); // State to store the list of clients
  const [error, setError] = useState(''); // State to store any error messages
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      if (!token) {
        setError('No token found. Please log in.'); // Error message for missing token
        setLoading(false); // Stop loading
        return; // Exit early if there's no token
      }

      try {
        // Fetch clients from API with the token in the headers
        const response = await axios.get(`http://localhost:5000/api/clients?center=${centerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data); // Set the clients state with the response data
      } catch (err) {
        const errorMsg = err.response && err.response.data.error 
          ? err.response.data.error 
          : 'Unknown error occurred'; // Detailed error message
        setError(`Failed to fetch clients: ${errorMsg}`); // Set error state
        console.error('Error fetching clients:', err); // Log the error to console
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    if (centerId) {
      fetchClients(); // Fetch clients only if centerId is present
    } else {
      setError('No center ID provided.'); // Error for missing center ID
      setLoading(false); // Stop loading
    }
  }, [centerId]); // Run effect whenever centerId changes

  return (
    <div className="clients-list">
      <h2>Clients in Center {centerId}</h2>
      {error && <p className="error">{error}</p>} {/* Display error message if exists */}
      {loading ? (
        <p>Loading clients...</p> // Show loading message
      ) : clients.length > 0 ? (
        <ul>
          {clients.map((client) => (
            <li key={client._id} onClick={() => onClientSelect(client._id)}>
              {client.fullName || 'Unnamed Client'} {/* Display client's full name */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found for this center.</p> // Message when no clients are found
      )}
    </div>
  );
};

export default ClientsList;
