// pages/class/classJoin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveSearchedClass: false,
    classExist: false,
    classId: '',
    searchedClassId: '',
    searchedClassName: ''
  },

  inputClassId: function(e) {
    this.setData({ classId: e.detail });
  },

  searchClass: function(e) {
    if (this.data.classId !== '') {
      this.setData({
        searchedClassId: this.data.classId,
        haveSearchedClass: true,
        classExist: false
      });
      if (this.data.searchedClassId === 'test') {
        this.setData({
          searchedClassName: '互加二班',
          classExist: true
        });
      }
    }
  },

  joinClass: function(e) {
    wx.showModal({
      title: '加入班级',
      content: '您将加入班级：' + this.data.searchedClassName,
      success: (res) => {
        if (res.confirm) {
          console.log('Join class successfully.');
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