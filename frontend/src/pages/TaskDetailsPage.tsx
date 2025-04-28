import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.tsx';
import { ClipLoader } from 'react-spinners';
import {Task, Comment } from "../types/index.ts"
import api from "../services/api.ts"




const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        setLoading(true);
  
        const [taskRes, commentRes] = await Promise.all([
          api.get(`/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/comments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setTask(taskRes.data);
        setComments(commentRes.data);
      } catch (err: any) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
  
    if (token) fetchTaskAndComments();
  }, [id, token]);
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post(
        `/comments/${id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setNewComment('');
    } catch (err: any) {
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err: any) {
      alert('Failed to delete comment.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={30} color="#3b82f6" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!task) {
    return <p className="text-center">Task not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Task Details section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <p className="text-gray-700 mt-3">{task.description}</p>
        <p className="text-sm text-gray-500 mt-4">
          Status: <span className="font-bold capitalize">{task.status}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Created At: {new Date(task.createdAt).toLocaleString()}
        </p>
      </div>

      {/* my comments section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        {/* where i am adding comment */}
        <div className="flex flex-col">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            disabled={submitting}
            className="mt-3 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            {submitting ? (
      <ClipLoader size={30} color="#3b82f6" />
    ) : null}
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>

        {/* fetching Comments list */}
        {comments.length === 0 ? (
          <p className="text-gray-500 mt-6 text-center">No comments yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="p-4 border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
  <div className="text-sm font-semibold text-gray-700">
    {comment.createdBy?.name || user?.name || 'Unknown'}
 
</div>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
