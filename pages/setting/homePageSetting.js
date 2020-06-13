// pages/setting/homePageSetting.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveClass: getApp().globalData.haveClass,
    displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
    focusEventDay: getApp().globalData.settings.focusEventDay
  },

  selectDisplayMyClassModule() {
    var app = getApp();
    const displayMyClassModule = this.data.displayMyClassModule;
    let nowSelectDisplayMyClassModule;
    let nowStatus;
    if (displayMyClassModule) {
      nowSelectDisplayMyClassModule = false;
      nowStatus = '隐藏';
    } else {
      nowSelectDisplayMyClassModule = true;
      nowStatus = '显示';
    }

    this.setData({
      displayMyClassModule: nowSelectDisplayMyClassModule
    });
    app.globalData.settings.displayMyClassModule = nowSelectDisplayMyClassModule;
    this.showNotify(nowStatus + '“我的班级”模块');
    // todo: 数据库操作
  },

  selectFocusEventDay() {
    var app = getApp();
    const focusEventDay = this.data.focusEventDay;
    let nowFocusEventDay;
    const notifyTextStart = '关注距离结束 ';
    const notifyTextEnd = ' 天内的日程';

    if (focusEventDay == 3) {
      nowFocusEventDay = 1;
    } else if (focusEventDay == 1) {
      nowFocusEventDay = 7;
    } else if (focusEventDay == 7) {
      nowFocusEventDay = 3;
    }

    this.setData({
      focusEventDay: nowFocusEventDay
    });
    app.globalData.settings.focusEventDay = nowFocusEventDay;
    this.showNotify(notifyTextStart + nowFocusEventDay + notifyTextEnd);
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
      haveClass: getApp().globalData.haveClass,
      displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
      focusEventDay: getApp().globalData.settings.focusEventDay
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