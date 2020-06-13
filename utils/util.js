function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkSelectTime(newItem, items) { // 判断选择的上课时间是否彼此冲突
  const weekDay = newItem.weekDay;
  const startTime = newItem.startTime;
  const endTime = newItem.endTime;
  for (let index=0; index<items.length; index++) {
    if (weekDay == items[index].weekDay) { // 添加的时间与已添加时间在同一天时
      if (endTime < items[index].startTime || startTime > items[index].endTime) {
        continue;
      } else {
        return false;
      }
    }
  }
  return true;
}

const db = wx.cloud.database();

function checkSelectTimeCloud( newItem ) {
  const weekDay = newItem.weekDay;
  const startTime = newItem.startTime;
  const endTime = newItem.endTime;
  const _ = db.command;

  db.collection('courses').where({
    _openid: getApp().globalData.userInfo.openid,
  }).where({
    courseTime: 
      _.elemMatch({
        startTime: _.lte(startTime),
        endTime:  _.gte(endTime),
        weekDay: _.eq(weekDay),
      })
  }).count().then( res => {
    if (res.total == 0) {
      return true;
    }else {
      return false;
    }
  })
}


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  checkSelectTime: checkSelectTime,
  checkSelectTimeCloud: checkSelectTimeCloud,
}
