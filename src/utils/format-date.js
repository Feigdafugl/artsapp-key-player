/**
 * Format date
 *
 * @param {string} date Timestamp
 * @param {boolean} dateOnly True if date only (no hours/mins)
 * @returns {string} Formatted date/time string
 */
const formatDate = (date, dateOnly) => {
    const localDate = new Date(date);
    let day = localDate.getDate();
    let month = localDate.getMonth() + 1;
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    if (dateOnly) return `${localDate.getFullYear()}-${month}-${day}`;
    let hours = localDate.getHours();
    let mins = localDate.getMinutes();
    if (hours < 10) hours = `0${hours}`;
    if (mins < 10) mins = `0${mins}`;
    return `${localDate.getFullYear()}-${month}-${day} ${hours}:${mins}`;
};

export default formatDate;
