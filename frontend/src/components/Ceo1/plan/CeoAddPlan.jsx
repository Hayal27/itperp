// import Axios from "axios";
// import React, { useState } from 'react';
// import '../../../assets/css/planform.css'

// const PlanSubmissionForm = () => {
//   // State to hold form data
//   const [formData, setFormData] = useState({
//     objective: '',
//     goal: '',
//     row_no: '',
//     details: '',
//     measurement: '',
//     Baseline: '',
//     plan: '',
//     outcome: '',
//     execution_percentage: '',
//     description: '',
//     year: '',
//     quarter: 'Q1',
//   });

//   // State to handle form submission status
//   const [responseMessage, setResponseMessage] = useState('');

//   // Update state when form fields change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token'); // Get the JWT token from localStorage

//     if (!token) {
//       alert('You must be logged in to submit a plan.');
//       return;
//     }

//     try {
//       // Send the request to submit the plan using Axios
                                      
//       const response = await Axios.post("http://localhost:5000/api/plans", formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,  // Ensure that your token is valid and sent correctly
//         },
//       });

//       if (response.data && response.data.plan_id) {
//         setResponseMessage(`Plan submitted successfully with ID: ${response.data.plan_id}`);
//       } else {
//         setResponseMessage(`Error: ${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting plan:', error);
//       setResponseMessage('An error occurred while submitting the plan.');
//     }
//   };

//   return (
//     <div className="form-container-10">
//       <h2>እቅዶን ይመዝግቡ</h2>
//       <form onSubmit={handleSubmit}>
//         <label>አላማ:</label>
//         <input
//           type="text"
//           name="objective"
//           value={formData.objective}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>ግብ:</label>
//         <input
//           type="text"
//           name="goal"
//           value={formData.goal}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>Row Number:</label>
//         <input
//           type="number"
//           name="row_no"
//           value={formData.row_no}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Details:</label>
//         <textarea
//           name="details"
//           value={formData.details}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Measurement:</label>
//         <input
//           type="text"
//           name="measurement"
//           value={formData.measurement}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Baseline:</label>
//         <input
//           type="text"
//           name="baseline"
//           value={formData.baseline}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Plan:</label>
//         <textarea
//           name="plan"
//           value={formData.plan}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Outcome:</label>
//         <textarea
//           name="outcome"
//           value={formData.outcome}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Execution Percentage:</label>
//         <input
//           type="number"
//           name="execution_percentage"
//           value={formData.execution_percentage}
//           onChange={handleChange}
//           min="0"
//           max="100"
//         />
//         <br />

//         <label>Description:</label>
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//         />
//         <br />

//         <label>Year:</label>
//         <input
//           type="number"
//           name="year"
//           value={formData.year}
//           onChange={handleChange}
//           required
//         />
//         <br />

//         <label>Quarter:</label>
//         <select
//           name="quarter"
//           value={formData.quarter}
//           onChange={handleChange}
//         >
//           <option value="Q1">Q1</option>
//           <option value="Q2">Q2</option>
//           <option value="Q3">Q3</option>
//           <option value="Q4">Q4</option>
//         </select>
//         <br />

//         <button type="submit">Submit Plan</button>
//       </form>

//       {responseMessage && <div>{responseMessage}</div>}
//     </div>
//   );
// };

// export default PlanSubmissionForm;
