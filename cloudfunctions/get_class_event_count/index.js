// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-81f1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let coursesArr = [];

  await db.collection('courses')
  .aggregate()
  .match({
      // 自己创建的同步课程
      _openid: event._openid,
      classId: event.classId,
      pre_id: db.command.exists(false)
  })
  .group({
    _id: null,
    courseId: db.command.aggregate.addToSet('$_id')
  })
  .end().then( res => {
    if ( res.list.length != 0 ) {
      coursesArr =  res.list[0].courseId;
    }
  })

  await db.collection('courses')
  .aggregate()
  .match({
      // 从他人同步的课程
      _openid: event._openid,
      classId: event.classId,
      pre_id: db.command.exists(true)
  })
  .group({
    _id: null,
    courseId: db.command.aggregate.addToSet('$pre_id')
  })
  .end().then( res => {
    if ( res.list.length != 0 ) {
      coursesArr =  coursesArr.concat(res.list[0].courseId);
    }
  })

  let today = new Date();
  let todayDate = today.getTime()-(today.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
  today = new Date(todayDate);

  return await db.collection('events').where({
    course_classId: event.classId,
    pre_id: db.command.exists(false),
    course_id: db.command.in(coursesArr),
    endDate: db.command.gte(today),
  }).count()

}