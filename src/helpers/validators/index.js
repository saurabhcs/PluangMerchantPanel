/*
 * created by akul on 2019-06-08
*/
/* eslint max-len: 0 */
let Validators = {};

Validators.validateEmail = (email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
});

Validators.validatePassword = (password => password.length > 5);

Validators.validateDomain = (domain => {
    const re = /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/;
    return re.test(String(domain).toLowerCase());
});

Validators.validateUrl = (url => {
    const re = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
    return re.test(String(url));
});

Validators.validateDate = (date => {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(regEx)) return false;
    let d = new Date(date);
    let dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === date;
});

Validators.validatePhone = (phone => {
    if (phone.length < 8) {
        return false;
    }
    if (phone.length > 12) {
        return false;
    }
    return true;
});

export default Validators;
