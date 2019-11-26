import moment from 'moment';
/**
 * Returns true if the data.date is between today and seven days ago
 * @param {Object} data
 */
export default function sevenDayFilter(data) {
    return moment(data.date).isBetween(moment().subtract(7, 'days'), moment(), null, '[]');
}