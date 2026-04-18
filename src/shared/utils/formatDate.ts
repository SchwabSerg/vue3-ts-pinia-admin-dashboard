import { format, formatDistanceToNow } from 'date-fns';

const toDate = (value: string | Date): Date => (value instanceof Date ? value : new Date(value));

export const formatDate = (date: string | Date): string => format(toDate(date), 'dd MMM yyyy');

export const formatDateTime = (date: string | Date): string =>
  format(toDate(date), 'dd MMM yyyy, HH:mm');

export const formatRelative = (date: string | Date): string =>
  formatDistanceToNow(toDate(date), { addSuffix: true });
