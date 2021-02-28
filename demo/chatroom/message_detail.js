let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    scrollTop: 0,
    message: "",
    previewImgList: [],
    id: "",
    receiverId: "",
    name: "",
    picture: "",
    index: 0,
    content: "",
    toView: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    let index = e.index;                          //获取消息的索引
    let that = this;
    this.setData({
      id: app.globalData.id,                      //用户的openId
      name: app.globalData.name,                  //用户的名称
      picture: app.globalData.userimgID,          //用户的头像
      newslist: app.globalData.message[index],    //用户与对方的聊天记录
      index: e.index
    })

    //查看第一条消息，获取聊天对方的openId
    if (app.globalData.message[index][0].sender != app.globalData.id) { //发送者不是本用户则为对方用户
      that.setData({
        receiverId: app.globalData.message[index][0].sender
      })
    } else { //对方为该消息的接收者
      that.setData({
        receiverId: app.globalData.message[index][0].receiver
      })
    }

    //设置页面标题
    wx.setNavigationBarTitle({
      title: e.receiverName,
    })

    //监听新消息
    app.watch(that.watchBack);
    this.bottom();
  },

  /**
   * 监听是否收到新消息
   **/
  watchBack: function(value) {
    let that = this;
    let index = app.globalData.comUserList.indexOf(that.data.receiverId);
    this.setData({
      index: index,
      newslist: value[index]
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

    //处理已读的消息

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
   * 消息发送函数，在发送按钮被点击时触发
   * 消息包括发送者openId，名称，头像，消息内容，发送时间，接收者openId
   **/
  sendMessage: function() {
    //创建时间对象
    var date = new Date();
    let that = this;
    //检查消息内容是否为空
    if (that.data.content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入消息内容',
        showCancel: false,
      })
      return;
    }
    //在数据库里添加该消息
    wx.cloud.database().collection("xxx").add({    //这里填入数据库表名称
      data: {
        content: that.data.content,
        sender: that.data.id,
        receiver: that.data.receiverId,
        isread: false,
        time: date,
        name: that.data.name,
        picture: that.data.picture,
      },
      success: function(res) {
        that.setData({
          content: ""
        })
        that.bottom()
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 监听用户输入的内容
   **/
  bindChange: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 聊天消息始终显示最底端
   **/
  bottom: function() {
    var query = wx.createSelectorQuery()
    let that = this;
    query.select('#flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      wx.pageScrollTo({
        scrollTop: res[1].scrollHeight + 500    
      })
      res[1].scrollTop                          // 显示区域的竖直滚动位置
    })
  },


  /**
   * 跳转到自己的个人中心
   **/
  toMyself: function() {
    let that = this;
    wx.navigateTo({
      url: '../../userinfo/userinfo?_openid=' + that.data.id,
    })
  },

  /**
   * 跳转到对方的个人中心
   **/
  toYou: function() {
    let that = this;
    wx.navigateTo({
      url: '../../userinfo/userinfo?_openid=' + that.data.receiverId,
    })
  }
})