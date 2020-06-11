// pages/event/eventModify.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOwner: false, // 根据是否为日程所有者判断
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
    defaultSyncToClass: false,  // 修改前是否已同步到班级；需要获取
    onModifyEventProcess: false
  },

  inputEventName(value) {
    this.setData({ eventName: value.detail });
  },

  inputEventDescription(value) {
    this.setData({ eventDescription: value.detail });
  },

  syncToClassOnChange({ detail }) {
    if (this.data.defaultSyncToClass) {
      wx.showModal({
        title: '取消同步日程',
        content: '您的修改将不再能够更新他人的日程',
        success: (res) => {
          if (res.confirm) {
            console.log('Change event sync status successfully.');
            this.setData({ syncToClass: detail });
          } else {
            console.log('Cancel.');
          }
        },
      });
    } else {
      this.setData({ syncToClass: detail });
    }
  },

  showCoursePicker() {
    if (this.data.isOwner == true) {  // 如果为日程拥有者，显示课程选择器
      this.setData({ coursePickerOnShow: true });
    } else {  // 如果为日程同步者，提示无法选择课程
      // todo
    }
  },

  coursePickerOnConfirm(value) {
    const courseName = value.detail.value.text;
    const courseClass = value.detail.value.class;
    this.setData({
      selectCourse_index: value.detail.index,
    })
    if (courseName === '不选择') {
      this.setData({
        selectCourse: '不选择'
      });
    } else {
      this.setData({
        selectCourse: courseName
      });
    }

    if (courseClass === undefined) {
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
    const date = new Date(value.detail); // 获取选择的日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const selectEndDateOnDisplay = year + '-' + ((month >= 10) ? month : ('0' + month)) + '-' + ((day >= 10) ? day : ('0' + day));
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

  modifyEvent() { // 点击确认修改日程按钮
    wx.showModal({
      title: '修改日程',
      content: '您将修改日程：' + this.data.eventName,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            onModifyEventProcess: true
          })
          //云数据库操作 添加记录至 events 集合
          if (this.data.selectCourse == '不选择') {
            db.collection('events').doc(this.data.eventId).update({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
              }
            })
          }else if (this.data.syncToClass == false){
            if (this.data.selectCourse_index) {
              this.setData({
                selectCourse_id: this.data.courses[this.data.selectCourse_index-1]._id,
              })
            }
            db.collection('events').doc(this.data.eventId).update({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
                course_id: this.data.selectCourse_id
              }
            })
          }else if (this.data.syncToClass == true){
            if (this.data.selectCourse_index) {
              this.setData({
                selectCourse_id: this.data.courses[this.data.selectCourse_index-1]._id,
                selectCourse_classId: this.data.courses[this.data.selectCourse_index-1].classId
              })
            }
            db.collection('events').doc(this.data.eventId).update({
              data: {
                eventName: this.data.eventName,
                eventDescription: this.data.eventDescription,
                endDate: this.data.selectEndDate,
                course_id: this.data.selectCourse_id,
                course_classId: this.data.selectCourse_classId,
                haveChanged: true,
              }
            })
          }
          //云数据库操作完成
          this.setData({
            onModifyEventProcess: false
          })
          console.log('Modify event successfully.');
        } else {
          console.log('Cancel.');
        }
      },
    });
  },

  deleteEvent() {
    wx.showModal({
      title: '删除日程',
      content: '您将删除日程：' + this.data.eventName,
      success: (res) => {
        if (res.confirm) {
          if (this.data.isOwner && this.data.defaultSyncToClass && this.data.haveClass) {
            wx.showModal({
              title: '如果您执意',
              content: '删除同步日程后，您的修改将不再能够更新他人的日程',
              success: (res) => {
                if (res.confirm) {
                  db.collection('events').doc(this.data.eventId).remove();
                  console.log('Delete event successfully.');
                } else {
                  console.log('Cancel.');
                }
              },
            });
          } else {
            db.collection('events').doc(this.data.eventId).remove();
            console.log('Delete event successfully.');
          }
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
    this.getData();
    this.getCourses();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 设置课程选择
    // var coursesArr = [];
    // coursesArr.push({ text: '不选择', class: 'null' });
    // this.data.courses.forEach(function(course) {
    //   coursesArr.push({ text: course.courseName, class: course.class });
    // });
    // this.setData({ coursePickerCourses: coursesArr });
    // this.getCourses();
    // 设置展示在截止日期处的日期
    // const date = this.data.selectEndDate;
    // console.log('date',this.data.selectEndDate)
    // if (date !== null) {
    //   const year = date.getFullYear();
    //   const month = date.getMonth() + 1;
    //   const day = date.getDate();
    //   const selectEndDateOnDisplay = year + '-' + ((month > 10) ? month : ('0' + month)) + '-' + ((day > 10) ? day : ('0' + day));
    //   this.setData({
    //     selectEndDateOnDisplay: selectEndDateOnDisplay
    //   });
    // }
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

  },
  getData: function(){
    db.collection('events').doc(this.data.eventId)
    .get().then( res => {
      let event = res.data;
      // console.log('event',event);
      event.isOwner = false; 
      event.syncToClass = false;
      event.defaultSyncToClass = false;

      //判断是否为日程所有者
      if ( event._openid == getApp().globalData.userInfo.openid 
           && !('pre_id' in event)) {
        event.isOwner = true; 
      }
      //判断是否已同步到班级
      if ( 'course_classId' in event) {
        event.defaultSyncToClass = true;
        event.syncToClass = true;
      }

      console.log('event',event)
      this.setData({
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        selectEndDate: event.endDate,
        isOwner: event.isOwner,
        defaultSyncToClassevent: event.defaultSyncToClass,
        syncToClass: event.syncToClass,
      })
      
      const date = this.data.selectEndDate;
      console.log('date',this.data.selectEndDate)
      if (date !== null) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const selectEndDateOnDisplay = year + '-' + ((month > 10) ? month : ('0' + month)) + '-' + ((day >= 10) ? day : ('0' + day));
        this.setData({
          selectEndDateOnDisplay: selectEndDateOnDisplay
        });
      }
      // 获取课程名称 判断课程时候同步自班级
      if ( 'course_id' in event ) {
        db.collection('courses').doc(event.course_id)
        .get().then( course_res => {
          let course = course_res.data;
          console.log('course',course);
          course.selectCourseBelongToClass = false;
          if ( 'classId' in course ) {
            course.selectCourseBelongToClass = true;
          }else {
            course.classId = '';
          }
          this.setData({
            selectCourse: course.courseName,
            selectCourse_id: course._id,
            selectCourseBelongToClass: course.selectCourseBelongToClass,
            selectCourse_classId: course.classId,
          })
        })
      }
      

    })
  },
  getCourses: function (){
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