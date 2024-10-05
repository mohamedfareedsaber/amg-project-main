import React, { useState, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './ClientManagement.css';
import { states, cities, nationalities } from './stateCityData';

const Client = () => {
  const [clientForm, setClientForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    motherName: '',
    gender: '',
    religion: '',
    nationality: '',
    maritalStatus: '',
    nationalIdNumber: '',
    passportNumber: '',
    passportExpiryDate: '',
    address: '',
    city: '',
    stateOrProvince: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    hasDisability: false,
    disabilityType: '',
    needsSpecialAssistance: false,
    assistanceType: '',
    hasPreviousMedicalCondition: false,
    medicalConditions: '',
    hasSurgeryInLastTwoYears: false,
    surgeryDetails: '',
    currentMedication: '',
    preferredContactMethod: '',
    contactTimePreference: '',
    photo: null,
    
  });
  

  const [availableCities, setAvailableCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const currentDate = new Date().toISOString().split('T')[0];
  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100))
    .toISOString()
    .split('T')[0];

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  React.useEffect(() => {
    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    const img = canvas.toDataURL('image/png');
    setImage(img);
    setClientForm((prev) => ({ ...prev, photo: img }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStateChange = (selectedOption) => {
    const state = selectedOption ? selectedOption.value : '';
    setClientForm({ ...clientForm, stateOrProvince: state, city: '' });
    setAvailableCities(cities[state] || []);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClientForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCityChange = (selectedOption) => {
    setClientForm({ ...clientForm, city: selectedOption ? selectedOption.value : '' });
  };

  const handleNationalityChange = (selectedOption) => {
    setClientForm({ ...clientForm, nationality: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const centerId = localStorage.getItem('center');
    
    const formData = new FormData();
    formData.append("center", centerId);
  
    for (const [key, value] of Object.entries(clientForm)) {
      if (key === 'photo' && value) {
        const blob = await (await fetch(value)).blob();
        formData.append('photo', blob, 'captured-image.png');
      } else {
        formData.append(key, value);
      }
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Client registered successfully!');
      setErrorMessage('');
      setClientForm({ /* reset form */ }); // Call the function to reset form here
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex">
      <div className="container mx-auto px-4 py-8 bg-gray-100 flex-grow">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Registration Form</h1>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Video Capture Section */}
          <div className="mb-4">
            <video ref={videoRef} autoPlay style={{ width: '300px' }} />
            <button type="button" onClick={captureImage} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
              Capture Image
            </button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {image && <img src={image} alt="Captured" style={{ width: '300px' }} />}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={clientForm.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={clientForm.middleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={clientForm.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Date of Birth, Mother Name, Gender, and Religion */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={clientForm.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                min={minDate}
                max={currentDate}
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={clientForm.motherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Gender</label>
              <select
                name="gender"
                value={clientForm.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Religion</label>
              <input
                type="text"
                name="religion"
                value={clientForm.religion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Nationality and Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Nationality</label>
              <Select
                options={nationalities}
                onChange={handleNationalityChange}
                className="basic-single"
                classNamePrefix="select"
                isClearable
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Marital Status</label>
              <select
                name="maritalStatus"
                value={clientForm.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* ID and Passport Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">National ID Number</label>
              <input
                type="text"
                name="nationalIdNumber"
                value={clientForm.nationalIdNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                value={clientForm.passportNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Passport Expiry Date</label>
              <input
                type="date"
                name="passportExpiryDate"
                value={clientForm.passportExpiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                min={currentDate}
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={clientForm.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <Select
                options={availableCities}
                onChange={handleCityChange}
                className="basic-single"
                classNamePrefix="select"
                isClearable
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">State/Province</label>
              <Select
                options={states}
                onChange={handleStateChange}
                className="basic-single"
                classNamePrefix="select"
                isClearable
              />
            </div>
          </div>

          {/* Postal Code and Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={clientForm.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={clientForm.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={clientForm.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Has Disability</label>
            <input
              type="checkbox"
              name="hasDisability"
              checked={clientForm.hasDisability}
              onChange={handleChange}
            />
          </div>
          {clientForm.hasDisability && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Disability Type</label>
              <input
                type="text"
                name="disabilityType"
                value={clientForm.disabilityType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Needs Special Assistance</label>
            <input
              type="checkbox"
              name="needsSpecialAssistance"
              checked={clientForm.needsSpecialAssistance}
              onChange={handleChange}
            />
          </div>
          {clientForm.needsSpecialAssistance && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Assistance Type</label>
              <input
                type="text"
                name="assistanceType"
                value={clientForm.assistanceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Has Previous Medical Condition</label>
            <input
              type="checkbox"
              name="hasPreviousMedicalCondition"
              checked={clientForm.hasPreviousMedicalCondition}
              onChange={handleChange}
            />
          </div>
          {clientForm.hasPreviousMedicalCondition && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Medical Condition Details</label>
              <input
                type="text"
                name="medicalConditionDetails"
                value={clientForm.medicalConditionDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={clientForm.additionalNotes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Client;
