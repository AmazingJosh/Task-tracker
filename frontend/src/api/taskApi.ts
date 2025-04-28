import axios from 'axios';

export const fetchTasksFromAPI = async (token: string) => {
  const res = await axios.get('http://localhost:8000/api/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.tasks; 
};
