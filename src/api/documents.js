import api from './client';

// Backend list/detail shapes may be { documents } or a bare array; handle both
export const docId = (d) => d.id ?? d._id;

export const listDocuments = async () => {
  const { data } = await api.get('/documents');
  return data.documents ?? data;
};

export const uploadFile = (file) => {
  const fd = new FormData();
  fd.append('file', file); // field name must match multer's upload.single('file')
  return api.post('/documents', fd);
};

export const getDocument = async (id) => {
  const { data } = await api.get(`/documents/${id}`);
  return data.document ?? data;
};

export const uploadText = (title, text) => api.post('/documents', { title, text });

export const deleteDocument = (id) => api.delete(`/documents/${id}`);