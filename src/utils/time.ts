export const toSeconds = function (
  minutes = 0,
  hours = 0,
  days = 0,
  weeks = 0
): number {
  const week = weeks * 7 * 24 * 60 * 60;
  const day = days * 24 * 60 * 60;
  const hour = hours * 60 * 60;
  const minute = minutes * 60;
  return week + day + hour + minute;
};

export const asyncTimeOut = (
  funct: () => any,
  delay: number
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      funct();
      resolve();
    }, delay);
  });
};
