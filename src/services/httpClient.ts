import axios from 'axios';
import { logger } from './logger';

export const httpClient = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
});

httpClient.interceptors.response.use(
  res => res,
  err => {
    logger.error('[HTTP Error]', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
