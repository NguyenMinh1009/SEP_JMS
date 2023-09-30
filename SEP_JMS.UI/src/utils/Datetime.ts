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
