// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-81f1c'
})
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  let coursesArr = [];

  await db.collection('courses')
  .aggregate()
  .match(db.command.or([
    {
      classId: event.classId,
      pre_id: db.command.exists(false)
    },
    {
      _openid: event._openid,
      classId: event.classId,
      pre_id: db.command.exists(true)
    }
  ]))
  .group({
    _id: null,
    courseId: db.command.aggregate.addToSet('$_id')
  })
  .end().then( res => {
    coursesArr =  res.list[0].courseId;
  })



  return await db.collection('events')
  .aggregate().lookup({
    from: 'courses',
    localField: 'course_id',
    foreignField: '_id',
    as: 'courseName',
  })
  .match(db.command.or([
    {
      course_classId: event.classId,
      pre_id: db.command.exists(false),
      course_id: db.command.in(coursesArr)
    },
    {
      _openid: event._openid,
      course_classId: event.classId,
      pre_id: db.command.exists(true)
    }
  ])
  )
  .sort({endDate: 1})
  .end()
}