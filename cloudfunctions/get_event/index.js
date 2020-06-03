// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-81f1c'
})
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  return await db.collection('events')
    .aggregate().lookup({
      from: 'courses',
      localField: 'course_classId',
      foreignField: 'classId',
      as: 'courseName',
    })
    .end().where(db.command.or([
      {
        _openid: event._openid
      },
      {
        course_classId: event.course_classId
      }
    ])
    )
    .orderBy('endDate', 'asc').get()
  // const list = [];
  // await db.collection('events')
  // .where(db.command.or([
  //   {
  //     _openid: event._openid
  //   },
  //   {
  //     course_classId:  event.course_classId
  //   }
  // ])
  // )
  // .orderBy('endDate', 'asc')
  // .get().then(res => {
  //   for(let i=0;i<res.data.length;i++){
  //     var thisevent = res.data[i];
  //     thisevent.eventBindCourse  = '';
  //     console.log('thisevent'.thisevent)
  //       //查询云数据库 courses 集合
  //     let per1 = db.collection('courses')
  //     .where({
  //       _id: thisevent.course_classId
  //     })
  //     .field({courseName: true})
  //     .get().then(res => {
  //       thisevent.eventBindCourse = res.data[0].courseName;
  //       return thisevent;
  //     })
      
  //     list.push(per1)
  //   }
  // })

  // return (await Promise.all(list))
}