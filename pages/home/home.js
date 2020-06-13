// pages/home.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveClass: false, // getApp().globalData.haveClass,
    activeCourseNum: 0, // 当前班级中的同步课程数
    displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
    focusEventDay: getApp().globalData.settings.focusEventDay,
    newCourseNum: 0,  // 自用户上次登录以来新增的课程数
    activeEventNum: 0, // 仅显示用户添加的同步课程的同步日程数
    newEventNum: 0, // 自用户上次登录以来新增的日程数
    className: '',
    classId: '',
    openid: '',
    isClassCreator: false,
    focusEvent: [], // 应按照截止时间由早及晚排序
    starEvent: [],
  },

  createClass() {
    wx.navigateTo({
      url: '../class/classCreate'
    })
  },

  joinClass() {
    wx.navigateTo({
      url: '../class/classJoin'
    })
  },

  toEventPage(e) { // 点击关注日程下的日程跳转到日程页面
    const eventId = e.currentTarget.dataset.eventid;  // 获取点击日程的 eventId
    wx.switchTab({  // 无法添加参数，似乎无法实现跳转到指定位置
      url: '../event/event'
    })
  },

  toAppSetting() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  toClassSetting() {
    wx.navigateTo({
      url: '../class/classSetting'
    })
  },

  toCourseList() {
    wx.navigateTo({
      url: '../course/courseList',
    })
  },

  toEventList() {
    wx.navigateTo({
      url: '../event/eventList',
    })
  },

  createEvent() {
    wx.navigateTo({
      url: '../event/eventCreate'
    })
  },

  toWelcome() {
    wx.redirectTo({
      url: '../common/welcome',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('opt',options);
    
    if ( 'openid' in options) {
      this.setData({
        openid: options.openid
      })
    }else if (getApp().globalData.userInfo.openid) {
      this.setData({
        openid: getApp().globalData.userInfo.openid
      })
    }else {
      this.toWelcome();
    }
    
    this.getDataOnPage()

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
    if ( getApp().globalData.courseList = true ){
      this.setData({
        newCourseNum: 0
      })
    }
    if ( getApp().globalData.eventList = true ){
      this.setData({
        newEventNum: 0
      })
    }
    if (getApp().globalData.settingsGetDone) {
      this.setData({
        displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
        focusEventDay: getApp().globalData.settings.focusEventDay
      })
      this.getFocusEvents();
    }

    if ( getApp().globalData.classEventCount ) {
      this.setData({
        activeEventNum: getApp().globalData.classEventCount 
      })
    }
    
    this.getStarEvents();
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
  //获取数据
  getDataOnPage: function(){
    const that = this;
    //获取班级信息
    db.collection('users-class').where({
      _openid: this.data.openid,
    }).get().then(res => {
      // console.log("res",res);
      if (res.data.length !== 0 && res.data[0].classId) {
          this.setData({
              haveClass: true,
              className: res.data[0].className,
              classId: res.data[0].classId,
          })
          if(res.data[0]._openid == this.data.openid){
            this.setData({
              isClassCreator: true
            })
          }
          // 获取班级日程、课程数量
          this.getClassItemCount();
        }

    // 获取关注日程
    db.collection('settings').doc(this.data.openid).get().then( res2 => {
      // console.log(res2);
      that.setData({
        focusEventDay: res2.data.focusEventDay,
        displayMyClassModule: res2.data.displayMyClassModule
      })
      that.getFocusEvents();
    })
    // 获取星标日程
    that.getStarEvents();
  })
  },
  // 获取关注日程
  getFocusEvents: function () {
    const that = this;
    // console.log(that.data.focusEventDay)
    function formatFocusEvents(events) {
      var eventsArr = [];
      let date = new Date();
      let todayDate = date.getTime()-(date.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
      //今日零点
      const today = new Date(todayDate);
      //明日零点
      const tomorrow = new Date(today.getTime()+ 1000 * 60 * 60 * 24);
      //需关注范围内最后一天零点
      const lastFocusDay = new Date(today.getTime()+ 1000 * 60 * 60 * 24 * (that.data.focusEventDay-1));
      //筛选需关注日程并格式化日程时间
      events.map( event =>{
        event.endDate = new Date(event.endDate);
        if (event.endDate <=  lastFocusDay && !(event.endDate < today)){
          // console.log(event.eventName,event.endDate)
          if (event.endDate.toDateString() == today.toDateString()) {
              event.eventEndStatus = '今日截止';
          }else if (event.endDate.toDateString() == tomorrow.toDateString()) {
            event.eventEndStatus = '明日截止';
          }else {
            function formatDate(date) {
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? '0' + m : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              return y + '-' + m + '-' + d;
            }
            event.eventEndStatus = formatDate(event.endDate);
          }
          eventsArr.push({ 
            eventId: event._id,
            eventName: event.eventName,
            eventEndStatus:  event.eventEndStatus,
          })
        }
      })
      return eventsArr
    }
    //获取需关注日程、需关注日程数
    wx.cloud.callFunction({
      name: 'get_focus_event',
      data: {
        _openid: this.data.openid,
      },
      success: (res) => {
      // console.log(res);
      var focusEvents = formatFocusEvents(res.result.data)
      this.setData({
        focusEvent:focusEvents,
        focusEventNum: focusEvents.length
      })
      }
    })
  },
  // 获取星标日程
  getStarEvents: function () {
     db.collection('events').where({
      star: true,
      _openid: this.data.openid
    }).orderBy('endDate','asc').get().then( res => {
      // console.log(res.data);
      var starEvents = formatStarEvents(res.data)
      this.setData({
        starEvent:starEvents
      })
    })
    function formatStarEvents(events) {
      var eventsArr = [];
      let date = new Date();
      let todayDate = date.getTime()-(date.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
      //今日零点
      const today = new Date(todayDate);
      //明日零点
      const tomorrow = new Date(today.getTime()+ 1000 * 60 * 60 * 24);
      //需关注范围内最后一天零点
      events.map( event =>{
          if (event.endDate < today){
            event.eventEndStatus = '已截止'
          }else if (event.endDate.toDateString() == today.toDateString()) {
              event.eventEndStatus = '今日截止';
          }else if (event.endDate.toDateString() == tomorrow.toDateString()) {
            event.eventEndStatus = '明日截止';
          }else {
            function formatDate(date) {
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? '0' + m : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              return y + '-' + m + '-' + d;
            }
            event.eventEndStatus = formatDate(event.endDate);
          }
          eventsArr.push({ 
            eventId: event._id,
            eventName: event.eventName,
            eventEndStatus:  event.eventEndStatus,
          })
      })
      return eventsArr
    }
  },
  getClassItemCount: function () {
    const that = this;
    //获取课程数量
    db.collection('courses').where({
      classId: this.data.classId,
      pre_id: db.command.exists(false)
    }).count().then( res => {
      this.setData({
        activeCourseNum: res.total
      })
      //获取新增课程数 newCourseNum
      const lastClassCourseNum = wx.getStorageSync('classCourseNum');
      // console.log('last',lastClassCourseNum);
      let newCourseNum = res.total - lastClassCourseNum;
      if ( newCourseNum > 0 ) {
        this.setData({
          newCourseNum: newCourseNum
        })
      }

      wx.setStorageSync("classCourseNum", `${res.total}`); 
    })
    //获取日程数量
    wx.cloud.callFunction({
      name: 'get_class_event_count',
      data: {
        classId: that.data.classId
      },
      success: (res) => {
        that.setData({
          activeEventNum: res.result
        })
        //获取新增日程数 newEventNum
        db.collection('events').where({
          course_classId: that.data.classId,
          pre_id: db.command.exists(false)
        }).count().then( res2 => {
          // console.log('res',res2)
          const lastClassEventNum = wx.getStorageSync('classEventNum');
          // console.log(lastClassEventNum);
          let newEventNum = res2.total - lastClassEventNum;
          if ( newEventNum > 0 && newEventNum <= res.result){
            that.setData({
              newEventNum: newEventNum
            })
          }
          
          wx.setStorageSync("classEventNum", `${res.result}`);
        })
      },
    })
  }
})