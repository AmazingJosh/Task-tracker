const Task = require('../models/Task');

// Create new task
exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
      status
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get all tasks (with filters + pagination)
exports.getTasks = async (req, res) => {
  const { status, page = 1 } = req.query;
  const limit = 5;
  const skip = (page - 1) * limit;

  const query = { createdBy: req.user._id };
  if (status && ['pending', 'completed'].includes(status)) {
    query.status = status;
  }

  try {
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findOne({ _id: id, createdBy: req.user._id });
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
  };

  exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body; // ✅ destructure from req.body
  
    try {
      const task = await Task.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        { title, description, status }, // ✅ these now exist
        { new: true, runValidators: true }
      );
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found or not yours' });
      }
  
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Error updating task', error: err.message });
    }
  };
  

  exports.deleteTask = async (req, res) => {
    const { id } = req.params; // <-- Add this
    try {
      const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user._id });
      if (!task) return res.status(404).json({ message: 'Task not found or not yours' });
  
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
  };
  
     
