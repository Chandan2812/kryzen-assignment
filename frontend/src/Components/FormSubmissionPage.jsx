// FormSubmissionPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import "../style.css";
import "../FormSubmissionPage.css"; 

function FormSubmissionPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleFormSubmission = async () => {
    try {
      // Get the token from the cookie
      const authToken = Cookies.get('authToken');
      
      // Check if the token is available
      if (!authToken) {
        console.error("authToken cookie not found");
        alert("Authentication failed. Please log in and try again.");
        return;
      }

      console.log('Retrieved Token:', authToken);
      // Create FormData object to send files along with other data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("address", address);
      formData.append("photo", photo);

      const response = await fetch("http://localhost:8000/pdf/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${authToken}`,
      },
      body: formData,
    });
    console.log("Raw response:", await response.text()); 
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Form submission successful
        alert("Form submitted successfully!");
        navigate("/preview/" + data._id); // Redirect to the preview page for the submitted data
      } else {
        // Form submission failed
        console.error("Form submission failed");
        alert("Form submission failed. Please try again later.");
      }
    } catch (error) {
      console.error("Form submission failed:", error.message);
      alert("Form submission failed. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h1>Form Submission</h1>
        <form>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter Age"
            />
          </label>
          <label>
            Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
            ></textarea>
          </label>
          <label>
            Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </label>
          <button type="button" onClick={handleFormSubmission}>
            Submit Form
          </button>
        </form>
      </div>
      <div className="divider"></div>
      <div className="preview-container">
        {/* Add preview content here */}
        {/* You can display the preview dynamically based on the submitted form data */}
        {/* For example, display the entered name, age, and address */}
        <h2>Preview</h2>
        
      </div>
    </div>
  );
}

export default FormSubmissionPage;
