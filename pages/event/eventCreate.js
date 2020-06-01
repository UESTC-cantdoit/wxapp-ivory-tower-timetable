// pages/event/eventCreate.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: getApp().globalData.courses,
    coursePickerCourses: null,
    coursePickerOnShow: false,
    selectCourse: '不选择',
    selectCourse_id: undefined,
    selectCourseBelongToClass: false,
    eventName: null,
    eventDescription: null,
    selectEndDate: null,
    selectEndTime: null,
    timePickerOnShow: false,
    currentDate: new Date().getTime(),
    minDate: new Date(new Date().getTime() + 2 * 3600000).getTime(),
    haveClass: getApp().globalData.haveClass,
    syncToClass: false,
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
    this.setData({ coursePickerOnShow: true });
  },

  coursePickerOnConfirm(value) {
    const courseName = value.detail.value.text;
    const courseClass = value.detail.value.class;
    const course_id = value.detail.value._id;
    const course_classId = value.detail.value.classId;
    if (courseName === '未设置') {
      this.setData({
        selectCourse: null
      });
    } else {
      this.setData({
        selectCourse: courseName,
        selectCourse_id: course_id,
        selectCourse_classId: course_classId
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

  showTimePicker() {
    this.setData({ timePickerOnShow: true });
  },

  timePickerOnConfirm(value) {
    var selectEndDate = new Date(value.detail);
    var selectEndTime = selectEndDate.getFullYear() + "-" +
      ((selectEndDate.getMonth()+1)>=10?selectEndDate.getMonth()+1:"0"+(selectEndDate.getMonth()+1)) + "-" +
      ((selectEndDate.getDate())>=10?selectEndDate.getDate():"0"+selectEndDate.getDate()) + " " +
      ((selectEndDate.getHours())>=10?selectEndDate.getHours():"0"+selectEndDate.getHours()) + ":" +
      ((selectEndDate.getMinutes())>=10?selectEndDate.getMinutes():"0"+selectEndDate.getMinutes())
    this.setData({
      selectEndDate: selectEndDate,
      selectEndTime: selectEndTime,
      timePickerOnShow: false
    });
  },

  timePickerOnCancel() {
    this.setData({
      timePickerOnShow: false
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
          //云数据库操作 添加记录至 events 集合
          if (this.data.selectCourse == null) {
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endTime: this.data.selectEndTime,
              }
            })
          }else if (this.data.syncToClass == false){
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endTime: this.data.selectEndTime,
                course_id: this.data.selectCourse_id
              }
            })
          }else if (this.data.syncToClass == true){
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endTime: this.data.selectEndTime,
                course_id: this.data.selectCourse_id,
                course_classId: this.data.selectCourse_classId,
              }
            })
          }
          //云数据库操作完成
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var coursesArr = [];
    // coursesArr.push({ text: '未设置', class: 'null' });
    // this.data.courses.forEach(function(course) {
    //   coursesArr.push({ text: course.courseName, class: course.class });
    // });
    // this.setData({ coursePickerCourses: coursesArr });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      courses: getApp().globalData.courses
    })
    var coursesArr = [];
    coursesArr.push({ text: '未设置', class: 'null' });
    this.data.courses.forEach(function(course) {
      coursesArr.push({ 
        text: course.courseName, 
        class: course.class,
        _id: course._id,
        classId: course.classId
      });
    });
    this.setData({ coursePickerCourses: coursesArr });

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