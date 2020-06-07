import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3ed87bc37fdd.ngrok.io'
});

export default api;