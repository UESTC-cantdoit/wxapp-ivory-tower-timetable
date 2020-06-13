// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-81f1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  let eventConut = 0;
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


  await db.collection('events').where({
    course_classId: event.classId,
    pre_id: db.command.exists(false),
    course_id: db.command.in(coursesArr)
  }).get().then( res => {
    const today = new Date();
    let todayDate = today.getTime()-(today.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
    res.data.forEach( classEvent => {
      classEvent.endDate = new Date(classEvent.endDate);
      if (classEvent.endDate.getTime() >= todayDate) {
        eventConut++;
      }
    })
  })

  return eventConut;

}