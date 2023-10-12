import { differenceInYears, differenceInMonths, differenceInDays, parseISO } from 'date-fns';

export const calculateAge = (birthDate) => {
  const birthdate = parseISO(birthDate);
  const years = differenceInYears(new Date(), birthdate);
  const months = differenceInMonths(new Date(), birthdate) % 12;
  const days = differenceInDays(new Date(), birthdate) % 30; // Approximation
  return `${years} m. ${months} mėn. ${days} d.`;
};
