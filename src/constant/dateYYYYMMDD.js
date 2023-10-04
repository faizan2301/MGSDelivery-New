export const getTodaysDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1 and pad with '0' if necessary
  const day = String(today.getDate()).padStart(2, "0"); // Pad day with '0' if necessary
  return `${year}-${month}-${day}`;
};

function formatDateINddmmyy(dateString) {
  const date = new Date(dateString);
  // Get the day, month, and year components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed
  const year = date.getFullYear() % 100; // Get the last two digits of the year
  // Pad single-digit day and month with leading zeros if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  // Combine the components into the desired format
  return `${formattedDay}/${formattedMonth}/${year}`;
}

export const formatDate = (date) => {
  return JSON.stringify(date)
    ?.split("T")[0]
    ?.replace('"', "")
    .replace("\\", "")
    .replace('"', "");
};
