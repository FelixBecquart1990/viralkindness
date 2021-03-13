import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/vi'

var relativeTime = require('dayjs/plugin/relativeTime')
var localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.locale('en')
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

/** 
 * Returns a DD/MM/YYYY date
 * @param {string} date
 * @returns {string} DD/MM/YYYY date. Sample Output: "18/05/2020"
 * */
function ISOToDDMMYYYY(date){
  if(date){
    return dayjs(date).format('DD/MM/YYYY')
  }else{
    return ""
  }
}

/** 
 * Returns a duration from now
 * @param {string} date
 * @returns {string} Duration from now. Sample Output: "4 days ago"
 * */
function ISOToRelativeTime(date){
  if(date){
    return dayjs(date).fromNow()
  }else{
    return ""
  }
}

/** 
 * Returns a shortened date
 * @param {string} date
 * @returns {string} Shortened date. Sample Output: "16 Nov 2020"
 * */
function ISOToShortenedDate(date){
  if(date){
    return dayjs(date).format('ll')
  }else{
    return ""
  }
}

export { ISOToDDMMYYYY, ISOToRelativeTime, ISOToShortenedDate }