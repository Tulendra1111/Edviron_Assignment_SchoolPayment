import axios from 'axios';
import { Base_url } from '../constants';

export const login = async (credentials) => {
  const response = await axios.post(`${Base_url}/api/auth/login`, credentials);
  return response.data.token;
};

export const signup = async (credentials) => {
  await axios.post(`${Base_url}/api/auth/signup`, credentials);
};

