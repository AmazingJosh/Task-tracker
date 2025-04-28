const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
   updateTask,
   deleteTask,
   getTaskById,
} = require('../controllers/taskController');

// All routes are protected
router.use(auth);

// GET /api/tasks
router.get('/', getTasks);
router.post('/create', createTask);
router.get('/:id', getTaskById);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);


module.exports = router;
