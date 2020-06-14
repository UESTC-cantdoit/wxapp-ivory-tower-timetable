// pages/class/classSetting.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: getApp().globalData.className,
    classId: getApp().globalData.classId,
    isClassCreator: getApp().globalData.isClassCreator,
    enableSearch: getApp().globalData.classSetting.enableSearch,
    onUpdateClassProcess: false,
    onLoadingStatus: true
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
                db.collection('events').where({
                  course_classId: this.data.classId
                }).remove();
                db.collection('courses').where({
                  classId: this.data.classId
                }).remove();
                db.collection('class').where({
                  classId: this.data.classId
                }).remove().then(function(){
                  getApp().globalData.haveClass = false;
                  wx.navigateBack();
                })
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
                db.collection('events').where({
                  _openid: getApp().globalData.userInfo.openid,
                  course_classId: this.data.classId
                }).remove();
                db.collection('courses').where({
                  _openid: getApp().globalData.userInfo.openid,
                  classId: this.data.classId
                }).remove();
                db.collection('users-class').where({
                  _openid: getApp().globalData.userInfo.openid,
                }).remove().then(function(){
                  getApp().globalData.haveClass = false;
                  wx.navigateBack();
                })
              }
            },
          });
        }
      },
    });
  },

  updateClass() { // 更新班级信息
    const className = this.data.className;
    const enableSearch = this.data.enableSearch;
    this.setData({
      onUpdateClassProcess: true
    });
    db.collection('users-class').where({
      classId: getApp().globalData.classId
    }).update({
      data: {
        className: className,
      }
    })
    db.collection('class').where({
      _openid: getApp().globalData.userInfo.openid,
      classId: getApp().globalData.classId
    }).update({
      data: {
        className: className,
        enableSearch: enableSearch
      }
    }).then(function(){
      getApp().globalData.className = className;
      getApp().globalData.classSetting.enableSearch = enableSearch;
      wx.navigateBack();
    })


  },

  backToHome() {
    wx.navigateBack();
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
    this.getData()
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
    const openId = getApp().globalData.userInfo.openid; // 获取当前用户的 openId
    db.collection('class').where({
      classId: getApp().globalData.classId
    }).get().then( res => {
      console.log(res);
      if (res.data.length !== 0) {  // 搜索班级成功
        const className = res.data[0].className;
        const classId = res.data[0].classId;
        const _openId = res.data[0]._openid;
        const enableSearchStatus = res.data[0].enableSearch;
        this.setData({
          className: className,
          classId: classId
        });
        getApp().globalData.className = className;
        getApp().globalData.classId = classId;
        if (openId == _openId) {  // 是班级创建者
          this.setData({
            isClassCreator: true,
            enableSearch: enableSearchStatus,
          })
          getApp().globalData.isClassCreator = true;
          getApp().globalData.classSetting.enableSearch = enableSearchStatus;
        } else {  // 非班级创建者
          this.setData({
            isClassCreator: false,
            enableSearch: enableSearchStatus,
          })
          getApp().globalData.isClassCreator = false;
          getApp().globalData.classSetting.enableSearch = enableSearchStatus;
        }
        this.setData({
          onLoadingStatus: false
        });
      }
    })
  }
})