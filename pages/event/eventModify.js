// pages/event/eventModify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalDisabled: true, // 根据是否为课程所有者判断
    eventId: null,  // 通过路由传值自动获取
    courses: getApp().globalData.courses,
    coursePickerCourses: null,
    coursePickerOnShow: false,
    selectCourse: '不选择', // 需要获取
    selectCourseBelongToClass: false, // 需要获取
    eventName: null,  // 需要获取
    eventDescription: null, // 需要获取
    selectEndDate: null,  // 需要获取；标准 Date() 时间，为选择当天的零时零分零秒
    selectEndDateOnDisplay: '', // 自动根据获取的 selectEndDate 加载；显示在界面上的日期
    datePickerOnShow: false,
    haveClass: getApp().globalData.haveClass,
    syncToClass: false, // 需要获取
    onCreateEventProcess: false
  },

  inputEventName(value) {
    this.setData({ eventName: value.detail });
  },

  inputEventDescription(value) {
    this.setData({ eventDescription: value.detail });
  },

  syncToClassOnChange({ detail }) {
    this.setData({ syncToClass: detail });
  },

  showCoursePicker() {
    if (this.data.globalDisabled) {
      //
    } else {
      this.setData({ coursePickerOnShow: true });
    }
  },

  coursePickerOnConfirm(value) {
    const courseName = value.detail.value.text;
    const courseClass = value.detail.value.class;
    if (courseName === '不选择') {
      this.setData({
        selectCourse: '不选择'
      });
    } else {
      this.setData({
        selectCourse: courseName
      });
    }

    if (courseClass === 'null') {
      this.setData({
        selectCourseBelongToClass: false
      });
    } else {
      this.setData({
        selectCourseBelongToClass: true
      });
    }

    this.setData({
      syncToClass: false,
      coursePickerOnShow: false
    });
  },

  coursePickerOnCancel() {
    this.setData({
      coursePickerOnShow: false
    });
  },

  showDatePicker() {
    if (this.data.globalDisabled) {
      //
    } else {
      this.setData({ datePickerOnShow: true });
    }
  },

  datePickerOnConfirm(value) {
    const date = new Date(value.detail); // 获取选择的日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const selectEndDateOnDisplay = year + '-' + ((month > 10) ? month : ('0' + month)) + '-' + ((day > 10) ? day : ('0' + day));
    this.setData({
      selectEndDate: date,
      selectEndDateOnDisplay: selectEndDateOnDisplay,
      datePickerOnShow: false
    });
  },

  datePickerOnClose() {
    this.setData({
      datePickerOnShow: false
    });
  },

  createEvent() {
    wx.showModal({
      title: '创建日程',
      content: '您将创建日程：' + this.data.eventName,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            onCreateEventProcess: true
          })
          console.log('Create event successfully.');
        } else {
          console.log('Cancel.');
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eventId: options.eventId
    });
    console.log('当前 eventId: '+this.data.eventId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 设置课程选择
    var coursesArr = [];
    coursesArr.push({ text: '不选择', class: 'null' });
    this.data.courses.forEach(function(course) {
      coursesArr.push({ text: course.courseName, class: course.class });
    });
    this.setData({ coursePickerCourses: coursesArr });
    // 设置展示在截止日期处的日期
    const date = this.data.selectEndDate;
    if (date !== null) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const selectEndDateOnDisplay = year + '-' + ((month > 10) ? month : ('0' + month)) + '-' + ((day > 10) ? day : ('0' + day));
      this.setData({
        selectEndDateOnDisplay: selectEndDateOnDisplay
      });
    }
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