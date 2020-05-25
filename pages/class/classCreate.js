// pages/class/classCreate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enableSearch: true,
    enableAnnouncement: true,
    createClassDisabled: true,
    className: '',
    classId:0,
    openid:"",
    userinfo:{}, //测试用临时用户信息
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
        content: '关闭后将不能用班级号搜索班级',
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

  enableAnnouncementOnChange({ detail }) {
    if (this.data.enableAnnouncement === true) {
      wx.showModal({
        title: '提示',
        content: '关闭后将不能创建所有同学共享的“公告”公用日程',
        success: (res) => {
          if (res.confirm) {
            this.setData({ enableAnnouncement: detail });
          }
        },
      });
    } else {
      this.setData({ enableAnnouncement: detail });
    }
  },

  createClass: function(e) {
    wx.showModal({
      title: '创建班级',
      content: '您将创建班级：' + this.data.className,
      success: (res) => {
        if (res.confirm) {
          const _this = this;
          //调用生成班级id云函数
          wx.cloud.callFunction({
            name: "get_new_classId",
            success:res=>{
              console.log("res",res)
              _this.setData({
                classId : parseInt(res.result.data[0].classId) + 1
              })
              console.log("classId",_this.data.classId);
              //调用创建班级云函数
              wx.cloud.callFunction({
                name: "classCreate",
                data: {
                  className:_this.data.className,
                  enableSearch: _this.data.enableSearch,
                  enableAnnouncement: _this.data.enableAnnouncement,
                  openid: _this.data.openid,
                  classId: _this.data.classId,
                }
              })
            }
          })
          console.log('Crate class successfully.');
        } else {
          console.log('Cancel.');
        }
      },
    });
  },

//临时登录 
  onGotUserInfo:function(e){
    const that = this;
    wx.cloud.callFunction({
      name:"get_openid",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          openid:res.result.openid,
          userinfo: e.detail.userInfo
        })
        that.data.userinfo.openid = that.data.openid
        console.log("userinfo", that.data.userinfo)
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
//测试用代码段



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