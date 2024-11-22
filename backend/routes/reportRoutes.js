// reportsRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');  
// const {getSubmittedreports, updatereportstatus, getDetailedreportsForSupervisor,getSubmittedreportssp,updatereportsApprovalStatus} = require("../controllers/reportsAproveController");
const { addReport,getApprovedPlans} = require("../controllers/reportController");

// Route to add a new reports
router.post('/reports', verifyToken, addReport);
router.get('/reports/approved', getApprovedPlans);

// // Route to fetch submitted reports for approval
// router.get("/supervisor/reports", verifyToken, getSubmittedreports);
// router.get("/supervisor/reportssp", verifyToken, getSubmittedreportssp);

// // Route to approve or decline a reports
// router.put("/supervisor/reports/approve", verifyToken, updatereportstatus);

// router.put("/supervisor/reports/approvesp", verifyToken, updatereportsApprovalStatus);
// // Route to fetch detailed reports information for the next supervisor (GET)
// router.get("/supervisor/reports/detailed", verifyToken, getDetailedreportsForSupervisor);

module.exports = router;
