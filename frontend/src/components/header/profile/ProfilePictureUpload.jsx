
import React, { useState, useCallback } from "react";
import Axios from "axios";
import Cropper from "react-easy-crop";
import { useAuth } from "../../Auths/AuthContex";
import getCroppedImg from "./cropImageHelper";
import "../../../assets/css/magic-tooltip.css";

const ProfilePictureUpload = ({ token, onUploadSuccess, onCancel }) => {
  const { state } = useAuth();
  // Use token prop or fallback to token from localStorage
  const authToken = token || localStorage.getItem("token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileChange = async (e) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Load image into src for cropping
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !imageSrc) {
      setError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      // Get the cropped image blob.
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Convert blob to file so we can insert into FormData.
      const croppedFile = new File([croppedImageBlob], selectedFile.name, { type: selectedFile.type });
      const formData = new FormData();
      formData.append("avatar", croppedFile);
      formData.append("user_id", state.user);

      const response = await Axios.post(
        "http://localhost:5000/api/uploadProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data && response.data.success) {
        // Set success message and clear it after 2 seconds.
        setSuccessMessage("Upload Successful");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
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
      <h3>ምስሎን ያዘምኑ</h3>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        {imageSrc && (
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        {imageSrc && (
          <div className="zoom-controls">
            <label className="zoom-label" htmlFor="zoomRange">Zoom:</label>
            <input
              id="zoomRange"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="zoom-slider"
            />
          </div>
        )}
        <div className="button-group">
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;
