import axios from 'axios';

import { logger } from '@/services/logger';

const TIMEOUT_MS = 10000; // 10 seconds
const HEADERS = {
  'User-Agent': 'Mozilla/5.0',
};

export const httpClient = axios.create({
  timeout: TIMEOUT_MS,
  headers: HEADERS,
});

httpClient.interceptors.response.use(
  res => res,
  err => {
    logger.error('[HTTP Error]', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
