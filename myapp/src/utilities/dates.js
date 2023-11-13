/* A file for handling dates and getting the current month and date */

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonth(monthNumber) {
  return months[monthNumber];
}

const date = new Date();
const periods = [];
const year = date.getFullYear();
const month = date.getMonth() + 1; // to be consitant with starting at 1

for (let month = 1; month <= 12; month++) {
  const formattedMonth = [
    getMonth(month),
    `${year}${month.toString().padStart(2, "0")}`,
  ];
  periods.push(formattedMonth);
}

export function getPeriods() {
  return periods;
}

export function getCurrentMonth() {
  return year.toString() + month.toString().padStart(2, "0");
}

export function getMonthAbbrivation() {
  return months.slice(1, month.length).map(month => month.slice(0, 3));
}

export function getStockHistoryDefaultPeriod() {
  const currentMonth = month.toString().padStart(2, "0");
  const nextMonthNr = month === 12 ? 1 : month + 1;
  const start = `${currentMonth}/01/${year.toString()}`;
  const end = `${nextMonthNr
    .toString()
    .padStart(2, "0")}/01/${year.toString()}`;
  return { start, end };
}
export function getNumberOfCurrentMonth() {
  const date = new Date();
  return date.getMonth(); // to be consitant with starting at 1
}
