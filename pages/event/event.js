// pages/event/event.js
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
    event: [
      {
        eventId: '22314',
        eventTitle: '这是一个事件',
        eventBindCourse: '数据库原理及运用',
        eventStatus: '已完成',
        eventEndDate: '2020/05/31', // 理论上直接使用 Date() 函数的值，这里是测试方便
        eventDescription: '利用 Powerdesigner 完成数据库建模作业',
        eventSync: true,
        eventStar: false
      },
      {
        eventId: '22315',
        eventTitle: '这是另一个事件',
        eventBindCourse: '微积分',
        eventStatus: '进行中',
        eventEndDate: '2020/06/12',
        eventDescription: '在 MOOC 提交作业',
        eventSync: false,
        eventStar: true
      },
      {
        eventId: '22316',
        eventTitle: '这是又另一个事件',
        eventBindCourse: '达芬奇',
        eventStatus: '已结束',
        eventEndDate: '2020/04/23',
        eventDescription: '是一个艺术家',
        eventSync: true,
        eventStar: true
      }
    ],
    showEventActionSheet: false,
    eventOperations: [],
    defaultEventOperations: [
      {
        name: '修改日程信息',
        className: 'modifyEventInfo'
      }
    ],
    eventOperationSetEventStar: {
      name: '设置日程星标',
      color: '#FF8533',
      className: 'setEventStar'
    },
    eventOperationCancelEventStar: {
      name: '取消日程星标',
      color: '#FF3333',
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
      url: '../event/eventCreate'
    })
  },

  showEventOperation(event) {
    const eventStar = event.currentTarget.dataset.eventstar;
    const eventStatus = event.currentTarget.dataset.eventstatus;
    let eventOperations = this.data.defaultEventOperations; // 这里莫名其妙取到了实参
    if (eventStar) {
      eventOperations.push(this.data.eventOperationCancelEventStar);
    } else {
      eventOperations.push(this.data.eventOperationSetEventStar);
    }
    if (eventStatus == '进行中' || eventStatus == '已结束') {
      eventOperations.push(this.data.eventOperationSetEventFinished);
    } else {
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
    eventOperations.splice(1, 2); // 删除实参中添加的两项
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
          url: '../event/eventModify?eventId=' + eventId
        });
        break;
      case 'setEventFinished':
        // to do: 设置该日程已完成
        for (let i=0; i<event.length; i++) {
          if (event[i].eventId == eventId) {
            event[i].eventStatus = '已完成';
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

  }
})