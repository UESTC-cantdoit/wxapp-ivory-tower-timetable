// pages/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveClass: getApp().globalData.haveClass,
    activeCourseNum: 8, // 当前班级中的同步课程数
    newCourseNum: 0,  // 自用户上次登录以来新增的课程数
    activeEventNum: 19, // 仅显示用户添加的同步课程的同步日程数
    newEventNum: 1, // 自用户上次登录以来新增的日程数
    focusEvent: [ // 应按照截止时间由早及晚排序
      {
        eventId: 1234,
        eventName: '微积分作业',
        eventEndStatus: '今日截止'  // 根据获取的日程截止时间计算得出
      },
      {
        eventId: 1235,
        eventName: '做做梦',
        eventEndStatus: '明日截止'
      },
      {
        eventId: 1236,
        eventName: '出来吧皮卡丘',
        eventEndStatus: '2020-06-09'
      }
    ],
    starEvent: [
      {
        eventId: 12,
        eventName: '微信小程序设计校赛',
        eventEndStatus: '已截止'
      },
      {
        eventId: 22425,
        eventName: '微信小程序设计',
        eventEndStatus: '2020-06-15'
      }
    ]
  },

  createClass() {
    wx.navigateTo({
      url: '../class/classCreate'
    })
  },

  joinClass() {
    wx.navigateTo({
      url: '../class/classJoin'
    })
  },

  toEventPage(e) { // 点击关注日程下的日程跳转到日程页面
    const eventId = e.currentTarget.dataset.eventid;  // 获取点击日程的 eventId
    wx.switchTab({  // 无法添加参数，似乎无法实现跳转到指定位置
      url: '../event/event'
    })
  },

  toAppSetting() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  toClassSetting() {
    wx.navigateTo({
      url: '../class/classSetting'
    })
  },

  toCourseList() {
    wx.navigateTo({
      url: '../course/courseList',
    })
  },

  toEventList() {
    wx.navigateTo({
      url: '../event/eventList',
    })
  },

  createEvent() {
    wx.navigateTo({
      url: '../event/eventCreate'
    })
  },

  createCourse() {
    wx.navigateTo({
      url: '../course/courseCreate'
    })
  },

  toSuccess() {
    wx.navigateTo({
      url: '../common/success'
    })
  },

  toOps() {
    wx.navigateTo({
      url: '../common/ops'
    })
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