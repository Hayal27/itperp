// employeeController.js
// importing db connection
const con = require("../models/db");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const util = require("util");
// Function to add a new employee and create a corresponding user

const addEmployee = async (req, res) => {
    const { 
        name, role_id, department_id, supervisor_id, fname, lname, email, phone, sex 
    } = req.body;
  
    try {
        // Promisify the query method for easier async handling
        const query = util.promisify(con.query).bind(con);
  
        // Insert the new employee into the Employees table
        const employeeResult = await query(
            'INSERT INTO Employees (name, role_id, department_id, supervisor_id, fname, lname, email, phone, sex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, role_id, department_id || null, supervisor_id || null, fname, lname, email, phone, sex]
        );
  
        // Check if the employee insertion was successful
        if (!employeeResult || !employeeResult.insertId) {
            console.error("Employee insertion failed.");
            return res.status(500).json({ message: "Failed to insert employee data into the database." });
        }
  
        // Get the employee ID of the newly created employee
        const employee_id = employeeResult.insertId;
  
        // Set up default username and password for the new user
        const defaultUsername = email; // Username set as employee's email
        const defaultPassword = 'itp@123'; // Default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash the password for security
  
        // Insert the user data into the Users table with role_id included
        const userResult = await query(
            'INSERT INTO users (employee_id, user_name, password, role_id) VALUES (?, ?, ?, ?)',
            [employee_id, defaultUsername, hashedPassword, role_id]
        );
  
        // Check if the user insertion was successful
        if (!userResult || !userResult.insertId) {
            console.error("User account creation failed.");
            return res.status(500).json({ message: "Failed to create user account for employee." });
        }
  
        // Respond with success message and employee ID
        res.json({ employee_id, message: 'Employee and user created successfully.' });
    } catch (error) {
        console.error("Error registering employee and user:", error);
        res.status(500).json({ message: "Failed to register employee and create user." });
    }
  };


// Function to fetch all departments
const getAllDepartments = (req, res) => {
    con.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return res.status(500).json({ message: 'Error fetching departments' });
        }
        res.json(results);
    });
};

// Function to fetch all roles
const getAllRoles = (req, res) => {
    con.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error('Error fetching roles:', err);
            return res.status(500).json({ message: 'Error fetching roles' });
        }
        res.json(results); // Send role_name and role_name to the frontend
    });
};

// Function to fetch all supervisors
const getAllSupervisors = (req, res) => {
    con.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            console.error('Error fetching supervisors:', err);
            return res.status(500).json({ message: 'Error fetching supervisors' });
        }
        res.json(results);
    });
};

// Function to fetch all employees with detailed information
const getAllEmployees = (req, res) => {
    const query = `
        SELECT
            e.*,
            r.role_name,
            d.name as department_name,
            supervisor.fname as supervisor_fname,
            supervisor.lname as supervisor_lname,
            u.status as user_status,
            u.created_at as user_created_at
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.role_id
        LEFT JOIN departments d ON e.department_id = d.department_id
        LEFT JOIN employees supervisor ON e.supervisor_id = supervisor.employee_id
        LEFT JOIN users u ON e.employee_id = u.employee_id
        ORDER BY e.employee_id DESC
    `;

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ message: 'Error fetching employees' });
        }
        res.json(results);
    });
};

// Function to get employee statistics for dashboard
const getEmployeeStatistics = async (req, res) => {
    try {
        const query = util.promisify(con.query).bind(con);

        // Get total employees
        const totalEmployeesResult = await query('SELECT COUNT(*) as total FROM employees');
        const totalEmployees = totalEmployeesResult[0].total;

        // Get active users (employees with active user accounts)
        const activeUsersResult = await query(`
            SELECT COUNT(*) as active
            FROM employees e
            INNER JOIN users u ON e.employee_id = u.employee_id
            WHERE u.status = '1'
        `);
        const activeUsers = activeUsersResult[0].active;

        // Get employees by department
        const departmentStatsResult = await query(`
            SELECT
                d.name as department_name,
                COUNT(e.employee_id) as employee_count
            FROM departments d
            LEFT JOIN employees e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.name
            ORDER BY employee_count DESC
        `);

        // Get employees by role
        const roleStatsResult = await query(`
            SELECT
                r.role_name,
                COUNT(e.employee_id) as employee_count
            FROM roles r
            LEFT JOIN employees e ON r.role_id = e.role_id
            GROUP BY r.role_id, r.role_name
            ORDER BY employee_count DESC
        `);

        // Get recent registrations (last 30 days)
        const recentRegistrationsResult = await query(`
            SELECT COUNT(*) as recent
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);
        const recentRegistrations = recentRegistrationsResult[0].recent;

        // Get gender distribution
        const genderStatsResult = await query(`
            SELECT
                sex,
                COUNT(*) as count
            FROM employees
            WHERE sex IS NOT NULL
            GROUP BY sex
        `);

        res.json({
            totalEmployees,
            activeUsers,
            inactiveUsers: totalEmployees - activeUsers,
            recentRegistrations,
            departmentStats: departmentStatsResult,
            roleStats: roleStatsResult,
            genderStats: genderStatsResult
        });

    } catch (error) {
        console.error('Error fetching employee statistics:', error);
        res.status(500).json({ message: 'Error fetching employee statistics' });
    }
};

// Function to get recent employee activities
const getRecentActivities = async (req, res) => {
    try {
        const query = util.promisify(con.query).bind(con);

        const recentActivitiesResult = await query(`
            SELECT
                e.fname,
                e.lname,
                e.email,
                u.created_at,
                u.status,
                'registration' as activity_type
            FROM employees e
            INNER JOIN users u ON e.employee_id = u.employee_id
            ORDER BY u.created_at DESC
            LIMIT 10
        `);

        res.json(recentActivitiesResult);

    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ message: 'Error fetching recent activities' });
    }
};

// Function to update employee information
const updateEmployee = async (req, res) => {
    const { employee_id } = req.params;
    const { name, role_id, department_id, supervisor_id, fname, lname, email, phone, sex } = req.body;

    try {
        const query = util.promisify(con.query).bind(con);

        const updateResult = await query(
            'UPDATE employees SET name = ?, role_id = ?, department_id = ?, supervisor_id = ?, fname = ?, lname = ?, email = ?, phone = ?, sex = ? WHERE employee_id = ?',
            [name, role_id, department_id || null, supervisor_id || null, fname, lname, email, phone, sex, employee_id]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully' });

    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Error updating employee' });
    }
};

// Function to delete employee
const deleteEmployee = async (req, res) => {
    const { employee_id } = req.params;

    try {
        const query = util.promisify(con.query).bind(con);

        // First delete the user account
        await query('DELETE FROM users WHERE employee_id = ?', [employee_id]);

        // Then delete the employee
        const deleteResult = await query('DELETE FROM employees WHERE employee_id = ?', [employee_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Error deleting employee' });
    }
};

// Exporting the functions for use in routes
module.exports = {
    getAllDepartments,
    getAllRoles,
    getAllSupervisors,
    addEmployee,
    getAllEmployees,
    getEmployeeStatistics,
    getRecentActivities,
    updateEmployee,
    deleteEmployee
};
