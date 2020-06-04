// pages/event/event.js
const db = wx.cloud.database();
// 滑动手势处理 https://www.jianshu.com/p/d4bb2f8eedc3
let minOffset = 30; //最小偏移量，低于这个值不响应滑动处理
let minTime = 40; // 最小时间，单位：毫秒，低于这个值不响应滑动处理
let startX = 0; //开始时的X坐标
let startY = 0; //开始时的Y坐标
let startTime = 0; //开始时的毫秒数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 1,
    tabEnd: 2, // 标签数量减一
    showFloatBtn: true,
    fadeAnimation: '',
    event: [ // 获取时应按照 event 截止时间 eventEndDate 由早及晚依次获取
      {
        eventId: '22314',
        eventTitle: '这是一个事件',
        eventBindCourse: '数据库原理及运用',
        eventStatus: '已完成',
        eventEndDate: '2020-05-31', // 理论上直接使用 Date() 函数的值，这里是测试方便
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
    ],
    showEventActionSheet: false,
    eventOperations: [],
    eventOperationModifyEventInfo: {
      name: '修改日程信息',
      className: 'modifyEventInfo'
    },
    eventOperationModifyEventInfoDisabled: {
      name: '修改日程信息',
      className: 'modifyEventInfo',
      disabled: true
    },
    eventOperationSetEventStar: {
      name: '设置日程星标',
      color: '#FF8533',
      className: 'setEventStar'
    },
    eventOperationCancelEventStar: {
      name: '取消日程星标',
      color: '#FF8533',
      className: 'cancelEventStar'
    },
    eventOperationSetEventFinished: {
      name: '设置日程完成',
      color: '#07c160',
      className: 'setEventFinished'
    },
    eventOperationCancelEventFinished: {
      name: '取消日程完成',
      color: '#FF3333',
      className: 'cancelEventFinished'
    },
    selectEvent: {
      id: null,
      title: null,
      star: null,
      status: null
    }
  },

  createEvent() {
    wx.navigateTo({
      url: 'eventCreate'
    })
  },

  showEventOperation(event) {
    const eventStar = event.currentTarget.dataset.eventstar;
    const eventStatus = event.currentTarget.dataset.eventstatus;
    let eventOperations = [];
    if (eventStatus == '进行中') { // 进行中的日程可修改信息
      eventOperations.push(this.data.eventOperationModifyEventInfo);
    } else {
      eventOperations.push(this.data.eventOperationModifyEventInfoDisabled);
    }
    if (eventStar) { // 拥有星标的日程可以取消星标
      eventOperations.push(this.data.eventOperationCancelEventStar);
    } else { // 没有星标的日程可以设置星标
      eventOperations.push(this.data.eventOperationSetEventStar);
    }
    if (eventStatus == '进行中' || eventStatus == '已结束') { // 进行中或已结束的日程可以设置已完成
      eventOperations.push(this.data.eventOperationSetEventFinished);
    } else {  // 设置已完成的日程可以取消已完成
      eventOperations.push(this.data.eventOperationCancelEventFinished);
    }
    this.setData({
      selectEvent: {
        id: event.currentTarget.dataset.eventid,
        title: event.currentTarget.dataset.eventtitle,
        star: eventStar,
        status: eventStatus
      },
      eventOperations: eventOperations,
      showEventActionSheet: true
    });
  },

  eventActionSheetOnClose() {
    this.setData({
      showEventActionSheet: false
    })
  },

  eventActionSheetOnSelect(e) {
    const eventId = this.data.selectEvent.id; // 该日程的 id
    let event = this.data.event;
    switch(e.detail.className) {
      case 'modifyEventInfo':
        // to do: 跳转到修改日程页面
        wx.navigateTo({
          url: 'eventModify?eventId=' + eventId
        });
        break;
      case 'setEventFinished':
        // to do: 设置该日程已完成
        for (let i=0; i<event.length; i++) {
          if (event[i].eventId == eventId) {
            event[i].eventStatus = '已完成';
            //云数据库操作
            db.collection('events').where({
              _id:eventId
            })
            .update({
              data:{
                done: true
              }
            })
            break;
          }
        }
        this.setData({
          event: event
        })
        break;
      case 'setEventStar':
        // to do: 设置该日程星标
        for (let i=0; i<event.length; i++) {
          if (event[i].eventId == eventId) {
            event[i].eventStar = true;
            db.collection('events').where({
              _id:eventId
            })
            .update({
              data:{
                star: true
              }
            })
            break;
          }
        }
        this.setData({
          event: event
        })
        break;
      case 'cancelEventFinished':
        // to do: 取消设置该日程已完成
        for (let i=0; i<event.length; i++) {
          if (event[i].eventId == eventId) {
            // if (event[i].eventEndDate > (new Date().getTime()))
            event[i].eventStatus = '进行中';
            // else
            // event[i].eventStatus = '已结束';
            break;
          }
        }
        this.setData({
          event: event
        })
        break;
      case 'cancelEventStar':
        // to do: 取消设置该日程星标
        for (let i=0; i<event.length; i++) {
          if (event[i].eventId == eventId) {
            event[i].eventStar = false;
            break;
          }
        }
        this.setData({
          event: event
        })
        break;
    }
  },

  /**
   * 触摸事件开始，初始化startX、startY和startTime
   */
  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的x坐标  
    startY = e.touches[0].pageY; // 获取触摸时的x坐标
    startTime = new Date().getTime(); //获取毫秒数
  },

  /**
   * 触摸事件取消（手指触摸动作被打断，如来电提醒，弹窗），将startX、startY和startTime重置
   */
  touchCancel: function (e) {
    startX = 0;//开始时的X坐标
    startY = 0;//开始时的Y坐标
    startTime = 0;//开始时的毫秒数
  },

  /**
   * 触摸事件结束
   */
  touchEnd: function (e) {
    const activeTab = this.data.activeTab;
    const tabEnd = this.data.tabEnd;
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var touchTime = new Date().getTime() - startTime;//计算滑动时间
    //开始判断
    //1.判断时间是否符合
    if (touchTime >= minTime) {
      //2.判断偏移量：分X、Y
      var xOffset = endX - startX;
      var yOffset = endY - startY;
      //①条件1（偏移量x或者y要大于最小偏移量）
      //②条件2（可以判断出是左右滑动还是上下滑动）
      if (Math.abs(xOffset) >= Math.abs(yOffset) && Math.abs(xOffset) >= minOffset) {
        //左右滑动
        //③条件3（判断偏移量的正负）
        if (xOffset < 0) {
          if (activeTab < tabEnd) {
            this.setData({
              activeTab: activeTab + 1
            })
          }
        } else {
          if (activeTab > 0) {
            this.setData({
              activeTab: activeTab - 1
            })
          }
        }
      } else if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
        //上下滑动
        //③条件3（判断偏移量的正负）
        if (yOffset < 0) {

        } else {

        }
      }
    }
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
    this.getDatabyCloud();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDatabyCloud();
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
  getDatabyCloud: function () {
    var eventArr = [];
    var that = this;
    wx.cloud.callFunction({
      name: 'get_event',
      data: {
        _openid: getApp().globalData.userInfo.openid,
        course_classId: getApp().globalData.classId
      },
      success: (res) => {
        // console.log('events',res.result.list);
      //格式化结果
        for(let i=0;i<res.result.list.length;i++){
          var event = res.result.list[i];
  
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
          event.endDateOnDisplay = event.endDate.substr(0,10);
          if ( event.courseName.length !== 0 ) {
            eventArr.push({
              eventId: event._id,
              eventTitle: event.eventName,
              eventBindCourse: event.courseName[0].courseName,
              eventStatus: event.eventStatus,
              eventEndDate: event.endDateOnDisplay,
              eventDescription: event.eventDescription,
              eventSync: event.eventSync,
              eventStar: event.eventStar
            })
          }else {
            eventArr.push({
              eventId: event._id,
              eventTitle: event.eventName,
              eventBindCourse: '',
              eventStatus: event.eventStatus,
              eventEndDate: event.endDateOnDisplay,
              eventDescription: event.eventDescription,
              eventSync: event.eventSync,
              eventStar: event.eventStar
            })
          }
          
          
        }
        that.setData({
          event: eventArr,
        })

      },
      fail: err => {
        console.log(err)
      },
    })
  }
})