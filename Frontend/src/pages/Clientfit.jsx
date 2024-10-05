import React, { useState } from 'react';

const token = localStorage.getItem('token');

export default function Clientfit({ clientId }) {
  const [formData, setFormData] = useState({
    fit: false,
    unfit: false
  });

  const handleInputChange = (event) => {
    const { name, checked } = event.target;

    setFormData((prevState) => {
      let updatedState = { ...prevState, [name]: checked };

      // If 'fit' is checked, uncheck 'unfit' and vice versa
      if (name === 'fit' && checked) {
        updatedState.unfit = false;
      } else if (name === 'unfit' && checked) {
        updatedState.fit = false;
      }

      return updatedState;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Client updated successfully:', data);
      } else {
        console.error('Error updating client:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fit">Fit</label>
        <input
          type="checkbox"
          id="fit"
          name="fit"
          checked={formData.fit}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="unfit">Unfit</label>
        <input
          type="checkbox"
          id="unfit"
          name="unfit"
          checked={formData.unfit}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
