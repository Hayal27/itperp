
import React, { useState } from "react";
import Axios from "axios";
import { useAuth } from "../../Auths/AuthContex";

const ProfilePictureUpload = ({ token, onUploadSuccess, onCancel }) => {
  const { state } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("user_id", state.user);

    setUploading(true);
    try {
      const response = await Axios.post(
        "http://192.168.100.134:5000/api/uploadProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );
      if (response.data && response.data.success) {
        // After successful upload, use the provided callback to update the profile picture.
        if (onUploadSuccess) {
          onUploadSuccess(response.data.avatarUrl);
        }
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <div style={{ marginTop: "10px" }}>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;
