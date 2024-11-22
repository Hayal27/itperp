const express = require('express');
const router = express.Router();
// const verifyToken = require('../middleware/verifyToken.js');
const { checkSessionExpiration } = require('../middleware/sessionMiddleware');
const { addUser, getAllRoles, getAllUsers, updateUser, deleteUser, getdepartment,changeStatus } = require('../controllers/userController.js');

// Define routes

router.post('/addUser', addUser);
// router.get('/roles', getAllRoles);
router.get('/users',  getAllUsers);
router.get('/department', getdepartment);

router.put('/:user_id/status', changeStatus);



router.put('/updateUser/:user_id', updateUser);
router.delete('/deleteUser/:user_id', deleteUser);

module.exports = router;


