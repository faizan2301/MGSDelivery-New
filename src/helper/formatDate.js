
export const formatDate = (date) => {
  if (typeof (date) === "string") {
    

    if (date === undefined) return "date"
    const year = date.split("T")[0].replace('"', " ").split("-")[0]
    const month = date.split("T")[0].replace('"', " ").split("-")[1]
    const day = date.split("T")[0].replace('"', " ").split("-")[2]
    return `${day}/${month}/${year}`
  } else if (typeof (date) === "object") {
    const getDate = new Date(date)
    const newDate = `${getDate.getDate()}/${getDate.getMonth()}/${getDate.getFullYear()}`
    return newDate
  } else {
    return `No date found`
  }


}

