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

export function getYearMonth(date) {
  const tempdate = new Date(date);
  return (
    tempdate.getFullYear().toString() +
    (tempdate.getMonth() + 1).toString().padStart(2, "0")
  );
}
export function getNumberOfCurrentMonth() {
  const date = new Date();
  return date.getMonth(); // to be consitant with starting at 1
}

export function getMonthAbbrivation() {
  return months.slice(1, month.length).map(month => month.slice(0, 3));
}

export function getStockHistoryDefaultPeriod(transactions) {
  const oldestDate = new Date(transactions[transactions.length - 1].date);
  const start = `${(oldestDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${oldestDate.getDay()}/${oldestDate.getFullYear()}`;
  const end = `${month.toString().padStart(2, "0")}/${date.getDate()}/${year}`;
  return [start, end];
}

export function getDateAndTime(dateTime) {
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = dateTime.getDate().toString().padStart(2, "0");
  const year = dateTime.getFullYear().toString();
  const date = `${month}/${day}/${year}`; // Format: "11/7/2023"
  const time = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return { date, time };
}

export function getCurrentMonthName() {
  return months[getNumberOfCurrentMonth() + 1];
}
