export const isValidationErrors = (value: unknown): value is Record<string, string[]> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Object.values(value).every((entry: unknown): boolean => {
    if (!Array.isArray(entry)) {
      return false;
    }

    return entry.every((item: unknown): boolean => typeof item === 'string');
  });
};
