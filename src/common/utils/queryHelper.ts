export type TimeFrames =
  | 'today'
  | 'last week'
  | 'last month'
  | 'last year'
  | 'all time';

export const getTimeFrameQuery = (
  timeFrame: TimeFrames,
  alias: string,
  field: string,
) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // format YYYY-MM-DD

  const formatDate = (date: Date): string =>
    date.toISOString().slice(0, 19).replace('T', ' '); // format YYYY-MM-DD HH:MM:SS

  switch (timeFrame) {
    case 'today': {
      const start = `${today} 00:00:00`;
      return `${alias}.${field} >= '${start}'`;
    }
    case 'last week': {
      const start = new Date(now);
      const startDate = setToMidnight(start);
      startDate.setDate(startDate.getDate() - 7);
      return `${alias}.${field} >= '${formatDate(startDate)}'`;
    }
    case 'last month': {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      ); // first day of last month
      return `${alias}.${field} >= '${formatDate(startDate)}'`;
    }
    case 'last year': {
      const startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate(),
      );
      return `${alias}.${field} >= '${formatDate(startDate)}'`;
    }
    default:
      return '1=1';
  }
};

const setToMidnight = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export const getAnyOf = (id: number, fieldName: string) => {
  return `(
            ${fieldName} LIKE CONCAT('[', ${id}, ',%')  OR
            ${fieldName} LIKE CONCAT('%,', ${id}, ',%') OR
            ${fieldName} LIKE CONCAT('%,', ${id}, ']') OR
            ${fieldName} = CONCAT('[', ${id}, ']')
        )`;
};
