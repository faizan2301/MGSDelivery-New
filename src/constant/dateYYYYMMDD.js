export const getTodaysDate = () =>{
    const today = new Date()

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1 and pad with '0' if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Pad day with '0' if necessary
    return `${year}-${month}-${day}`;
}


export const formatDate = (date) =>{
    return JSON.stringify(date)?.split("T")[0]?.replace('"',"").replace("\\","").replace('"',"");

}