import { differenceInDays, parseISO } from 'date-fns';

export const calculateDays = (startDate) => {
  if (!startDate) return 0;
  const today = new Date();
  const start = parseISO(startDate);
  return differenceInDays(today, start);
};
