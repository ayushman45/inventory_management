export const getLocaleDate = (dateStr) =>{
    let date = new Date(dateStr);
    return date.toLocaleDateString();

}

export const getISODateString = (localeDateStr) => {
    let date = new Date(localeDateStr);
    return date.toISOString().slice(0,10);

}