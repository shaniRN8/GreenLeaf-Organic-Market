const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('greenleaf_token');
export const setAuthToken = (token) => localStorage.setItem('greenleaf_token', token);
export const removeAuthToken = () => localStorage.removeItem('greenleaf_token');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed.');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
