import moment from 'moment';


    /**
     * checks that the data is logged from today
     * @param {Object} data 
     * 
     */
    export default function dataFilter(data) {
        let today = moment();
        return moment(today).isSame(data.date, 'day');
    }
    // /**
    //  * Returns true if the data.date is between today and seven days ago
    //  * @param {moment} today 
    //  * @param {Object} data 
    //  */
    // sevenDayFilter(today, data) {
    //     return moment(data.date).isBetween(today.subtract(7, 'days'), today, null, '[]');
    // }
