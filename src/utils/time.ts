export const toSeconds = function (
  minutes: number = 0,
  hours: number = 0,
  days: number = 0,
  weeks: number = 0
): number {
  let week = weeks * 7 * 24 * 60 * 60;
  let day = days * 24 * 60 * 60;
  let hour = hours * 60 * 60;
  let minute = minutes * 60;
  return week + day + hour + minute;
};
