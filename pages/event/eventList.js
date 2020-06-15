// pages/event/eventList.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteInfo: "嘿，还没有来自其他人的同步日程哦",
    noteInfoDisplay: false,
    event: [],
    haveOthersEvent: false,
    haveOwnEvent: false,
    onLoadingStatus: true // 加载完成后显示页面
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
    // 将目标日程添加到日程中
    let index = this.data.event.findIndex(function(event){
      return event.eventId == eventId;
    })
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
    var that = this;
    wx.showModal({
      title: '移除已添加日程',
      content: '您确定要移除该同步日程吗',
      success (res) {
        if (res.confirm) {
          const eventId = e.currentTarget.dataset.eventid;
          // 将目标日程从日程中移除
          try {
            db.collection('events').where({
              _openid: getApp().globalData.userInfo.openid,
              pre_id: eventId
            }).remove()
          } catch(e) {
            console.error(e)
          }
          let index = that.data.event.findIndex(function(event){
            return event.eventId == eventId;
          })
          that.setData({
            [`event[${index}].inEvent`]: false
          })
        }
      }
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    getApp().globalData.courseList = true;
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
    this.getData();
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
    var that = this;

    wx.cloud.callFunction({
      name: 'get_class_event',
      data: {
        _openid: getApp().globalData.userInfo.openid,
        classId: getApp().globalData.classId
      },
      success: (res) => {
        console.log('events',res);
        //格式化结果
        for(let i=0;i<res.result.list.length;i++){
          var event = res.result.list[i];

          event.endDate = new Date(event.endDate);
          event.endDateOnDisplay = formatDate(event.endDate);

          function formatDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
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
          } else {
            event.eventStar = false;
          }
          //处理 ownEvent 和 inEvent
          if (event._openid == getApp().globalData.userInfo.openid ){
            if (event.pre_id) {
              event.inEvent = true
            } else {
              event.ownEvent = true
              if (!that.data.haveOwnEvent) {  // 已有个人添加的同步日程
                that.setData({
                  haveOwnEvent: true
                });
              }
            } 
          } else {
            if (!that.data.haveOthersEvent) { // 已有别人添加的同步日程
              that.setData({
                haveOthersEvent: true
              });
            }
          }
          
          if (event.pre_id) {
            pre_eventArr.push({
              pre_id: event.pre_id
            })
          } else {
            if ( event.courseName.length !== 0 ) {
              eventArr.push({
                eventId: event._id,
                eventTitle: event.eventName,
                eventBindCourse: event.courseName[0].courseName,
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
            } else {
              eventArr.push({
                eventId: event._id,
                eventTitle: event.eventName,
                eventBindCourse: '',
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
        // console.log(eventArr);
        this.setData({
          event: eventArr,
          onLoadingStatus: false
        });
        wx.stopPullDownRefresh();

        getApp().globalData.classEventCount = eventArr.length;
      },
      fail: (err) => {
        console.log('eventlist_getData错误',err)
      }
    })
  },
})