// planRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');  
const {getSubmittedreports, getSubmittedPlans, updatePlanStatus, getDetailedPlanForSupervisor,getSubmittedPlanssp,updatePlanApprovalStatus} = require("../controllers/planAproveController");
const { addPlan} = require("../controllers/planController");
const {getAllPlansDeclined,getApprovedOrgPlans, getPlanDetail,getAllOrgPlans,getPlanById,getAllPlans, deletePlan, updatePlan,addReport } = require("../controllers/plansFetch");
// const {getSubmittedPlans, updatePlanStatus, getDetailedPlanForSupervisor,getSubmittedPlanssp,updatePlanApprovalStatus} = require("../controllers/planAproveController");
const {getGoals,getGoalById,getObjectiveById,getObjectivesByGoals,getspesificObjectivesByGoals,getGoal, getPlansBySpecificGoal} = require("../controllers/planDetailFetchController");
const {getProfilePic,getSpecificGoal,getSpesificObjectives,getdepartment,getUserRoles} = require("../controllers/planget");
const { addGoals, addObjectives, addSpecificObjectives, addspecificObjectiveDetails} =require("../controllers/planDtailedController")

// profile pic
const { getProfilePicture,uploadProfilePicture} =require("../controllers/profileUploadController")

router.get("/getplan", verifyToken, getAllPlans); // GET /api/plan
router.get("/plandeclined", verifyToken, getAllPlansDeclined); // GET /api/plan
router.get("/planorg", verifyToken, getAllOrgPlans);
router.delete("/plandelete/:planId",verifyToken, deletePlan); // DELETE /api/plan/:planId
router.put("/planupdate/:planId",verifyToken, updatePlan); // PUT /api/plan/:planId
router.put("/addReport/:planId",verifyToken, addReport); // PUT /api/plan/:planId

router.get("/planget/:planId", verifyToken, getPlanById);
router.get("/pland/:id", verifyToken, getPlanDetail);
router.get("/planorgd/:id", getApprovedOrgPlans);

// Route to add a new plan
router.post('/addplan', verifyToken, addPlan);
// Route to fetch submitted plans for approval
router.get("/supervisor/plans", verifyToken, getSubmittedPlans);
router.get("/supervisor/planssp", verifyToken, getSubmittedPlanssp);
// Route to approve or decline a plan
router.put("/supervisor/plans/approve", verifyToken, updatePlanStatus);
router.put("/supervisor/plans/approveceo", verifyToken, updatePlanApprovalStatus);
// Route to fetch detailed plan information for the next supervisor (GET)
router.get("/supervisor/plans/detailed", verifyToken, getDetailedPlanForSupervisor);
// adding plan routes 

router.post("/addgoal", verifyToken, addGoals);
router.post("/addobjective", verifyToken, addObjectives);
router.post("/addSpecificObjective", verifyToken, addSpecificObjectives);
router.post("/addspecificObjectiveDetail", verifyToken, addspecificObjectiveDetails);





// router.post("/specific_goals", verifyToken, addSpecificGoal);

router.get('/goalsg', verifyToken, getGoals);
router.get('/objectivesg', verifyToken,getObjectivesByGoals);
router.get('/spesificObjectivesg', verifyToken,getspesificObjectivesByGoals);


router.get('/objectivesbyid/:objective_id',verifyToken, getObjectiveById);
router.get('/goalsbyid/:goal_id', verifyToken, getGoalById);

router.get("/specificGoals/:sgoalId",verifyToken, getSpecificGoal);
router.get("/getSpesificObjectives",verifyToken, getSpesificObjectives);
router.get("/getdepartment",verifyToken, getdepartment);
router.get ('/userrole', verifyToken, getUserRoles);

router.get ('/submitted_reports', verifyToken,getSubmittedreports)





// profile pic 
router.post('/uploadProfilePicture', verifyToken,uploadProfilePicture);
router.get("/getprofile/:user_id",verifyToken, getProfilePicture); // API endpoint





module.exports = router;
