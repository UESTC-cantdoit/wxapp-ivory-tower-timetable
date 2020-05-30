// pages/course/courseCreate.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName: '',
    courseTeacher: '',
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
    selectCourseTime: [{
      id: new Date().getTime(),
      weekDay: '4',
      startTime: '7',
      endTime: '8'
    }],
    haveClass: getApp().globalData.haveClass,
    syncToClass: false,
    onCreateCourseProcess: false
  },

  inputCourseName(value) {
    this.setData({ courseName: value.detail });
  },

  inputCourseTeacher(value) {
    this.setData({ courseTeacher: value.detail });
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
      weekDay: selectArray[0].__data__.currentIndex + 1,
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
        break;
      default: // 点击其它地方
        instance.close();
    }
  },

  createCourse() {
    wx.showModal({
      title: '创建课程',
      content: '您将创建课程：' + this.data.courseName,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            onCreateCourseProcess: true
          })
          console.log('Create course successfully.');
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