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
    courseAnchorIndexList: [],
    onLoadingStatus: true // 未加载完之前不显示页面
  },

  createCourse() {
    wx.navigateTo({
      url: 'courseCreate'
    })
  },

  addToCourse(e) {
    console.log(e);
    const courseId = e.currentTarget.dataset.courseid;
    //将目标课程添加到课程表中
    //查询数据
    db.collection('courses').doc(courseId).get().then( res => {
      console.log(res)
      db.collection('courses').add({
        data: {
          courseName: res.data.courseName,
          courseTeacher: res.data.courseTeacher,
          coursePlace: res.data.coursePlace,
          courseTime: res.data.courseTime,
          classId: res.data.classId,
          pre_id: courseId,
        }
      })
      //定位课程数据
      let anchorIndex = -1;
      let courseIndex = -1;
      for (let i = 0; i < this.data.courseAnchorIndexList.length; i++) {
        anchorIndex = i;
        const anchor = this.data.courseAnchorIndexList[i];
        courseIndex = anchor.course.findIndex( course => {
            return course.courseId == courseId
        })
        if (courseIndex != -1) {
          break;
        }
      }
      //设置 haveAddedToCourse 为 true
      this.setData({
        [`courseAnchorIndexList[${anchorIndex}].course[${courseIndex}].haveAddedToCourse`]: true
      })
    })
  },

  removeFromCourse(e) {
    const courseId = e.currentTarget.dataset.courseid;
    //云数据库操作
    try {
      db.collection('courses').where({
        _openid: getApp().globalData.userInfo.openid,
        pre_id: courseId
      }).remove()
    } catch(e) {
      console.error(e)
    }
    //数据回显
    //定位课程数据
    let anchorIndex = -1;
    let courseIndex = -1;
    for (let i = 0; i < this.data.courseAnchorIndexList.length; i++) {
      anchorIndex = i;
      const anchor = this.data.courseAnchorIndexList[i];
      courseIndex = anchor.course.findIndex( course => {
          return course.courseId == courseId
      })
      if (courseIndex != -1) {
        break;
      }
    }
    //设置 haveAddedToCourse 为 false
    this.setData({
      [`courseAnchorIndexList[${anchorIndex}].course[${courseIndex}].haveAddedToCourse`]: false
    })
  },

  modifyCourse(e) {
    const courseId = e.currentTarget.dataset.courseid;
    console.log(courseId)
    wx.navigateTo({
      url: 'courseModify?courseId=' + courseId
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
    this.getData();
    getApp().globalData.courseList = true;
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
    this.getData();
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
    db.collection('courses')
    .where(db.command.or([
      {
        classId: getApp().globalData.classId,
        pre_id: db.command.exists(false)
      },
      {
        _openid: getApp().globalData.userInfo.openid,
        pre_id: db.command.exists(true)
      }
    ]))
    .orderBy('courseName','asc')
    .get().then(res => {
      // console.log('course_res',res.data)
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
      //按照字母顺序处理数据
      for(var i=0;i<26;i++){
        var coursesArr = []; //暂存某一索引下的课程
        var pre_coursesArr = [];
        var courseExist = false;
        res.data.forEach(function(course) {
          if (course.first_pinyin == String.fromCharCode(65+i)) {
            anchorIndex.push(String.fromCharCode(65+i));
            courseExist = true;
            course.normalAnchor = true;
            //分离原生课程与同步派生课程
            if (course._openid == getApp().globalData.userInfo.openid) {
              if (course.pre_id) {
                console.log("##")
                pre_coursesArr.push({
                  pre_id: course.pre_id
                })
              }else {
                course.haveAddedToCourse = true;
                course.ownCourse = true;
                coursesArr.push({
                  courseId: course._id,
                  courseName: course.courseName,
                  courseTeacher: course.courseTeacher,
                  haveAddedToCourse: course.haveAddedToCourse,
                  ownCourse: course.ownCourse,
                })
              }
            }else {
              course.haveAddedToCourse = false;
              course.ownCourse = false;
              coursesArr.push({
                courseId: course._id,
                courseName: course.courseName,
                courseTeacher: course.courseTeacher,
                haveAddedToCourse: course.haveAddedToCourse,
                ownCourse: course.ownCourse,
              })
            }
            //判断是否已添加到课程表
            for (let i = 0; i < pre_coursesArr.length; i++) {
              const pre_id = pre_coursesArr[i].pre_id;
              for (let j = 0; j < coursesArr.length; j++) {
                if (coursesArr[j].courseId == pre_id) {
                  coursesArr[j].haveAddedToCourse = true;
                }
              }
            }
          }
        })
        //单个索引数据处理完成 推送至总课程列表
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
      var pre_coursesArr = [];
      if (res.data) {
        res.data.forEach(function(course) {
          //分离原生课程与同步派生课程
          if (course._openid == getApp().globalData.userInfo.openid) {
            if (course.pre_id) {
              pre_coursesArr.push({
                pre_id: course.pre_id
              })
            }else {
              course.haveAddedToCourse = true;
              course.ownCourse = true;
              other_coursesArr.push({
                courseId: course._id,
                courseName: course.courseName,
                courseTeacher: course.courseTeacher,
                haveAddedToCourse: course.haveAddedToCourse,
                ownCourse: course.ownCourse,
              })
            }
          }else {
            course.haveAddedToCourse = false;
            course.ownCourse = false;
            other_coursesArr.push({
              courseId: course._id,
              courseName: course.courseName,
              courseTeacher: course.courseTeacher,
              haveAddedToCourse: course.haveAddedToCourse,
              ownCourse: course.ownCourse,
            })
          }
          //判断是否已添加到课程表
          for (let i = 0; i < pre_coursesArr.length; i++) {
            const pre_id = pre_coursesArr[i].pre_id;
            for (let j = 0; j < other_coursesArr.length; j++) {
              if (other_coursesArr[j].courseId == pre_id) {
                other_coursesArr[j].haveAddedToCourse = true;
              }
            }
          }
        })
        if (other_coursesArr.length != 0) {
          anchorIndex.push('#');
          courseList.push({
            anchorIndex: '#',
            course: other_coursesArr
          });
        }
      }
      //索引去重
      function distinct(arr) {
        return Array.from(new Set(arr))
      }
      anchorIndex = distinct(anchorIndex);
      //返回数据
      this.setData({
        anchorIndexList: anchorIndex,
        courseAnchorIndexList: courseList,
        onLoadingStatus: false
      })
      wx.stopPullDownRefresh();
    })
  },
})