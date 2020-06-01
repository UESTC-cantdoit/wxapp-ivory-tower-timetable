// pages/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveClass: getApp().globalData.haveClass,
    applyClass: getApp().globalData.applyClass,
    activeCollapse: ['focusEvent'],
    activeCourseNum: 8,
    newCourseNum: 0,
    activeEventNum: 19,
    newEventNum: 1
  },

  onChangeCollapse(event) {
    this.setData({
      activeCollapse: event.detail,
    });
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

  onGotUserInfo:function(e){
    const that = this
    wx.cloud.callFunction({
      name:"get_openid",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          openid:res.result.openid,
          userinfo: e.detail.userInfo
        })
        that.data.userinfo.openid = that.data.openid
        console.log("userinfo", that.data.userinfo)
        wx.setStorageSync("userinfo", that.data.userinfo)
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
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
    this.setData({
      haveClass: getApp().globalData.haveClass,
      applyClass: getApp().globalData.applyClass,
      openid: getApp().globalData.userInfo.openid
    })
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