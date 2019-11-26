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
