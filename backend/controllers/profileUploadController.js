const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require("jsonwebtoken");
const con = require("../models/db"); // Ensure correct path

// Define the upload directory path
const uploadDir = path.join(__dirname, './uploads/profile-pictures');

// Ensure that the upload directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Upload directory created:", uploadDir);
  } catch (err) {
    console.error("Error creating upload directory:", err.message);
  }
}

// Configure storage for Multer with a destination folder and a unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    if (!req.user_id) {
      return cb(new Error("Missing user identifier in request"));
    }
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user_id}_${Date.now()}${ext}`);
  }
});

// File filter for validating that only image files are uploaded
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

// Controller function to handle the file upload and update profile picture in the database
const uploadProfilePicture = (req, res) => {
  // Extract the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }
  
  // Verify the token
  jwt.verify(token, "hayaltamrat@27", (jwtErr, decoded) => {
    if (jwtErr) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    // Set the decoded user_id on the request object
    req.user_id = decoded.user_id;
    
    // Create the multer upload middleware instance locally with the storage & fileFilter configuration
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
    });
    
    // Process file upload using the local upload instance
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to upload file.",
          error: err.message
        });
      }
      
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file was uploaded."
        });
      }
      
      // Double-check the presence of req.user_id (set by jwt.verify)
      const userId = req.user_id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Missing user identifier from request."
        });
      }
      
      // Construct the relative URL of the uploaded avatar
      const avatarUrl = `/uploads/profile-pictures/${req.file.filename}`;
      
      // Update query to change the avatar column in the users table using the authenticated user_id
      const updateQuery = "UPDATE users SET avatar = ? WHERE user_id = ?";
      con.query(updateQuery, [avatarUrl, userId], (dbErr, result) => {
        if (dbErr) {
          console.error("Database error updating profile picture:", dbErr.message);
          return res.status(500).json({
            success: false,
            message: "Error updating profile picture in database.",
            error: dbErr.message
          });
        }
        
        // Check if the user was found and updated
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found."
          });
        }
        
        // Send successful response with the new avatar URL
        res.status(200).json({
          success: true,
          message: "Profile picture updated successfully.",
          avatarUrl
        });
      });
    });
  });
};

module.exports = { uploadProfilePicture };
