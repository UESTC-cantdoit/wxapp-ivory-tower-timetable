// pages/class/classJoin.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveSearchedClass: false,
    classExist: false,
    classId: '',
    searchedClassId: '',
    searchedClassName: '',
    onSearchClassStatus: false,
    onJoinClassStatus: false
  },

  inputClassId: function(e) {
    this.setData({ classId: e.detail });
  },

  searchClass: function(e) {
    if (this.data.classId !== '') { 
      this.setData({
        onSearchClassStatus: true
      })
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
              haveSearchedClass: true,
              searchedClassId: that.data.classId,
              searchedClassName: res.result.data[0].className,
              classExist: true,
              onSearchClassStatus: false
            });
          } else {
            that.setData({
              haveSearchedClass: true,
              classExist: false,
              onSearchClassStatus: false
            });
          }
        }
      })
    }
  },

  joinClass: function(e) {
    var that = this;
    const classId = this.data.searchedClassId;
    const className = this.data.searchedClassName;
    wx.showModal({
      title: '加入班级',
      content: '您将加入班级：' + className,
      success: (res) => {
        if (res.confirm) {
          that.setData({
            onJoinClassStatus: true
          });
          //云数据库操作：添加记录
          db.collection('users-class').add({
            data: {
              classId: classId,
              className: className,
              joinDate: new Date()
            }
          }).then(function(){
            getApp().globalData.classId = classId;
            getApp().globalData.className = className;
            getApp().globalData.haveClass = true;
            getApp().globalData.isClassCreator = false;
            console.log('Join class successfully.');
            wx.navigateBack();
          })
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