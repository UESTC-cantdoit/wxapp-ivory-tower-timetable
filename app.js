//app.js
App({
  onLaunch: function () {
     //指定云开发环境
     wx.cloud.init({
      env:'timetable-81f1c',
      traceUser:true
    })
    //从缓存中获取用户信息
    const ui = wx.getStorageSync('openid');
    this.globalData.userInfo.openid = ui;

    //获取全局变量
    if (this.globalData.userInfo.openid) {
      this.getSettingsInfo();
    } else {
      wx.redirectTo({
        url: './pages/common/welcome',
      })
    }    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  globalData:{
    userInfo: {},
    haveClass: false,
    classId: '',
    className: '',
    isClassCreator: false,
    home: {
      focusEvent: [],
      focusEventNum: '',
      starEvent: []
    },
    settings: { // setting 页的数据
      displayMyClassModule: true, // 未加入班级者可以设置主页是否显示“我的班级”模块
      focusEventDay: 3, // 主页关注日程的时间阈值
      displayDayNum: 7, // 课程页每周显示天数
      displayCourseNum: 14, // 课程页每天显示课程数
    },
    classSetting: { // classSetting 页的数据
      enableSearch: false
    },
    settingsGetDone: false,
    courses: [],
    courseList: false,
    eventList: false,
    activeCourseNum: 0,
    activeEventNum: 0,
  },

  getSettingsInfo: function () {
    const db = wx.cloud.database();
    db.collection('settings').where({
      _id: this.globalData.userInfo.openid
    }).get().then( res => {
      if ( res.data.length == 0 ) { // 用户没有设置信息
        db.collection('settings').add({
          data: {
            _id: this.globalData.userInfo.openid,
            displayMyClassModule: true, 
            focusEventDay: 3, 
            displayDayNum: 7, 
            displayCourseNum: 14, 
          }
        })
      } else { // 用户存在设置信息
        this.globalData.settings = res.data[0];
        this.globalData.settingsGetDone = true;
      }
    })
  },
})
