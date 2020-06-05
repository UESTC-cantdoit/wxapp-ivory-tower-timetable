// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db
    .collection('class')
    .orderBy('classId','desc')
    .limit(1)
    .field({classId: true,})
    .get()
  } catch (e) {
    console.log(e)
  }
}