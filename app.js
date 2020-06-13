//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    settings: { // 从数据库获取
      displayMyClassModule: true, // 未加入班级者可以设置主页是否显示“我的班级”模块
      focusEventDay: 3, // 主页关注日程的时间阈值
      displayDayNum: 7, // 课程页每周显示天数
      displayCourseNum: 14, // 课程页每天显示课程数
    },
    userInfo: null,
    haveClass: false,
    courses: [
      {courseName: '微积分', class: '互加二班'},
      {courseName: '概率论', class: '互加二班'},
      {courseName: '计算机组成原理', class: 'null'}
    ]
  }
})