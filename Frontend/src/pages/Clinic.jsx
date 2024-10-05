import React, { useState } from "react";
import axios from "axios";

const AddClinic = () => {
  const [clinicName, setClinicName] = useState("");
  const [clinicservice, setClinicService] = useState("");
  const [message, setMessage] = useState("");
  const centerId = localStorage.getItem("center");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centerId) {
      setMessage("Center ID not found. Please log in as a center admin.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/clinics/add",
        {
          name: clinicName,
          service: clinicservice,
          centerId: centerId, 
        },
        {
          headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setClinicName(""); 
      setClinicService("");
    } catch (error) {
      setMessage("Error adding clinic: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h1>Add Clinic</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Clinic Name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          required
        />
         <input
          type="text"
          placeholder="Clinic service"
          value={clinicservice}
          onChange={(e) => setClinicService(e.target.value)}
          required
        />
        <button type="submit">Add Clinic</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddClinic;
