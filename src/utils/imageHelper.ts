import { api } from '../core/api/apiClient';

export function formatAvatarUrl(url?: string) {
  if (!url) return null;

  const ngrokBase = api.defaults.baseURL?.replace('/api/v1', '') || '';

  if (url.includes('localhost:3000')) {
    return url.replace('http://localhost:3000', ngrokBase);
  }

  return url;
}