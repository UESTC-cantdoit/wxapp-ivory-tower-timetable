Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayDayNum: 7, // 显示的天数，可选值为“5”和“7”
    displayDay: ['一', '二', '三', '四', '五', '六', '七'],
    displayCourseNum: 14, // 显示的每天课程数，可选值为“11”至“14”
    displayCourse: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    colorArrays: ["#FC9F9D", "#0A9A84"],
    wlist: [
      { "xqj": 1, "sksj": 1, "skcd":2, "kcxx": "微积分 品学楼101 1~16周"},
      { "xqj": 1, "sksj": 8, "skcd": 2, "kcxx":"通用英语 品学楼318 1~16周"},
      { "xqj": 2, "sksj": 3, "skcd": 2, "kcxx": "计算机组成原理 品学楼210 1~16周" },
      { "xqj": 2, "sksj": 6, "skcd": 2, "kcxx": "C语言 品学楼402 1~16周" },
      { "xqj": 3, "sksj": 3, "skcd": 2, "kcxx": "java 品学楼216 4~12周" },
      { "xqj": 3, "sksj": 6, "skcd": 2, "kcxx": "数据结构与算法 品学楼306 1~16周" },
      { "xqj": 4, "sksj": 1, "skcd": 2, "kcxx": "微积分 品学楼218 1~16周" },
      { "xqj": 4, "sksj": 6, "skcd": 2, "kcxx": "乒乓球 体育馆 1~16周" },
      { "xqj": 4, "sksj": 8, "skcd": 2, "kcxx": "数据结构与算法 品学楼216 4~16周" },
      { "xqj": 4, "sksj": 10, "skcd": 2, "kcxx": "线性代数 品学楼504 1~16周" },
      { "xqj": 5, "sksj": 3, "skcd": 2, "kcxx": "软件工程 品学楼403 1~16周" },
    ]
  },

  showCardView: function (e) {
    wx.navigateTo({
      url: 'courseModify?courseId=' + e.currentTarget.courseId
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var kcxx = wx.getStorageSync('kcxx');
    var skcd = wx.getStorageSync('skcd');
    this.setData({ kcxx: kcxx });
    this.setData({ skcd: skcd});

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
