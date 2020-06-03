// pages/course/courseList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * anchorIndexList 用于生成右侧的快速索引按钮
     * todo: 生成 courseAnchorIndexList 后生成；
     *       每一项应按英文字符顺序排序
     */
    anchorIndexList: ['X', 'W', 'S'],
    /**
     * courseAnchorIndexList 用于渲染页面
     * todo: 'onReady: function()' 函数体内读取公用课程信息后生成；
     *       每一项应按 anchorIndex 英文字符顺序排序
     */
    courseAnchorIndexList: [
      {
        anchorIndex: 'X',
        course: [
          {
            courseId: '123',
            courseName: '学术英语',
            courseTeacher: '某老师',
            haveAddedToCourse: false, // 是否已经添加到此用户的课程表
            ownCourse: false  // 用户是否为该课程的所有者（courseOwnerId == userId）
          }
        ]
      },
      {
        anchorIndex: 'W',
        course: [
          {
            courseId: '22917',
            courseName: '微积分',
            courseTeacher: '黄某某',
            haveAddedToCourse: false,
            ownCourse: false
          }
        ]
      },
      {
        anchorIndex: 'S',
        course: [
          {
            courseId: '229247',
            courseName: '数据库原理及运用',
            courseTeacher: '文某',
            haveAddedToCourse: false,
            ownCourse: false
          },
          {
            courseId: '229249',
            courseName: '数据库原理及运用',
            courseTeacher: '张xx',
            haveAddedToCourse: false,
            ownCourse: false
          }
        ]
      }
    ]
  },

  createCourse() {
    wx.navigateTo({
      url: 'courseCreate'
    })
  },

  addToCourse(e) {
    console.log(e);
    const courseId = e.currentTarget.dataset.courseid;
  },

  removeFromCourse(e) {
    const courseId = e.currentTarget.dataset.courseid;
  },

  modifyCourse(e) {
    const courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: 'courseModify?courseid=' + courseId
    })
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