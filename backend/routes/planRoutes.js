// planRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');  
const {getSubmittedPlans, updatePlanStatus, getDetailedPlanForSupervisor,getSubmittedPlanssp,updatePlanApprovalStatus} = require("../controllers/planAproveController");
const { addPlan} = require("../controllers/planController");

// Route to add a new plan
router.post('/plans', verifyToken, addPlan);

// Route to fetch submitted plans for approval
router.get("/supervisor/plans", verifyToken, getSubmittedPlans);
router.get("/supervisor/planssp", verifyToken, getSubmittedPlanssp);

// Route to approve or decline a plan
router.put("/supervisor/plans/approve", verifyToken, updatePlanStatus);

router.put("/supervisor/plans/approvesp", verifyToken, updatePlanApprovalStatus);
// Route to fetch detailed plan information for the next supervisor (GET)
router.get("/supervisor/plans/detailed", verifyToken, getDetailedPlanForSupervisor);

module.exports = router;
