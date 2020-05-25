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
    if (this.data.classId !== undefined) { 
      console.log(this.data.classId);
      const that = this ;
      wx.cloud.callFunction({
        name: 'search_classId',
        data:{
          classId:that.data.classId
        },
        success:res=>{
          console.log("res",res.result);
          console.log("classid",that.data.classId)
          if (res.result.data.length !== 0) {
            that.setData({
              searchedClassId: that.data.classId,
              haveSearchedClass: true,
              searchedClassName: res.result.data[0].className,
              classExist: true
            });
          }
        }
      })
    }
  },

  joinClass: function(e) {
    wx.showModal({
      title: '加入班级',
      content: '您将加入班级：' + this.data.searchedClassName,
      success: (res) => {
        if (res.confirm) {
          //TODO
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