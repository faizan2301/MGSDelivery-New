export const formatDate = (date) => {
  return (
    new Date(date).toLocaleDateString() +
    " " +
    new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );
};
export function getDateBeforeT(dateString) {
  const indexOfT = dateString.indexOf("T");
  if (indexOfT !== -1) {
    return dateString.substring(0, indexOfT);
  } else {
    // If 'T' is not found, return the original string
    return dateString;
  }
}

// Example usage:
const inputString = "2023-09-30T00:00:00.000Z";
const result = getDateBeforeT(inputString);
console.log(result); // Output: "2023-09-30"
