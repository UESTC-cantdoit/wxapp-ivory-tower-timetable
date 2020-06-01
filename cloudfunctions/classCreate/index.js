// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('class').add({
      data: {
        className: event.className,
        enableSearch: event.enableSearch,
        enableAnnouncement: event.enableAnnouncement,
        _openid: event.openid,
        classId: event.classId.toString(),
      }
    })
  } catch (e) {
    console.log(e)
  }
}