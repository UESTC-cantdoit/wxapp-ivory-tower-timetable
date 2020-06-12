// pages/class/classSetting.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '互加二班',
    classId: 'hujia2ban',
    enableSearch: false,
    onUpdateClassProcess: false,
    isClassCreator: false
  },

  inputClassName: function(e) {
    this.setData({ className: e.detail });
  },

  copyClassId: function() { // 将班级编号添加到剪贴板
    wx.setClipboardData({
      data: this.data.classId,
      success () {
        wx.getClipboardData({
          success (res) {
            console.log('剪贴板：'+res.data) // data
          }
        })
      }
    })
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
    console.log(this.data.enableSearch)
    console.log(detail)
  },

  dismissClass() {  // 解散班级
    wx.showModal({
      title: '警告',
      content: '班级解散后所有公有课程、公有日程都会消失，且每位同学都会回到未加入班级状态',
      confirmColor: '#FF3333',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '如果您执意',
            content: '点击解散班级按钮后就没有回头路了',
            confirmText: '解散班级',
            confirmColor: '#FF3333',
            success: (res) => {
              if (res.confirm) {
                db.collection('users-class').where({
                  classId: this.data.classId
                }).remove();
                db.collection('class').where({
                  classId: this.data.classId
                }).remove();
              }
            },
          });
        }
      },
    });
  },

  quitClass: function() { // 成员退出班级
    wx.showModal({
      title: '警告',
      content: '退出班级后您添加的所有公有课程、公有日程都会消失',
      confirmColor: '#FF3333',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '如果您执意',
            content: '点击退出班级按钮离开当前班级',
            confirmText: '退出班级',
            confirmColor: '#FF3333',
            success: (res) => {
              if (res.confirm) {
                db.collection('users-class').where({
                  _openid: getApp().globalData.userInfo.openid,
                }).remove();
              }
            },
          });
        }
      },
    });
  },

  updateClass() { // 更新班级信息
    console.log('更新班级信息');
    db.collection('class').where({
      _openid: getApp().globalData.userInfo.openid,
      classId: getApp().globalData.classId
    }).update({
      data: {
        enableSearch: this.data.enableSearch
      }
    })
    this.backToHome();
  },

  backToHome() {  // 回到首页
    wx.switchTab({
      url: '../home/home'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
    this.getData();
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
  getData: function (options) {
    this.setData({
      className: getApp().globalData.className,
      classId: getApp().globalData.classId,
    })
    db.collection('class').where({
      _openid: getApp().globalData.userInfo.openid,
      classId: getApp().globalData.classId
    }).get().then( res => {
      // console.log(res)
      if (res.data.length !== 0) {
        this.setData({
          isClassCreator: true,
          enableSearch: res.data[0].enableSearch,
        })
      }
    })
    db.collection('class').where({
      classId: getApp().globalData.classId
    }).get().then( res => {
      if (res.data.length !== 0) {
        this.setData({
          enableSearch: res.data[0].enableSearch,
        })
      }
    })
  },
})