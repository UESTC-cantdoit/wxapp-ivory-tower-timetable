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
    selectCourse_id: null,
    selectCourse_classId: null,
    selectCourse_index: null,
    selectCourseBelongToClass: false,
    eventName: null,
    eventDescription: '',
    selectEndDate: null,  // 标准 Date() 时间，为选择当天的零时零分零秒
    selectEndDateOnDisplay: '', // 显示在界面上的日期
    datePickerOnShow: false,
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
    this.setData({
      selectCourse_index: value.detail.index,
    });
    if (courseName === '不选择') {
      this.setData({
        selectCourse: '不选择'
      });
    } else {
      this.setData({
        selectCourse: courseName,
      });
    }
    if (courseClass == undefined) {
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
    this.setData({ datePickerOnShow: true });
  },

  datePickerOnConfirm(value) {
    let date = new Date(value.detail); // 获取选择的日期

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const selectEndDateOnDisplay = year + '-' + ((month >= 10) ? month : ('0' + month)) + '-' + ((day >= 10) ? day : ('0' + day));

    date = new Date(selectEndDateOnDisplay)
    date = date.getTime()-(date.getTime()%(1000 * 60 * 60 * 24)) - 8*1000*60*60;
    date = new Date(date);

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
          //云数据库操作 添加记录至 events 集合
          const selectedCourse = this.data.courses[this.data.selectCourse_index-1];
          console.log(selectedCourse);
          if (this.data.selectCourse == '不选择') {
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
              }
            })
          }else if (this.data.syncToClass == false){
            this.setData({
              selectCourse_id: selectedCourse._id,
            })
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
                course_id: this.data.selectCourse_id
              }
            })
          }else if (this.data.syncToClass == true){
            if ( 'pre_id' in selectedCourse ) {
              this.setData({
                selectCourse_id: selectedCourse.pre_id,
                selectCourse_classId: selectedCourse.classId
              })
            }else {
              this.setData({
                selectCourse_id: selectedCourse._id,
                selectCourse_classId: selectedCourse.classId
              })
            }
            
            db.collection('events').add({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
                course_id: this.data.selectCourse_id,
                course_classId: this.data.selectCourse_classId,
              }
            })
          }
          //云数据库操作完成
          this.setData({
            onCreateEventProcess: false
          })
          console.log('Create event successfully.');
          wx.navigateBack();
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
    console.log(options);
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
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   *  
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
  getData: function (){
    //获取课程信息
    db.collection('courses')
    .where({
      _openid: getApp().globalData.userInfo.openid
    })
    .get().then( res => {
      // console.log(res.data);
      this.setData({
        courses: res.data
      })
      var coursesArr = [];
      coursesArr.push({ text: '不选择', class: 'null' });
      this.data.courses.forEach(function(course) {
        coursesArr.push({
          text: course.courseName,
          class: course.classId,
        });
      });
      this.setData({ coursePickerCourses: coursesArr });
    })
  }
})
