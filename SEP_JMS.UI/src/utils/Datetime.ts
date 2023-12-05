export const dateToTicks = (date: Date) => {
  const ticksPerMillisecond = 10000;
  const epochTicks = 621355968000000000;
  const ticks = date.getTime() * ticksPerMillisecond + epochTicks;
  return ticks;
};

export const ticksToDate = (ticks: number) => {
  const ticksPerMillisecond = 10000;
  const epochTicks = 621355968000000000;
  const milliseconds = (ticks - epochTicks) / ticksPerMillisecond;
  return new Date(milliseconds);
};

export const getDefaultDeadline = (): Date => {
  const curr = new Date();
  curr.setDate(curr.getDate() + 7);
  return curr;
};

export const getDefaultFilterStart = (): Date => {
  const curr = new Date();
  curr.setMonth(curr.getMonth() - 1);
  return curr;
};

export const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
