import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOwner: false, // 根据是否为课程所有者判断
    courseId: null, // 根据路由传值获得
    courseName: '',
    courseTeacher: '',
    coursePlace: '',
    timeSelectColumns: [
      {
        values: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        defaultIndex: 2
      },
      {
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
        defaultIndex: 4
      },
      {
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
        defaultIndex: 5
      }
    ],
    selectWeekDay: '3',
    selectTimeOne: '5',
    selectTimeTwo: '6',
    timePickerOnShow: false,
    selectCourseTime: [],
    haveClass: getApp().globalData.haveClass,
    syncToClass: false,
    defaultSyncToClass: false,  // 同步课程为 true
    onModifyCourseProcess: false,
    onLoadingStatus: true
  },

  inputCourseName(value) {
    this.setData({ courseName: value.detail });
  },

  inputCourseTeacher(value) {
    this.setData({ courseTeacher: value.detail });
  },

  inputCoursePlace(value) {
    this.setData({ coursePlace: value.detail });
  },

  showTimePicker() { // 显示添加上课时间界面
    this.setData({ timePickerOnShow: true });
  },

  timeSelectOnCancel() { // 取消添加上课时间
    this.setData({ timePickerOnShow: false });
  },

  timeSelectOnConfirm() { // 确认添加上课时间
    let items = this.data.selectCourseTime;
    let startTime = null;
    let endTime = null;
    const selectTimeOne = this.data.selectTimeOne;
    const selectTimeTwo = this.data.selectTimeTwo;
    (selectTimeOne < selectTimeTwo) ? (
      startTime = selectTimeOne, endTime = selectTimeTwo
    ) : (
      startTime = selectTimeTwo, endTime = selectTimeOne
    );
    const newItem = { // 新建一个存储上课时间的对象
      id: new Date().getTime(),
      weekDay: this.data.selectWeekDay,
      startTime: startTime,
      endTime: endTime
    };
    var util = require('../../utils/util');
    if (util.checkSelectTime(newItem, items)) { // 若时间不冲突，则添加到 selectCourseTime 中并渲染
      items.push(newItem);
      this.setData({
        selectCourseTime: items,
        timePickerOnShow: false
      });
      Notify({ type: 'success', message: '您可以左滑删除已选择时间' });
    } else { // 若时间冲突，则给出提示
      Notify('当前选择时间冲突与已有时间冲突');
    }
  },

  timeSelectOnChange(e) { // 选择的上课时间改变时
    const selectArray = e.detail.picker.children;
    this.setData({
      selectWeekDay: selectArray[0].__data__.currentIndex + 1,
      selectTimeOne: selectArray[1].__data__.currentIndex + 1,
      selectTimeTwo: selectArray[2].__data__.currentIndex + 1
    })
  },

  syncToClassOnChange({ detail }) { // 设置是否同步到班级
    this.setData({ syncToClass: detail });
  },

  courseTimeItemOnClose(event) { // 选择时间单元块左拉后点击操作
    const { position, instance } = event.detail;
    switch (position) {
      case 'right': // 点击“删除”按钮时
        if (this.data.isOwner) {
          const itemId = event.currentTarget.dataset.id;
          let items = this.data.selectCourseTime;
          wx.showModal({
            title: '删除',
            content: '确定删除所选时间吗',
            success: (res) => {
              if (res.confirm) {
                for(var i=0; i<items.length; i++){
                  if (items[i].id == itemId) {
                    items.splice(i,1);
                    break;
          　　    }
                }
                this.setData({
                  selectCourseTime: items
                });
              } else {
                instance.close();
              }
            },
          });
        } else {
          Notify({ type: 'danger', message: '您并非此课程的拥有者' });
          instance.close();
        }
        break;
      default: // 点击其它地方
        instance.close();
    }
  },

  modifyCourse() {
    const haveClass = this.data.haveClass;
    const syncToClass = this.data.syncToClass;
    const selectCourseTime = this.data.selectCourseTime;
    if (haveClass) {  // 已加入班级
      if (syncToClass == false && selectCourseTime.length == 0) { // 未同步班级且未选择上课时间
        wx.showModal({
          title: '无法修改课程',
          content: '您至少选择一个上课时间，或同步课程到班级'
        });
      } else {
        this.showModifyCourseDialog();
      }
    } else {  // 未加入班级
      if (selectCourseTime.length == 0) { // 未选择上课时间
        wx.showModal({
          title: '无法修改课程',
          content: '您至少选择一个上课时间'
        });
      } else {
        this.showModifyCourseDialog();
      }
    }
  },

  showModifyCourseDialog() {
    wx.showModal({
      title: '修改课程',
      content: '您将修改课程：' + this.data.courseName,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            onModifyCourseProcess: true
          })
          //云数据库操作：更新记录
          if (this.data.syncToClass == true) {
            db.collection('courses').doc(this.data.courseId).update({
              data: {
                courseName: this.data.courseName,
                courseTeacher: this.data.courseTeacher,
                coursePlace: this.data.coursePlace,
                courseTime: this.data.selectCourseTime,
                classId: getApp().globalData.classId,
                haveChanged: true,
                //TODO 深度判断是否 changed
              }
            }).then(function(){
              console.log('Modify course successfully.');
              wx.navigateBack();              
            })
          } else {
            db.collection('courses').doc(this.data.courseId).update({
              data: {
                courseName:this.data.courseName,
                courseTeacher:this.data.courseTeacher,
                coursePlace: this.data.coursePlace,
                courseTime:this.data.selectCourseTime
              }
            }).then(function(){
              console.log('Modify course successfully.');
              wx.navigateBack();              
            })
          }
        } else {
          console.log('Cancel.');
        }
      },
    });
  },

  deleteCourse() {
    wx.showModal({
      title: '删除课程',
      content: '您将删除课程：' + this.data.courseName,
      success: (res) => {
        if (res.confirm) {
          if (this.data.isOwner && this.data.defaultSyncToClass) {
            wx.showModal({
              title: '如果您执意',
              content: '删除此课程可能会影响到所有选择本课程的同学，真的要删除吗',
              success: (res) => {
                if (res.confirm) {
                  db.collection('courses').doc(this.data.courseId).remove();
                  db.collection('courses').where({
                    pre_id: this.data.courseId
                  }).update({
                    data: {
                      pre_id: db.command.remove()
                    }
                  }).then(function(){
                    console.log('Delete course successfully.');
                    wx.navigateBack();
                  })
                } else {
                  console.log('Cancel.');
                }
              },
            });
          } else {
            db.collection('courses')
              .doc(this.data.courseId)
              .remove()
              .then(function(){
                console.log('Delete course successfully.');
                wx.navigateBack();
              })
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
      courseId: options.courseId
    });
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
      haveClass: getApp().globalData.haveClass
    });
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
    db.collection('courses').doc(this.data.courseId)
    .get().then( res => {
      let course = res.data;
      console.log('course',course);

      course.isOwner = false; 
      course.syncToClass = false;
      course.defaultSyncToClass = false;

      //判断是否为课程所有者
      if ( course._openid == getApp().globalData.userInfo.openid 
           && !('pre_id' in course)) {
        course.isOwner = true; 
      }
      //判断是否已同步到班级
      if ( 'classId' in course) {
        course.defaultSyncToClass = true;
        course.syncToClass = true;
      }

      this.setData({
        courseName: course.courseName,
        courseTeacher: course.courseTeacher,
        coursePlace: course.coursePlace,
        selectCourseTime: course.courseTime,
        isOwner: course.isOwner,
        syncToClass: course.syncToClass,
        defaultSyncToClass: course.defaultSyncToClass,
        onLoadingStatus: false
      })

    })
  },
})