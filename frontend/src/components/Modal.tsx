import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../redux/slices/taskSlice.ts';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { RootState } from '../redux/store.tsx';

interface ModalProps {
  task: any;
  handleClose: () => void;
  token: string | null;
  refreshTasks: any;
}

const Modal: React.FC<ModalProps> = ({ task, handleClose, token, refreshTasks }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'pending');

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'pending');
  }, [task]);

  const fetchTasksAgain = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(refreshTasks(res.data.tasks || []));
    } catch (error) {
      console.error('Failed to refresh tasks');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) {
      toast.error('Token missing. Please log in again.');
      return;
    }

    try {
      if (task) {
        await axios.put(
          `http://localhost:8000/api/tasks/${task._id}`,
          { title, description, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Task updated successfully!');
      } else {
        await axios.post(
          'http://localhost:8000/api/tasks/create',
          { title, description, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Task created successfully!');
      }
      fetchTasksAgain();
      handleClose();
    } catch (error) {
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Modal;
