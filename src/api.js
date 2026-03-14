import axios from 'axios';

const API_BASE = 'https://ai-assisted-journal-system-dp4w.onrender.com/api';
// const API_BASE = 'http://localhost:5000/api';

export const createEntry = (data) =>
  axios.post(`${API_BASE}/journal`, data).then((r) => r.data);

export const getEntries = (userId) =>
  axios.get(`${API_BASE}/journal/${userId}`).then((r) => r.data);

export const analyzeText = (text, entryId) =>
  axios
    .post(`${API_BASE}/journal/analyze`, { text, entryId })
    .then((r) => r.data);

export const getInsights = (userId) =>
  axios.get(`${API_BASE}/journal/insights/${userId}`).then((r) => r.data);
