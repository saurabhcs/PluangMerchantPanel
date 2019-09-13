/*
 * created by akul on 2019-06-08
*/

module.exports = {
    dateFormatter: (dateString) => {
        if (!dateString) {
            return;
        }
        let dateObj = new Date(dateString);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return dateObj.getDate() + "-" + months[dateObj.getMonth()] + "-" +
            dateObj.getFullYear() + " " + dateObj.getHours().toString().padStart(2, 0) + ":" +
            dateObj.getMinutes().toString().padStart(2, 0) + ":" + dateObj.getSeconds().toString().padStart(2, 0);
    }
};
