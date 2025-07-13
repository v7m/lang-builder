import { AxiosInstance, AxiosError } from 'axios';
import { logger } from '@/services/logger';
import { baseClient } from './baseClient';
import type { Optional } from '@/types';

const MIN_DELAY_MS = 1200; // 1.2 seconds
const MAX_DELAY_MS = 2500; // 2.5 seconds
const RETRY_DELAY_MS = 3000; // 3 seconds

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  const ms = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
  logger.debug(`[clientWithDelay] Delaying request for ${ms}ms`, { indent: 1 });
  return delay(ms);
}

function create(
  headers: Record<string, string> = {},
  timeout: Optional<number> = baseClient.DEFAULT_TIMEOUT_MS
): AxiosInstance {
  const client = baseClient.create(headers, timeout);

  client.interceptors.request.use(async config => {
    await randomDelay();
    return config;
  });

  client.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url;

      logger.error(`[HTTP Error] ${status || 'No status'} for ${url}`, { indent: 1 });
      logger.error(`[Message] ${error.message}`, { indent: 1 });

      if (status === 429 || (status && status >= 500)) {
        logger.warn(`Retrying request to ${url} after ${RETRY_DELAY_MS}ms...`, { indent: 1 });
        await delay(RETRY_DELAY_MS);
        return client.request(error.config!);
      }

      return Promise.reject(error);
    }
  );

  return client;
}
export const clientWithDelay = {
  create
};
