const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayDayNum: 7, // 由偏好设置获取；显示的天数，可选值为“5”和“7”
    displayDay: ['一', '二', '三', '四', '五', '六', '日'], // 根据 displayDayNum 生成
    displayCourseNum: 14, // 由偏好设置获取；显示的每天课程数，可选值为“11”至“14”
    displayCourse: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // 根据 displayCourseNum 生成
    course: [ // 由数据库获取
      {
        courseId: 1,
        courseName: '微积分',
        courseTeacher: '李xx',
        coursePlace: '品学楼 201',
        courseTime: [ // 上课时间
          {
            day: 3, // 周三
            startTime: 3, // 第三节课开始到
            endTime: 4  // 第四节课结束
          },
          {
            day: 4,
            startTime: 7,
            endTime: 8
          },
        ]
      },
      {
        courseId: 2,
        courseName: '数据结构与设计',
        courseTeacher: '王xx',
        coursePlace: '立人楼 515',
        courseTime: [
          {
            day: 1,
            startTime: 1,
            endTime: 1
          },
          {
            day: 2,
            startTime: 2,
            endTime: 2
          },
        ]
      },
    ],
    showPopup: false,
    courseTimetable: [], // onLoad 中加载生成，处理 course 信息并添加到此处
    selectCourseInfo: {
      courseId: null,
      courseName: '',
      courseTeacher: '',
      coursePlace: ''
    }
  },

  showCourseDetails(e) {
    const courseId = e.currentTarget.dataset.courseid;
    if (courseId != null) { // 点击课程项时
      const courseName = e.currentTarget.dataset.coursename;
      const courseTeacher = e.currentTarget.dataset.courseteacher;
      const coursePlace = e.currentTarget.dataset.courseplace;
      this.setData({
        selectCourseInfo: {
          courseId: courseId,
          courseName: courseName,
          courseTeacher: courseTeacher,
          coursePlace: coursePlace
        }
      });
    } else {  // 点击非课程项时
      this.setData({
        selectCourseInfo: {
          courseId: null,
          courseName: '',
          courseTeacher: '',
          coursePlace: ''
        }
      });
    }
    this.showPopup();
  },

  showPopup() {
    this.setData({
      showPopup: true
    });
  },

  hidePopup() {
    this.setData({
      showPopup: false
    });
  },

  modifyCourse() {
    const courseId = this.data.selectCourseInfo.courseId;
    this.hidePopup();
    wx.navigateTo({
      url: 'courseModify?courseId=' + courseId
    });
  },

  addEvent() {
    const courseId = this.data.selectCourseInfo.courseId;
    this.hidePopup();
    wx.navigateTo({
      url: '../event/eventCreate?courseId=' + courseId
    });
  },

  addCourse() {
    this.hidePopup();
    wx.navigateTo({
      url: 'courseCreate'
    });
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
  onShow: function () { // 若修改过每周显示天数或每天显示课程数，则重新加载本页面
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
  getData: function () {
    // console.log('course',getApp().globalData.userInfo.openid)
    db.collection('courses').where({
      _openid: getApp().globalData.userInfo.openid
    }).get().then( res => {
      var coursesArr = [];
      res.data.forEach( course => {
        var courseTimeArr = [];
        //替换 courseTime 属性名
        course.courseTime.map( time =>{
          courseTimeArr.push({ 
            'day': time.weekDay,
            'startTime': time.startTime,
            'endTime': time.endTime
          })
        })
        // 替换属性名其它方法
        // JSON.parse(JSON.stringify(course.courseTime).replace(/weekDay/g, 'day'))   
        coursesArr.push({
          courseId: course._id,
          courseName: course.courseName,
          courseTeacher: course.courseTeacher,
          coursePlace: course.coursePlace,
          courseTime: courseTimeArr,
        })
      });
      this.setData({
        course: coursesArr
      });
      this.setCourseTimetable();
    })
  },

  setCourseTimetable: function (options) {
    const displayDayNum = this.data.displayDayNum;
    const displayCourseNum = this.data.displayCourseNum;

    // 获取显示的天数，更新 displayDay
    if (displayDayNum != 7) {
      this.setData({
        displayDay: ['一', '二', '三', '四', '五']
      });
    }

    // 获取显示的课程节数，更新 displayCourse
    if (displayCourseNum != 14) {
      const num = this.data.displayCourseNum;
      let array = [];
      for (let count = 1; count <= num; count++) {
        array.push(count);
      }
      this.setData({
        displayCourse: array
      });
    }

    // 处理 course 信息添加到 courseTimetable 进行渲染
    let courseTimetable = [];
    for (let i = 0; i < ((displayDayNum + 1) * displayCourseNum); i++) {
      if ((i % (displayDayNum + 1)) == 0) { // 左侧课程节数
        courseTimetable.push({
          gridId: i,
          courseNum: i/(displayDayNum+1) + 1
        });
      } else {
        courseTimetable.push({  // 课程初始化
          gridId: i,
          courseId: null,
          courseName: '',
          courseTeacher: '',
          coursePlace: ''
        });
      }
    };
    const course = this.data.course;
    for (let i = 0; i < course.length; i++) { // 依次获取课程信息
      const courseId = course[i].courseId;
      const courseName = course[i].courseName;
      const courseTeacher = course[i].courseTeacher;
      const coursePlace = course[i].coursePlace;
      const courseTime = course[i].courseTime;
      for (let n = 0; n < courseTime.length; n++) { // 依次获取该课程的上课时间信息
        const day = courseTime[n].day;
        const startTime = courseTime[n].startTime;
        const endTime = courseTime[n].endTime;
        for (let t = startTime; t <= endTime; t++) {
          courseTimetable[(t - 1) * (displayDayNum + 1) + day] = ({
            courseId: courseId,
            courseName: courseName,
            courseTeacher: courseTeacher,
            coursePlace: coursePlace
          })
        };
      };
    };
    this.setData({
      courseTimetable: courseTimetable
    });
  },
})
