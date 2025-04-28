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

router.post('/:taskId', addComment);

router.get('/:taskId', getComments);

router.delete('/delete/:id', deleteComment);

module.exports = router;
