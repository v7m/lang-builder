import axios, { AxiosInstance } from 'axios';
import { logger } from '@/services/logger';
import type { Optional } from '@/types';

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
};

function create(
  headers: Record<string, string> = {}, 
  timeout: Optional<number> = DEFAULT_TIMEOUT_MS
): AxiosInstance {
  const client = axios.create({
    timeout,
    headers: { ...BASE_HEADERS, ...headers }
  });

  client.interceptors.response.use(
    res => res,
    err => {
      logger.error('[HTTP Error]', err?.response?.status, err?.message);
      return Promise.reject(err);
    }
  );

  return client;
}

export const baseClient = {
  create,
  DEFAULT_TIMEOUT_MS
};