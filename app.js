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
      this.get_globalData();
    }else {
      wx.redirectTo({
        url: './pages/common/welcome',
      })
      this.get_globalData();
    }    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  globalData:{
    userInfo: {},
    haveClass: true,
    classId: '',
    className: '',
    classCreator: false,
    settings: { // 从数据库获取
      displayMyClassModule: true, // 未加入班级者可以设置主页是否显示“我的班级”模块
      focusEventDay: 3, // 主页关注日程的时间阈值
      displayDayNum: 7, // 课程页每周显示天数
      displayCourseNum: 14, // 课程页每天显示课程数
    },
    settingsGetDone: false,
    courses: [],
    courseList: false,
    eventList: false,
    classEventCount: 0,
  },

  get_globalData: function () {
    const db = wx.cloud.database();
    //查询 user-class 集合，获取 haveClass 信息
    db.collection('users-class').where({
      _openid: this.globalData.userInfo.openid,
    }).get().then(res => {
      // console.log("res",res);
      if (res.data.length !== 0) {
        if (res.data[0].classId) {
          this.globalData.haveClass = true;
          this.globalData.classId = res.data[0].classId;
          this.globalData.className = res.data[0].className;
          if(res.data[0]._openid == this.globalData.userInfo.openid){
            this.globalData.classCreator = true;
          }
        }
      }else {
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
      // console.log("res",res);
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
      // console.log("courses",this.globalData.courses);
      
    })

    db.collection('settings').where({
      _id: this.globalData.userInfo.openid
    }).get().then( res => {
      if ( res.data.length == 0 ) {
        db.collection('settings').add({
          data: {
            _id: this.globalData.userInfo.openid,
            displayMyClassModule: true, 
            focusEventDay: 3, 
            displayDayNum: 7, 
            displayCourseNum: 14, 
          }
        })
      }else {
        // console.log(res.data)
        this.globalData.settings = res.data[0];
        this.globalData.settingsGetDone = true;
      }
    })
  },
})