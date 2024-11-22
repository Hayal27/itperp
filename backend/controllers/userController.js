// controllers/userController.js

const con = require("../models/db"); // Assumes you have a db.js file that exports the database connection
const bcrypt = require('bcrypt');

// Add user
const addUser = async (req, res) => {
  const { user_name, fname, lname, email, phone, department_id, role_name } = req.body;

  // Set default password
  const defaultPassword = 'itp@123';

  // First, check for existing user with the same email
  const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
  con.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error while checking email:", err);
      return res.status(500).send({ message: "Error checking email", error: err.message });
    }
    
    if (results.length > 0) {
      return res.status(400).send({ message: "Email already registered." });
    }

    // Next, check for existing user with the same phone number
    const checkPhoneQuery = "SELECT * FROM users WHERE phone = ?";
    con.query(checkPhoneQuery, [phone], (err, results) => {
      if (err) {
        console.error("Database error while checking phone:", err);
        return res.status(500).send({ message: "Error checking phone", error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).send({ message: "Phone number already registered." });
      }

      // If checks pass, hash the default password
      bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send({ message: "Error hashing password", error: err.message });
        }

        // Insert the new user with the hashed password
        const query = "INSERT INTO users (user_name, fname, lname, email, phone, department_id, role_name, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        con.query(query, [user_name, fname, lname, email, phone, department_id, role_name, hashedPassword], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).send({ message: "Error saving user data", error: err.message });
          }
          res.status(200).send({ message: "User successfully registered" });
        });
      });
    });
  });
};



// Get all roles
const getAllRoles = (req, res) => {
  con.query("SELECT * FROM role", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving roles", error: err });
    }
    res.json(results);
  });
};


// get departments
const getdepartment = (req, res) => {
  con.query("SELECT * FROM department", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving department", error: err });
    }
    res.json(results);
  });
};


// Get all users
const getAllUsers = (req, res) => { // Renamed to getAllUsers
  con.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving users", error: err });
    }
    res.json(results);
  });
};



// Change user status active or inactive
const changeUserStatus = (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (status !== 0 && status !== 1) {
    return res.status(400).json({ message: "Invalid status. Use 0 for inactive and 1 for active." });
  }

  con.query("UPDATE users SET status = ? WHERE user_id = ?", [status, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user status", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated successfully" });
  });
};

// Update user
const updateUser = (req, res) => {
  const { user_id } = req.params;
  const { fname, lname, user_name, department_id, phone, role_name } = req.body;

  con.query(
    "UPDATE users SET fname = ?, lname = ?, user_name = ?, phone = ?, department_id=?, role_name = ? WHERE user_id = ?",
    [fname, lname, user_name, phone, role_name, department_id, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating user information", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User information updated successfully" });
    }
  );
};

// Delete user
const deleteUser = (req, res) => {
  const { user_id } = req.params;

  con.query("DELETE FROM user WHERE user_id = ?", [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting user", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  });

};


const changeStatus = async (status, user_id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${user_id}/status`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json(); // Parse the response
    console.log('API Response:', data); // Log the API response for debugging

    if (response.ok) {
      const action = status === 1 ? 'activated' : 'deactivated';
      setModalMessage(`User has been successfully ${action}.`);
      setShowModal(true);
      fetchUsers(); // Refresh users after status change
    } else {
      setModalMessage(data.message || 'Error changing user status. Please try again.');
      setShowModal(true);
    }
  } catch (error) {
    console.log("Error changing status:", error);
    setModalMessage('Error changing user status. Please try again.');
    setShowModal(true);
  }
};





module.exports = {
  addUser,
  getAllRoles,
  getdepartment,
  getAllUsers, // Updated function name here
  changeUserStatus,
  updateUser,
  deleteUser,
 changeStatus,

};