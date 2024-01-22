export const formatDate = (date) => {
  if (typeof date === "string") {
    if (date === undefined) return "date";

    const year = date.split("T")[0].replace('"', " ").split("-")[0];
    const month = date.split("T")[0].replace('"', " ").split("-")[1];
    const day = date.split("T")[0].replace('"', " ").split("-")[2];
    return `${day}/${month}/${year}`;
  } else if (typeof date === "object") {
    const getDate = new Date(date);
    const newDate = `${getDate.getDate()}/${getDate.getMonth()}/${getDate.getFullYear()}`;
    return newDate;
  } else {
    return `No date found`;
  }
};
export function getStartOfDay() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

// Function to get end of the day
export function getEndOfDay() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}
