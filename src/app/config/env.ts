type EnvValue = string | undefined;

interface AppEnv {
  apiBaseUrl: string;
  appVersion: string;
}

export const isDev: boolean = import.meta.env.DEV;

const rawApiBaseUrl: EnvValue = import.meta.env.VITE_API_BASE_URL;

if (typeof rawApiBaseUrl !== 'string' || rawApiBaseUrl.trim().length === 0) {
  console.warn('VITE_API_BASE_URL is not set. Falling back to default API URL.');
}

const getEnvString = (value: EnvValue, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return fallback;
};

export const env: AppEnv = {
  apiBaseUrl: getEnvString(rawApiBaseUrl, 'http://localhost:3000/api'),
  appVersion: getEnvString(import.meta.env.VITE_APP_VERSION, '1.0.0'),
};
