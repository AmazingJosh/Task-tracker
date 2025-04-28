import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../components/Modal.tsx';
import { setTasks } from '../redux/slices/taskSlice.ts';
import { RootState } from '../redux/store.tsx';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader"; 
import api from "../services/api.ts"

const TaskListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const token = useSelector((state: RootState) => state.auth.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false); // Added loading state

  const fetchTasks = async (page = 1, status = 'all') => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get(`/tasks?page=${page}&status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setTasks(res.data.tasks || []));
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, statusFilter);
  }, [token, currentPage, statusFilter]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      fetchTasks(currentPage, statusFilter);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    fetchTasks(currentPage, statusFilter);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1, statusFilter);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchTasks(currentPage - 1, statusFilter);
    }
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-center md:text-left">Task List</h1>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add New Task
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Modal
            task={selectedTask}
            handleClose={handleCloseModal}
            token={token}
            refreshTasks={setTasks}
          />
        )}

        {/* Spinner */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <ClipLoader size={50} color="#3B82F6" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <button
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="text-blue-500 hover:underline text-sm font-medium"
                    >
                      View →
                    </button>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No task created yet.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-6 space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm text-center md:text-left">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex space-x-2 justify-center md:justify-end">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default TaskListPage;
