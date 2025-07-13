import { clientWithDelay } from '../core/clientWithDelay';
import type { AxiosInstance } from 'axios';

const WOERTER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
};

function create(): AxiosInstance {
  return clientWithDelay.create(WOERTER_HEADERS);
}

export const woerterClient = {
  create
};
