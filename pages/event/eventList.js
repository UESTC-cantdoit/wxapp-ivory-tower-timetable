// pages/event/eventList.js
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
  },

  removeFromEvent(e) {
    console.log(e);
    const eventId = e.currentTarget.dataset.eventid;
    // to do: 将目标日程从日程中移除
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