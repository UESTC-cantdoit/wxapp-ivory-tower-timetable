// pages/setting/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    feedback: '',
    onSubmitProcess: false,
  },

  userNameOnChange(e) {
    this.setData({
      userName: e.detail
    });
  },

  feedbackOnChange(e) {
    this.setData({
      feedback: e.detail
    });
  },

  submitFeedback() {
    var that = this;
    wx.showModal({
      title: '提交反馈',
      content: '您的意见反馈将帮助我们更好地改进本小程序！谢谢！',
      success (res) {
        if (res.confirm) {
          const userName = that.data.userName;
          const feedback = that.data.feedback;
          that.setData({
            onSubmitProcess: true
          });
          console.log('user name: ' + userName);
          console.log('submit feedback: ' + feedback);
        } else {
          console.log('cancel.');
        }
      }
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