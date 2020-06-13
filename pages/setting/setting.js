// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: '1.0.0', // 小程序版本，从全局变量获取
    versionDate: '2020-06', // 小程序版本日期，从全局变量获取
    haveClass: getApp().globalData.haveClass
  },

  toCommonSetting() {
    wx.navigateTo({
      url: 'commonSetting',
    });
  },

  toClassSetting() {
    wx.navigateTo({
      url: '../class/classSetting',
    });
  },

  toHomePageSetting() {
    wx.navigateTo({
      url: 'homePageSetting',
    });
  },

  toCoursePageSetting() {
    wx.navigateTo({
      url: 'coursePageSetting',
    });
  },

  toEventPageSetting() {
    wx.navigateTo({
      url: 'eventPageSetting',
    });
  },

  toAboutUs() {
    wx.navigateTo({
      url: 'aboutUs',
    });
  },

  toFeedback() {
    wx.navigateTo({
      url: 'feedback',
    });
  },

  toVersionDialog() {
    wx.navigateTo({
      url: 'versionDialog',
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