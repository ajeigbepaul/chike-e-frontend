import api from '../api';

export interface Advert {
  _id?: string;
  image: string;
  title: string;
  subTitle: string;
  description: string;
  cta?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllAdverts = async () => {
  const res = await api.get('/adverts');
  return res.data;
};

export const getAdvertById = async (id: string) => {
  const res = await api.get(`/adverts/${id}`);
  return res.data;
};

export const createAdvert = async (formData: FormData) => {
  const res = await api.post('/adverts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateAdvert = async (id: string, formData: FormData) => {
  const res = await api.put(`/adverts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteAdvert = async (id: string) => {
  const res = await api.delete(`/adverts/${id}`);
  return res.data;
};

const advertService = {
  getAllAdverts,
  getAdvertById,
  createAdvert,
  updateAdvert,
  deleteAdvert,
};

export default advertService; 