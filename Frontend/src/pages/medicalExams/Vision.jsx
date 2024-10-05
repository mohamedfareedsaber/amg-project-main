import Base from "./base";
import { useParams } from "react-router-dom";

export default function VisionExam() {
  const { clientId } = useParams(); // For dynamic routing

  const inputs = [
    { name: "eysr", label: "Right Eye Sphere", type: "text" },
    { name: "eysl", label: "Left Eye Sphere", type: "text" },
    { name: "comment", label: "Comments", type: "text" },  
    // Add other necessary input fields here
  ];

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Client updated successfully:', data);
        // Optionally, provide user feedback, redirect, or clear the form here
      } else {
        console.error('Error updating client:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Base
      categoryName={"Vision Exam"}
      inputs={inputs} // Pass inputs to Base component
      onSubmit={handleSubmit}
    />
  );
}
