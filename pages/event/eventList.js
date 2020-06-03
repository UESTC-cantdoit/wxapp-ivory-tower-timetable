// pages/event/eventList.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteInfo: "嘿，还没有来自其他人的同步日程哦",
    noteInfoDisplay: false,
    event: [ // 仅获取已选择课程的相关日程；应按照截止时间从早到晚排序
      {
        eventId: '22314',
        eventTitle: '这是一个事件',
        eventBindCourse: '数据库原理及运用',
        eventStatus: '已完成',
        eventEndDate: '2020-05-31',
        eventDescription: '利用 Powerdesigner 完成数据库建模作业',
        eventSync: true,
        eventStar: false
      },
      {
        eventId: '22315',
        eventTitle: '这是另一个事件',
        eventBindCourse: '微积分',
        eventStatus: '进行中',
        eventEndDate: '2020-06-12',
        eventDescription: '在 MOOC 提交作业',
        eventSync: false,
        eventStar: true
      },
      {
        eventId: '22316',
        eventTitle: '这是又另一个事件',
        eventBindCourse: '达芬奇',
        eventStatus: '已结束',
        eventEndDate: '2020-04-23',
        eventDescription: '是一个艺术家',
        eventSync: true,
        eventStar: true
      }
    ]
  },

  switchNoteInfo() {
    if (this.data.noteInfoDisplay) {
      this.setData({
        noteInfo: '嘿，还没有来自其他人的同步日程哦',
        noteInfoDisplay: false
      });
    } else {
      this.setData({
        noteInfo: '仅显示已选公用课程且尚未结束的同步日程',
        noteInfoDisplay: true
      });
    }
  },

  createEvent() {
    wx.navigateTo({
      url: 'eventCreate'
    })
  },

  addToEvent(e) {
    console.log(e);
    const eventId = e.currentTarget.dataset.eventid;
    // to do: 将目标日程添加到日程中
    let index = this.data.event.findIndex(function(event){
      return event.eventId == eventId;
    })
    console
    db.collection('events').add({
      data: {
        eventName: this.data.event[index].eventTitle,
        eventDescription: this.data.event[index].eventDescription,
        endDate: this.data.event[index].eventOriEndDate,
        course_id: this.data.event[index].eventCourseId,
        course_classId: this.data.event[index].eventClassId,
        pre_id: eventId,
      }
    })
    this.setData({
      [`event[${index}].inEvent`]: true
    })
    
  },

  removeFromEvent(e) {
    console.log(e);
    const eventId = e.currentTarget.dataset.eventid;
    // to do: 将目标日程从日程中移除
    try {
      db.collection('events').where({
        _openid: getApp().globalData.userInfo.openid,
        pre_id: eventId
      }).remove()
    } catch(e) {
      console.error(e)
    }
    let index = this.data.event.findIndex(function(event){
      return event.eventId == eventId;
    })
    this.setData({
      [`event[${index}].inEvent`]: false
    })
  },

  modifyEvent(e) {
    const eventId = e.currentTarget.dataset.eventid;
    wx.navigateTo({
      url: 'eventModify?eventId=' + eventId
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData: function () {
    var eventArr = [];
    var pre_eventArr = [];
    //从云数据获取用户日程
    db.collection('events')
    // .aggregate().lookup({
    //   from: 'courses',
    //   localField: 'course_classId',
    //   foreignField: 'classId',
    //   as: 'courseName',
    // })
    // 以上联表查询无法使用 原因不明 
    .where(
      {
        course_classId: getApp().globalData.classId
      }
    )
    .orderBy('endDate', 'asc')
    .get().then(res => {
      console.log('events',res.data);
      //格式化结果
      for(let i=0;i<res.data.length;i++){
        var event = res.data[i];
        console.log('进入数组遍历',event);
        //通过 course_id 获取 courseName 
        //！BUG  推测为异步问题 应将异步操作同步化
        if(event.course_id){
          //查询云数据库 courses 集合
          db.collection('courses')
          .where({
            _id: event.course_id
          })
          .field({courseName: true})
          .get().then(res => {
            console.log('获取到courseName',res);
            event.eventBindCourse = res.data[0].courseName;
          })
        }
        

        var date = new Date();
        //处理 eventStatus
        if (!event.done) {
          if (date > event.endDate) {
            event.eventStatus = '已结束';
          }else {
            event.eventStatus = '进行中';
          }
        }else {
          event.eventStatus = '已完成';
        }
        //处理 eventSync
        if (event.course_classId) {
          event.eventSync = true;
        }else {
          event.eventSync = false;
        }
        //处理 eventStar
        if (event.star) {
          event.eventStar = true;
        }else {
          event.eventStar = false;
        }
        //处理 ownEvent 和 inEvent
        if (event._openid == getApp().globalData.userInfo.openid ){
          if (event.pre_id) {
            event.inEvent = true
          }else{
            event.ownEvent = true
          } 
        }
        const year = event.endDate.getFullYear();
        const month = event.endDate.getMonth() + 1;
        const day = event.endDate.getDate();
        event.endDateOnDisplay = year + '-' + ((month > 10) ? month : ('0' + month)) + '-' + ((day > 10) ? day : ('0' + day));
        if (event.pre_id) {
          pre_eventArr.push({
            pre_id: event.pre_id
          })
        }else {
          eventArr.push({
            eventId: event._id,
            eventTitle: event.eventName,
            eventBindCourse: '临时课程',//event.eventBindCourse,//无法获取
            eventStatus: event.eventStatus,
            eventEndDate: event.endDateOnDisplay,
            eventDescription: event.eventDescription,
            eventSync: event.eventSync,
            eventStar: event.eventStar,
            eventCourseId: event.course_id,
            eventClassId: event.course_classId,
            eventOriEndDate: event.endDate,
            ownEvent: event.ownEvent,
            inEvent: event.inEvent,
          })
        }
        
      }
      //判断是否已添加到日程
      for (let i = 0; i < pre_eventArr.length; i++) {
        const pre_id = pre_eventArr[i].pre_id;
        for (let j = 0; j < eventArr.length; j++) {
          if (eventArr[j].eventId == pre_id) {
            eventArr[j].inEvent = true;
          }
        }
      }
      console.log(eventArr);
      this.setData({
        event: eventArr,
      })
      })
  },
})