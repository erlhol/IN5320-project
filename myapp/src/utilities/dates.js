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

function getMonth(monthNumber) {
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