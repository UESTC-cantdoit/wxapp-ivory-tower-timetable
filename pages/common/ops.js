// pages/common/ops.js
Page({

  /**
   * 页面的初始数据
   */
  data: { // 可以通过页面传值设置 data 中的任何数据，将渲染到页面上
    titleDescription: '一点小小的',
    accidentPlace: '尚未开拓的星球',
    accidentInfo: '这可能是由于网络异常导致的',
    buttonInfo: '返回主页'
  },

  nextStep() {
    wx.switchTab({
      url: '../home/home'
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