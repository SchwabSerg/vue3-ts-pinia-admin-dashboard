type EnvValue = string | undefined;

interface AppEnv {
  apiBaseUrl: string;
  appVersion: string;
}

const getEnvString = (value: EnvValue, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return fallback;
};

export const env: AppEnv = {
  apiBaseUrl: getEnvString(import.meta.env.VITE_API_BASE_URL, 'http://localhost:3000/api'),
  appVersion: getEnvString(import.meta.env.VITE_APP_VERSION, '1.0.0'),
};
