const con = require('./db');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

// Secret key (as specified in your requirements)
const JWT_SECRET_KEY = 'hayaltamrat@27'; 

// Function to handle login
const getLogin = async (req, res) => {
    const { user_name, pass } = req.body;
    const query = 'SELECT * FROM users WHERE user_name = ?';

    con.query(query, [user_name], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal server error' });

        if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid username or password' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(pass, user['password']);

        if (passwordMatch && user.status === '1') {
            // Update user online status
            con.query('UPDATE users SET online_flag=? WHERE user_id=?', [1, user.user_id], (error) => {
                if (error) {
                    console.error('Error updating online status:', error);
                    return res.status(500).json({ success: false, message: 'Error updating online status' });
                }
            });

            // Generate a JWT token with a 1-hour expiration
            const token = jwt.sign({ user_id: user.user_id, role_id: user.role_id }, JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).json({ success: true, token, user });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
};

// Function to handle logout
const logout = (req, res) => {
    const id = req.params.user_id;

    // Update user's online_flag to 0 to indicate logout
    con.query('UPDATE users SET online_flag=? WHERE user_id=?', [0, id], (error, results) => {
        if (error) {
            console.error('Error updating logout status:', error);
            return res.status(500).send({ message: "Error updating logout status", error: error.message });
        } else {
            console.log('Logout status updated successfully', results);
            return res.status(200).send({ message: 'Logout successful' });
        }
    });
};

module.exports = { getLogin, logout };
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJyb2xlX2lkIjo4LCJpYXQiOjE3MzE0MTA4NDYsImV4cCI6MTczMTQxNDQ0Nn0.k4ttFZVVVDHuCk9vqqWB72qRdBmZ5x6B3nvHaJwgCZg

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlX2lkIjo4LCJpYXQiOjE3MzE0MTEyNjUsImV4cCI6MTczMTQxNDg2NX0.qq7gXT7Yq5yCvo8vXOF71qiGXxHATFGCAoXU5yxSiAU

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlX2lkIjo4LCJpYXQiOjE3MzE0MTEzMTEsImV4cCI6MTczMTQxNDkxMX0.QqQUfkTKyR44g6ZsbU-3I0EXgvWVgBqQ07bxWy75TjI