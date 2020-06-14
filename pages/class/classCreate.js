// pages/class/classCreate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enableSearch: true,
    createClassDisabled: true,
    className: '',
    openid: getApp().globalData.userInfo.openid,
    onCreateClassProcess: false
  },

  inputClassName: function(e) {
    this.setData({ className: e.detail });
    if (e.detail !== '') {
      this.setData({
        createClassDisabled: false
      });
    } else {
      this.setData({
        createClassDisabled: true
      });
    }
  },

  enableSearchOnChange({ detail }) {
    if (this.data.enableSearch === true) {
      wx.showModal({
        title: '提示',
        content: '关闭后其它同学将不能使用班级号搜索并加入班级',
        success: (res) => {
          if (res.confirm) {
            this.setData({ enableSearch: detail });
          }
        },
      });
    } else {
      this.setData({ enableSearch: detail });
    }
  },

  createClass: function(e) {
    var that = this;
    var app = getApp();
    const className = this.data.className;
    const enableSearch = that.data.enableSearch;
    const openid = that.data.openid;
    wx.showModal({
      title: '创建班级',
      content: '您将创建班级：' + className,
      success: (res) => {
        if (res.confirm) {
          that.setData({
            onCreateClassProcess: true
          })
          //调用生成班级id云函数
          wx.cloud.callFunction({
            name: "get_new_classId",
            success:res=>{
              let classId = parseInt(res.result.data[0].classId);
              classId += Math.ceil(Math.random() * 100);  // 随机生成一个大于前一个编号 1-100 的数字
              //调用创建班级云函数
              wx.cloud.callFunction({
                name: "classCreate",
                data: {
                  className: className,
                  enableSearch: enableSearch,
                  openid: openid,
                  classId: classId,
                }
              }).then(function(){
                app.globalData.className = className;
                app.globalData.classSetting.enableSearch = enableSearch;
                app.globalData.classId = classId;
                app.globalData.haveClass = true;
                console.log('Create class successfully.');
                wx.navigateBack();
              })
            }
          })
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