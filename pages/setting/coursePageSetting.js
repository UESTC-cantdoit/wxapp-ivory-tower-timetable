// pages/setting/coursePageSetting.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayDayNum: getApp().globalData.settings.displayDayNum,
    displayCourseNum: getApp().globalData.settings.displayCourseNum
  },

  selectDisplayDayNum() { // 可选值为 5 和 7
    var app = getApp();
    const displayDayNum = this.data.displayDayNum;
    let nowDisplayDayNum;
    const notifyText = '每周显示天数修改为 ';
    if (displayDayNum == 7) {
      nowDisplayDayNum = 5;
    } else {
      nowDisplayDayNum = 7;
    }

    this.setData({  // 修改页面变量
      displayDayNum: nowDisplayDayNum
    });
    app.globalData.settings.displayDayNum = nowDisplayDayNum; // 修改全局变量
    this.showNotify(notifyText + nowDisplayDayNum + ' 天'); // 页面提示
    // todo: 数据库操作
  },

  selectDisplayCourseNum() {  // 可选值为 11, 12, 13, 14
    var app = getApp();
    const displayCourseNum = this.data.displayCourseNum;
    let nowDisplayCourseNum;
    const notifyText = '每天显示课程数修改为 ';
    if (displayCourseNum > 11) {
      nowDisplayCourseNum = displayCourseNum - 1;
    } else {
      nowDisplayCourseNum = 14;
    }

    this.setData({
      displayCourseNum: nowDisplayCourseNum
    });
    app.globalData.settings.displayCourseNum = nowDisplayCourseNum;
    this.showNotify(notifyText + nowDisplayCourseNum + ' 节');
    // todo: 数据库操作
  },

  showNotify(msg) {
    Notify({
      type: 'primary',
      message: msg,
      duration: 1500
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
    this.setData({
      displayDayNum: getApp().globalData.settings.displayDayNum,
      displayCourseNum: getApp().globalData.settings.displayCourseNum
    });
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