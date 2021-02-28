Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_grade_star: [0, 0, 0, 0, 0],
    a_grade_star: [0, 0, 0, 0, 0],
    b_grade_star: [0, 0, 0, 0, 0],
    c_grade_star: [0, 0, 0, 0, 0],

    star: ["img/star_gray.png", "img/star_yellow.png"],    

    total_grade: 0,
    a_grade: 0,
    b_grade: 0,
    c_grade: 0,

    saishi_name: "",
    saishi_place: "",
    saishi_time: "",
    saishi_picture: "",

    iTime: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    //获取赛事的信息
    this.setData({
      saishi_name:e.saishi_name,
      saishi_place:e.saishi_place,
      saishi_picture:e.saishi_picture,
      saishi_time:e.saishi_time
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 评分函数，当用户点击评分项的星形按钮时触发
   */
  grade: function(res) {
    //获取用户的评分和所评项目
    var index = parseInt(res.currentTarget.dataset.index);
    var type = parseInt(res.currentTarget.dataset.type);
    
    //处理评分
    let that = this;
    switch (type) {
      case 0:
        that.data.total_grade = index + 1;
        that.chang_grade("total_grade_star", index);
        break;
      case 1:
        that.data.a_grade = index + 1;
        that.chang_grade("a_grade_star", index);
        break;
      case 2:
        that.data.b_grade = index + 1;
        that.chang_grade("b_grade_star", index);
        break;
      case 3:
        that.data.c_grade = index + 1;
        that.chang_grade("c_grade_star", index);
        break;
    }
  },

  /**
   * 在用户评分后改变被评项目的分数
   * 参数：
   * arr：所评项目
   * index：评分，用于控制星形按钮的颜色
   */
  chang_grade(arr, index) {
    let that = this;
    switch (index) {
      case 0:
        that.setData({
          [arr]: [1, 0, 0, 0, 0]
        })
        break;
      case 1:
        that.setData({
          [arr]: [1, 1, 0, 0, 0]
        })
        break;
      case 2:
        that.setData({
          [arr]: [1, 1, 1, 0, 0]
        })
        break;
      case 3:
        that.setData({
          [arr]: [1, 1, 1, 1, 0]
        })
        break;
      case 4:
        that.setData({
          [arr]: [1, 1, 1, 1, 1]
        })
        break;
    }
  },

  /**
   * 重置按钮的触发函数，将所有已评分数置为0
   **/
  reset: function() {
    this.setData({
      total_grade: 0,
      a_grade: 0,
      b_grade: 0,
      c_grade: 0,
      total_grade_star: [0, 0, 0, 0, 0],
      a_grade_star: [0, 0, 0, 0, 0],
      b_grade_star: [0, 0, 0, 0, 0],
      c_grade_star: [0, 0, 0, 0, 0],
    })
  },

  /**
   * 确定按钮，将评分提交
   **/
  confirm: function() {
    let that = this;
    var all_grade_test = that.data.total_grade * that.data.a_grade * that.data.b_grade * that.data.c_grade;
    var diff_test = that.data.total_grade - (that.data.a_grade + that.data.b_grade + that.data.c_grade) / 3;
    
    //检查用户是否对所有项进行评分，并对比总体评分和各小项的平均分的差距
    //如果两者差别在1.5分以上，要求用户重新评分
    if (all_grade_test == 0) {
      wx.showModal({
        title: '提示',
        content: '请为所有项目评分',
        showCancel: false
      })
      return
    } else {
      if (diff_test > 1.5 || diff_test < -1.5) {
        wx.showModal({
          title: '提示',
          content: '总分与小项结果不符，请重新评分',
          showCancel: false
        })
        return
      }

      //在数据库里添加本评分记录

    }
  },

  /**
   * 确定按钮函数，用于防止用户多次点击导致多次函数触发
   * 本函数确保一秒内的重复点击只执行最后一次点击
   **/
  fn: function (evt) {
    let that = this;
    clearTimeout(this.data.iTime);
    this.setData({
      iTime: setTimeout(that.confirm, 1000)
    })
  },
})