import React, { useState } from 'react';
import Axios from 'axios';
import { useAuth } from '../Auths/AuthContex';
import { useNavigate } from 'react-router-dom';

const ProfilePictureUpload = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    // append the file and ensure to send user id if needed on the backend
    formData.append('avatar', selectedFile);
    formData.append('user_id', state.user);

    setUploading(true);
    try {
      // Assuming the backend endpoint is configured to accept file uploads at this URL
      const response = await Axios.post("http://localhost:5000/api/profile/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.success) {
        // Optionally update local state or trigger a refresh of the user profile
        // For example: dispatch({ type: 'UPDATE_AVATAR', payload: response.data.avatarUrl });
        navigate("/profile");
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (uploadError) {
      console.error("Error uploading profile picture:", uploadError);
      setError("Error uploading profile picture.");
    }
    setUploading(false);
  };

  return (
    <div className="profile-picture-upload">
      <h3>Update Profile Picture</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;