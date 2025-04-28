const Comment = require('../models/Comment');
const Task = require('../models/Task');

exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    let comment = await Comment.create({
      task: taskId,
      text,
      createdBy: req.user._id,
    });

    comment = await comment.populate('createdBy', 'name email');

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};


exports.getComments = async (req, res) => {
  const { taskId } = req.params;

  try {
    const comments = await Comment.find({ task: taskId })
      .sort({ createdAt: -1 })
     .populate('createdBy', 'name email');
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

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
