function formateDate(timestamp){
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // in 12hr formate --- 
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? String(hours).padStart(2, '0') : '12';

    // Format the date as dd/mm/yyyy hh:mm:ss (if we put ampm on seconds position then dd/mm/yyyy hh:mm:AM/PM)
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate
}

module.exports = {formateDate};