const {Router} = require('express');
const controller  = require('./controller')
const router = Router();

router.get('/', controller.getEmployeeDetails);
router.post('/add-employee', controller.addEmployee);
router.get('/employee/:id', controller.getEmployeeById);
router.put('/:id', controller.updateEmployee)
router.delete('/:id',controller.removeEmployee);
router.post('/add-projects', controller.addProjectDetails)
router.get('/get-projects', controller.getProjectDetails);
router.get('/get-users', controller.getUserDetails);
//router.post('/login',controller.getUserDetails);

module.exports = router;