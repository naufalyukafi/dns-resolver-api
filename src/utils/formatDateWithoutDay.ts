const formatDateWithoutDayOfWeek = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export default formatDateWithoutDayOfWeek;
