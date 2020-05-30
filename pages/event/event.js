// pages/event/event.js
// 滑动手势处理 https://www.jianshu.com/p/d4bb2f8eedc3
let minOffset = 30; //最小偏移量，低于这个值不响应滑动处理
let minTime = 60; // 最小时间，单位：毫秒，低于这个值不响应滑动处理
let startX = 0; //开始时的X坐标
let startY = 0; //开始时的Y坐标
let startTime = 0; //开始时的毫秒数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0
  },

  /**
   * 触摸事件开始，初始化startX、startY和startTime
   */
  touchStart: function (e) {
    console.log('touchStart', e)
    startX = e.touches[0].pageX; // 获取触摸时的x坐标  
    startY = e.touches[0].pageY; // 获取触摸时的x坐标
    startTime = new Date().getTime(); //获取毫秒数
  },

  /**
   * 触摸事件取消（手指触摸动作被打断，如来电提醒，弹窗），将startX、startY和startTime重置
   */
  touchCancel: function (e) {
    startX = 0;//开始时的X坐标
    startY = 0;//开始时的Y坐标
    startTime = 0;//开始时的毫秒数
  },

  /**
   * 触摸事件结束
   */
  touchEnd: function (e) {
    console.log('touchEnd', e)
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var touchTime = new Date().getTime() - startTime;//计算滑动时间
    //开始判断
    //1.判断时间是否符合
    if (touchTime >= minTime) {
      //2.判断偏移量：分X、Y
      var xOffset = endX - startX;
      var yOffset = endY - startY;
      console.log('xOffset', xOffset)
      console.log('yOffset', yOffset)
      //①条件1（偏移量x或者y要大于最小偏移量）
      //②条件2（可以判断出是左右滑动还是上下滑动）
      if (Math.abs(xOffset) >= Math.abs(yOffset) && Math.abs(xOffset) >= minOffset) {
        //左右滑动
        //③条件3（判断偏移量的正负）
        if (xOffset < 0) {
          console.log('向左滑动')
        } else {
          console.log('向右滑动')
        }
      } else if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
        //上下滑动
        //③条件3（判断偏移量的正负）
        if (yOffset < 0) {
          console.log('向上滑动')
        } else {
          console.log('向下滑动')
        }
      }
    } else {
      console.log('滑动时间过短', touchTime)
    }
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