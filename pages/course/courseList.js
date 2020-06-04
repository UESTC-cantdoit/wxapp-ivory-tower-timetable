// pages/course/courseList.js
const db = wx.cloud.database();
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
    anchorIndexList: [],
    /**
     * courseAnchorIndexList 用于渲染页面
     * todo: 'onReady: function()' 函数体内读取公用课程信息后生成；
     *       每一项应按 anchorIndex 英文字符顺序排序
     */
    courseAnchorIndexList: []
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
    db.collection('courses')
    .where({
      classId: getApp().globalData.classId
    })
    .orderBy('courseName','asc')
    .get().then(res => {
      // console.log('course_res',res)
      //添加课程名称拼音
      var pinyinUtil = require('../../utils/pinyinUtil');
      res.data.forEach(function(course) {
        course.pinyin = pinyinUtil.getFirstLetter(course.courseName);
        course.first_pinyin = pinyinUtil.getFirstLetter(course.courseName).substr(0,1).toUpperCase();
      })
      //按照拼音排序
      var compare = function (course1, course2) {
        var val1 = course1.pinyin;
        var val2 = course2.pinyin;
        if (val1 < val2) {
        return -1;
        } else if (val1 > val2) {
        return 1;
        } else {
        return 0;
        }  
      } 
      // console.log(res.data.sort(compare));
      
      var courseList = [];
      var anchorIndex = [];
      
      for(var i=0;i<26;i++){
        var coursesArr = []; //暂存某一索引下的课程
        var courseExist = false;
        res.data.forEach(function(course) {
          if (course.first_pinyin == String.fromCharCode(65+i)) {
            anchorIndex.push(String.fromCharCode(65+i));
            courseExist = true;
            course.normalAnchor = true;
            course.haveAddedToCourse = false;
            if (0) {
              //TODO 判断是否已经添加到此用户的课程表
            }
            course.ownCourse = false;
            if (course._openid == getApp().globalData.userInfo.openid) {
              course.ownCourse = true;
            }

            coursesArr.push({
                  courseId: course._id,
                  courseName: course.courseName,
                  courseTeacher: course.courseTeacher,
                  haveAddedToCourse: course.haveAddedToCourse,
                  ownCourse: course.ownCourse,
            })
          }
        })
        
        if (courseExist) {
          courseList.push({
            anchorIndex: String.fromCharCode(65+i),
            course: coursesArr
          });
        }
      }
      //处理特殊首字母
      for(let i=res.data.length-1; i>=0; i--){
        if(res.data[i].normalAnchor == true){
            res.data.splice(i,1);
        }
      }
      // console.log(res.data);
      var other_coursesArr = [];
      if (res.data) {
        anchorIndex.push('#');
        res.data.forEach(function(course) {
          course.haveAddedToCourse = false;
          if (0) {
            //TODO 判断是否已经添加到此用户的课程表
          }
          course.ownCourse = false;
          if (course._openid == getApp().globalData.userInfo.openid) {
            course.ownCourse = true;
          }
          other_coursesArr.push({
                  courseId: course._id,
                  courseName: course.courseName,
                  courseTeacher: course.courseTeacher,
                  haveAddedToCourse: course.haveAddedToCourse,
                  ownCourse: course.ownCourse,
            })
        })
        courseList.push({
          anchorIndex: '#',
          course: other_coursesArr
        });
      }
      //索引去重
      function distinct(arr) {
        return Array.from(new Set(arr))
      }
      anchorIndex = distinct(anchorIndex);
      //返回数据
      this.setData({
        anchorIndexList: anchorIndex,
        courseAnchorIndexList: courseList
      })
    })
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