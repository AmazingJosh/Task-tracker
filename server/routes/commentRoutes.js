const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addComment,
  getComments,
  deleteComment,
} = require('../controllers/commentController');

// Protected routes
router.use(auth);

// Add comment to a task
router.post('/:taskId', addComment);

// Get comments for a task
router.get('/:taskId', getComments);

// Delete a comment
router.delete('/delete/:id', deleteComment);

module.exports = router;
