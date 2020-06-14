// pages/home.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveClass: getApp().globalData.haveClass, // getApp().globalData.haveClass,
    activeCourseNum: getApp().globalData.activeCourseNum, // 当前班级中的同步课程数
    displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
    focusEventDay: getApp().globalData.settings.focusEventDay,
    newCourseNum: 0,  // 自用户上次登录以来新增的课程数
    activeEventNum: getApp().globalData.activeEventNum, // 仅显示用户添加的同步课程的同步日程数
    newEventNum: 0, // 自用户上次登录以来新增的日程数
    className: getApp().globalData.className,
    classId: getApp().globalData.classId,
    openid: getApp().globalData.userInfo.openid,
    isClassCreator: getApp().globalData.isClassCreator,
    focusEvent: getApp().globalData.home.focusEvent, // 应按照截止时间由早及晚排序
    starEvent: getApp().globalData.home.starEvent
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
    } else if (getApp().globalData.userInfo.openid) {
      this.setData({
        openid: getApp().globalData.userInfo.openid
      })
    } else {
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
    this.setData({
      haveClass: getApp().globalData.haveClass,
      activeCourseNum: getApp().globalData.activeCourseNum,
      displayMyClassModule: getApp().globalData.settings.displayMyClassModule,
      focusEventDay: getApp().globalData.settings.focusEventDay,
      activeEventNum: getApp().globalData.activeEventNum,
      className: getApp().globalData.className,
      classId: getApp().globalData.classId,
      openid: getApp().globalData.userInfo.openid,
      isClassCreator: getApp().globalData.isClassCreator,
      focusEvent: getApp().globalData.home.focusEvent,
      starEvent: getApp().globalData.home.starEvent
    })

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
    this.getDataOnPage();
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

  getDataOnPage: function(){  // 获取数据
    var that = this;
    db.collection('users-class').where({  // 获取班级信息
      _openid: that.data.openid,
    }).get().then(res => {
      // console.log("res: ",res);
      if (res.data.length !== 0 && res.data[0].classId) { // 成功查询到班级
        that.setData({
          haveClass: true,
          className: res.data[0].className,
          classId: res.data[0].classId,
        })

        getApp().globalData.haveClass = true;
        getApp().globalData.className = res.data[0].className;
        getApp().globalData.classId = res.data[0].classId;

        if (res.data[0]._openid == that.data.openid) {  // 如果为班级创建者
          that.setData({
            isClassCreator: true
          })
          getApp().globalData.isClassCreator = true;
        }

        that.getClassItemCount(); // 获取班级日程、课程数量
      } else {  // 查询班级失败
        that.setData({
          haveClass: false
        })
        getApp().globalData.haveClass = false;
      }

      db.collection('settings')
        .doc(that.data.openid)
        .get()
        .then( res2 => { // 获取设置信息
          // console.log(res2);
          const displayMyClassModule = res2.data.displayMyClassModule;
          const focusEventDay = res2.data.focusEventDay;
          const displayDayNum = res2.data.displayDayNum;
          const displayCourseNum = res2.data.displayCourseNum;
          that.setData({
            focusEventDay: focusEventDay,
            displayMyClassModule: displayMyClassModule
          })
          getApp().globalData.settings.displayMyClassModule = displayMyClassModule;
          getApp().globalData.settings.focusEventDay = focusEventDay;
          getApp().globalData.settings.displayDayNum = displayDayNum;
          getApp().globalData.settings.displayCourseNum = displayCourseNum;
        }).then(function(){ // 获取展示在主页的日程
          that.getFocusEvents();
          that.getStarEvents();
        }).then(function(){
          wx.stopPullDownRefresh();
        })
    })
  },

  getFocusEvents: function () { // 获取关注日程
    var that = this;
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
          } else if (event.endDate.toDateString() == tomorrow.toDateString()) {
            event.eventEndStatus = '明日截止';
          } else {
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

    wx.cloud.callFunction({ //获取需关注日程、需关注日程数
      name: 'get_focus_event',
      data: {
        _openid: this.data.openid,
      },
      success: (res) => {
        // console.log(res);
        const focusEvent = formatFocusEvents(res.result.data);
        const focusEventNum = focusEvent.length;
        this.setData({
          focusEvent: focusEvent,
          focusEventNum: focusEventNum
        })
        getApp().globalData.home.focusEvent = focusEvent;
        getApp().globalData.home.focusEventNum = focusEventNum;
      }
    })
  },

  getStarEvents: function () {  // 获取星标日程
    var that = this;
    db.collection('events').where({
      star: true,
      _openid: that.data.openid
    }).orderBy('endDate','asc').get().then( res => {
      // console.log(res.data);
      const starEvent = formatStarEvents(res.data);
      that.setData({
        starEvent: starEvent
      });
      getApp().globalData.home.starEvent = starEvent;
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
            eventEndStatus:  event.eventEndStatus
          })
      })
      return eventsArr;
    }
  },

  getClassItemCount: function () {
    var that = this;
    //获取课程数量
    db.collection('courses').where({
      classId: that.data.classId,
      pre_id: db.command.exists(false)
    }).count().then( res => {
      const activeCourseNum = res.total;
      that.setData({
        activeCourseNum: activeCourseNum
      });
      getApp().globalData.activeCourseNum = activeCourseNum;
      // 获取新增课程数 newCourseNum
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

    wx.cloud.callFunction({ //获取班级日程数量
      name: 'get_class_event_count',
      data: {
        classId: that.data.classId
      },
      success: (res) => {
        const activeEventNum = res.result;
        that.setData({
          activeEventNum: activeEventNum
        });
        getApp().globalData.activeEventNum = activeEventNum;
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
          wx.setStorageSync("classEventNum", `${res2.total}`);
        })
      },
    })
  }
})
