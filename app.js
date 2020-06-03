//app.js
App({
  onLaunch: function () {
    //从缓存中获取用户信息
    const ui = wx.getStorageSync('userinfo')
    this.globalData.userInfo = ui;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //指定云开发环境
    wx.cloud.init({
      env:'timetable-81f1c',
      traceUser:true
    })
    this.get_globalData();
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
              console.log("userInfo",that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo: null,
    haveClass: false,
    applyClass: false,
    classId: '',
    className: '',
    courses: [
      {courseName: '微积分', class: '互加二班'},
      {courseName: '概率论', class: '互加二班'},
      {courseName: '计算机组成原理', class: 'null'}
    ]
  },

  get_globalData:function () {
    const db = wx.cloud.database();
    //查询 user-class 集合，获取 haveClass 信息
    db.collection('users-class').where({
      _openid: this.globalData.userInfo.openid,
    }).get().then(res => {
      console.log("res",res);
      if (res.data.length !== 0) {
        if (res.data[0].classId) {
          this.globalData.haveClass = true;
          this.globalData.classId = res.data[0].classId;
          db.collection('users-class').where({
            _openid: this.globalData.userInfo.openid,
            classId: res.data[0].classId
          }).get().then( res1 => {
            this.globalData.className = res1.data[0].className
          })
          console.log("haveclass",this.globalData.haveClass);
          console.log("classId",this.globalData.classId)
        }
      }else {
        console.log("haveclass",this.globalData.haveClass)
        console.log("not found class")
      }
    })
    //查询 courses 集合，获取 courses 信息
    db.collection('courses')
    .where({
      _openid:this.globalData.userInfo.openid,
    })
    .field({
      courseName: true,classId: true,
    }).get().then(res => {
      console.log("res",res);
      this.globalData.courses = res.data;
      //处理数组中每个对象为指定格式
      this.globalData.courses.forEach(function(item){
        if (item.classId){
          db.collection('class')
          .where({
            classId:item.classId
          })
          .field({
            className: true
          }).get().then(res =>{
            item.class = res.data[0].className;
          })
        }else{
          item.class = 'null';
        }
      })
      console.log("courses",this.globalData.courses);
    })
  },
})