const Comment = require('../models/Comment');
const Task = require('../models/Task');

// Add comment to a task
exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    const comment = await Comment.create({
      task: taskId,
      text,
      createdBy: req.user._id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// Get comments for a task
exports.getComments = async (req, res) => {
  const { taskId } = req.params;

  try {
    const comments = await Comment.find({ task: taskId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};




// Delete a comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findOne({ _id: id, createdBy: req.user._id });
    if (!comment) return res.status(404).json({ message: 'Comment not found or not yours' });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
