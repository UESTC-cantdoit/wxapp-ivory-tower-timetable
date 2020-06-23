// pages/event/event.js
const db = wx.cloud.database();
// 滑动手势处理 https://www.jianshu.com/p/d4bb2f8eedc3
let minOffset = 30; //最小偏移量，低于这个值不响应滑动处理
let minTime = 40; // 最小时间，单位：毫秒，低于这个值不响应滑动处理
let startX = 0; //开始时的X坐标
let startY = 0; //开始时的Y坐标
let startTime = 0; //开始时的毫秒数

let activeEventCount = 0;
let eventArr = [];
let eventCount = 0;
let currentEventCount = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 1,
    tabEnd: 2, // 标签数量减一
    showFloatBtn: true,
    haveClass: getApp().globalData.haveClass,
    event: [],  // 获取时应按照 event 截止时间 eventEndDate 由早及晚依次获取
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
    },
    onLoadingStatus: true
  },

  createEvent() {
    wx.navigateTo({
      url: 'eventCreate'
    })
  },

  deleteEndEvent() {
    const that = this ;
    wx.showModal({
      title: '清空已结束日程',
      content: '清空操作无法撤销，您确定要清空已结束日程吗',
      success (res) {
        if (res.confirm) {
          if (that.data.event.length != 0) {
            let events = that.data.event;
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              if (event.eventStatus == '已结束') {
                db.collection('events').doc(event.eventId).remove()
                events.splice(i,1);
              }
            }
            that.setData({
              event: events
            })
          }
        } else {
          console.log('取消清空已结束日程操作');
        }
      }
    });
  },

  showEventOperation(event) {
    const eventStar = event.currentTarget.dataset.eventstar;
    const eventStatus = event.currentTarget.dataset.eventstatus;
    let eventOperations = [];
    if (eventStatus == '进行中' || eventStatus == '已结束') { // 进行中或已结束的日程可修改信息
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
            db.collection('events').doc(eventId)
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
            db.collection('events').doc(eventId)
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
        db.collection('events').doc(eventId)
            .update({
              data:{
                done: db.command.remove()
              }
        })
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
        db.collection('events').doc(eventId)
        .update({
          data:{
            star: db.command.remove()
          }
        })
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      haveClass: getApp().globalData.haveClass
    });
    this.getDatabyCloud();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    eventCount = 0;
    eventArr = [];
    activeEventCount = 0;
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
    this.getDatabyCloud();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底");
    let that = this;
    if ( currentEventCount == 10 ) {
      that.getDatabyCloud();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDatabyCloud: function () {
    var that = this;
    // console.log('event',getApp().globalData.userInfo.openid)
    wx.cloud.callFunction({
      name: 'get_event',
      data: {
        _openid: getApp().globalData.userInfo.openid,
        course_classId: getApp().globalData.classId,
        eventCount: eventCount,
      },
      success: (res) => {
        console.log('events',res.result.list);
        eventCount += 10;
        
        //删除已结束已经超过 14 天的日程
        let today = new Date();
        let todayDate = today.getTime() - (today.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
        let deleteDate = todayDate - (1000*60*60*24*14);

        if (res.result.list.length != 0) {
          for (let i = 0; i < res.result.list.length; i++) {
            let endDate = new Date(res.result.list[i].endDate);
            if ( endDate.getTime() < deleteDate ) {
              db.collection('events').doc(res.result.list[i]._id).remove()
              res.result.list.splice(i,1);
            }
          }
          console.log('res',res.result.list)
        }

        currentEventCount = res.result.list.length;
        //格式化结果
        for(let i=0;i<res.result.list.length;i++){
          var event = res.result.list[i];
          
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

          //处理 eventStatus
          const today = new Date();
          event.endDate = new Date(event.endDate);
          event.endDateOnDisplay = formatDate(event.endDate);
          let todayDate = today.getTime()-(today.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;

          function formatDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
          }

          if (!event.done) {
            if (event.endDate.getTime() < todayDate) {
              event.eventStatus = '已结束';
            } else {
              event.eventStatus = '进行中';
              activeEventCount++;
            }
          } else {
            event.eventStatus = '已完成';
          }

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
          } else {
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
          eventCount: eventArr.length
        })
        console.log( activeEventCount )
        if ( activeEventCount < 8 && (currentEventCount == 10)) {
          console.log('##')
          that.getDatabyCloud();
        } else {
          that.setData({
            onLoadingStatus: false
          })
          wx.stopPullDownRefresh();
        }
        activeEventCount = 0;
      },
      fail: err => {
        console.log(err)
      },
    })
  }
})