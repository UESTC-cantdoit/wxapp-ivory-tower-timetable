Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayDayNum: 7, // 显示的天数，可选值为“5”和“7”
    displayDay: ['一', '二', '三', '四', '五', '六', '日'], // 根据 displayDayNum 生成
    displayCourseNum: 14, // 显示的每天课程数，可选值为“11”至“14”
    displayCourse: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // 根据 displayCourseNum 生成
    colorArrays: ["#FC9F9D", "#0A9A84"],
    course: [
      {
        "courseId": 1,
        "courseName": '微积分',
        "courseTeacher": '李xx',
        "coursePlace": '品学楼 201',
        "courseTime": [ // 上课时间
          {
            day: '3', // 周三
            startTime: '3', // 第三节课开始到
            endTime: '4'  // 第四节课结束
          },
          {
            day: '4',
            startTime: '7',
            endTime: '8'
          },
        ]
      },
      {
        "courseId": 2,
        "courseName": '数据结构与设计',
        "courseTeacher": '王xx',
        "coursePlace": '立人楼 515',
        "courseTime": [
          {
            day: '1',
            startTime: '1',
            endTime: '1'
          },
          {
            day: '2',
            startTime: '2',
            endTime: '2'
          },
        ]
      },
    ],
    showPopup: false
  },

  showCardView: function (e) {
    wx.navigateTo({
      url: 'courseModify?courseId=' + e.currentTarget.courseId
    });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取显示的天数，更新 displayDay
    if (this.data.displayDayNum != 7) {
      this.setData({
        displayDay: ['一', '二', '三', '四', '五']
      });
    }

    // 获取显示的课程节数，更新 displayCourse
    if (this.data.displayCourseNum != 14) {
      const num = this.data.displayCourseNum;
      let array = [];
      for (let count = 1; count <= num; count++) {
        array.push(count);
      }
      this.setData({
        displayCourse: array
      });
      console.log(this.data.displayCourse);
    }
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
