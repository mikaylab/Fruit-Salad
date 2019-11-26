/**
 * Taken from: https://www.jacklmoore.com/notes/rounding-in-javascript/
 * @param {*} value 
 * @param {*} decimals 
 */
export default function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}