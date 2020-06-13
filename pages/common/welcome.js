// pages/common/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  login() {
    console.log('login in weapp.');
    this.getOpenid();
    // wx.switchTab({
    //   url: '../home/home',
    // })
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

  },
  getOpenid: function () {
    const that = this;
    wx.cloud.callFunction({
      name:"get_openid",
      success:res=>{
        // console.log(res.result.openid)
        const openid = res.result.openid;
        getApp().globalData.userInfo.openid = openid;
        wx.setStorageSync("openid", openid);
        wx.reLaunch({
          url: '../home/home?openid=' + openid
        })
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
})