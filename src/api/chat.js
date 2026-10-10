import api from './client';

export const getHistory = async (documentId) => {
  const { data } = await api.get(`/chat/${documentId}/history`);
  return data.messages ?? data.history ?? data;
};

export const askQuestion = async (documentId, question) => {
  const { data } = await api.post(`/chat/${documentId}`, { question });
  return data; // { answer, sources, messageId }
};