// pages/class/classCreate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enableSearch: true,
    createClassDisabled: true,
    className: '',
    onCreateClassProcess: false
  },

  inputClassName: function(e) {
    this.setData({ className: e.detail });
    if (e.detail !== '') {
      this.setData({
        createClassDisabled: false
      });
    } else {
      this.setData({
        createClassDisabled: true
      });
    }
  },

  enableSearchOnChange({ detail }) {
    if (this.data.enableSearch === true) {
      wx.showModal({
        title: '提示',
        content: '关闭后其它同学将不能使用班级号搜索并加入班级',
        success: (res) => {
          if (res.confirm) {
            this.setData({ enableSearch: detail });
          }
        },
      });
    } else {
      this.setData({ enableSearch: detail });
    }
  },

  createClass: function(e) {
    wx.showModal({
      title: '创建班级',
      content: '您将创建班级：' + this.data.className,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            onCreateClassProcess: true
          })
          console.log('Crate class successfully.');
        } else {
          console.log('Cancel.');
        }
      },
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