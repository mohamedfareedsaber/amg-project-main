import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateClientStatus = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000//api/clients`);
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleToggleActive = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clients/${clientId}`, { isActive: !client.isActive });
      setClient((prev) => ({ ...prev, isActive: !prev.isActive }));
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };
  if (loading) return <p>Loading...</p>;
  if (!client) return <p>Client not found</p>;

  return (
    <div>
      <h1>{client.fullName}</h1>
      <p>Email: {client.email}</p>
      <label>
        <input
          type="checkbox"
          checked={client.isActive}
          onChange={handleToggleActive}
        />
        Active
      </label>
    </div>
  );
};

export default UpdateClientStatus;
