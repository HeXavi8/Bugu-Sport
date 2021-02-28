Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalGradeStar: [0, 0, 0, 0, 0],
    aGradeStar: [0, 0, 0, 0, 0],
    bGradeStar: [0, 0, 0, 0, 0],
    cGradeStar: [0, 0, 0, 0, 0],

    star: ["img/starGray.png", "img/starYellow.png"],    

    totalGrade: 0,
    aGrade: 0,
    bGrade: 0,
    cGrade: 0,

    saishiName: "",
    saishiPlace: "",
    saishiTime: "",
    saishiPicture: "",

    iTime: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    //获取赛事的信息
    this.setData({
      saishiName:e.saishiName,
      saishiPlace:e.saishiPlace,
      saishiPicture:e.saishiPicture,
      saishiTime:e.saishiTime
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
        that.data.totalGrade = index + 1;
        that.changGrade("totalGrade_star", index);
        break;
      case 1:
        that.data.aGrade = index + 1;
        that.changGrade("aGradeStar", index);
        break;
      case 2:
        that.data.bGrade = index + 1;
        that.changGrade("bGradeStar", index);
        break;
      case 3:
        that.data.cGrade = index + 1;
        that.changGrade("cGradeStar", index);
        break;
    }
  },

  /**
   * 在用户评分后改变被评项目的分数
   * 参数：
   * arr：所评项目
   * index：评分，用于控制星形按钮的颜色
   */
  changGrade(arr, index) {
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
      totalGrade: 0,
      aGrade: 0,
      bGrade: 0,
      cGrade: 0,
      totalGradeStar: [0, 0, 0, 0, 0],
      aGradeStar: [0, 0, 0, 0, 0],
      bGradeStar: [0, 0, 0, 0, 0],
      cGradeStar: [0, 0, 0, 0, 0],
    })
  },

  /**
   * 确定按钮，将评分提交
   **/
  confirm: function() {
    let that = this;
    var allGradeTest = that.data.totalGrade * that.data.aGrade * that.data.bGrade * that.data.cGrade;
    var diffTest = that.data.totalGrade - (that.data.aGrade + that.data.bGrade + that.data.cGrade) / 3;
    
    //检查用户是否对所有项进行评分，并对比总体评分和各小项的平均分的差距
    //如果两者差别在1.5分以上，要求用户重新评分
    if (allGradeTest == 0) {
      wx.showModal({
        title: '提示',
        content: '请为所有项目评分',
        showCancel: false
      })
      return
    } else {
      if (diffTest > 1.5 || diffTest < -1.5) {
        wx.showModal({
          title: '提示',
          content: '总分与小项结果不符，请重新评分',
          showCancel: false
        })
        return
      }

      //在数据库里添加本评分记录
      wx.cloud.callFunction({
        name: "saishiGrade",
        data: {
          matchName: that.data.saishiName,
          totalGrade: that.data.totalGrade,
          aGrade: that.data.aGrade,
          bGrade: that.data.bGrade,
          cGrade: that.data.cGrade
        },
        success: function(res) {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: '评价成功',
            showCancel: false
          })
        },
        fail: function(res) {
          console.log(res);
        }
      })
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
})})
