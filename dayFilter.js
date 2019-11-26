import moment from 'moment';
/**
     * checks that the data is logged from today
     * @param {Object} data 
     * @param {moment} today
     */
export default function dataFilter(today, data) {
    return moment(today).isSame(data.date, 'day');
}