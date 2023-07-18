const {format} = require('timeago.js');


const helpers = {};
// Timestamp fecha de mysql ilegible
helpers.timeago = (Timestamp) => {
    // con formar se le cambia el formato
    return format(Timestamp);
};

module.exports = helpers;