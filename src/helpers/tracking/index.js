/*
 * created by akul on 2019-06-08
*/

module.exports = {
    trackPage: (page) => {
        if (window.ga) {
            window.ga('send', 'pageview', page);
        }
    }
};
