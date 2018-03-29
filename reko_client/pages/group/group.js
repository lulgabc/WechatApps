const API_ENDPOINT = 'http://localhost:3000/reko/ordergroup';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupOrders: null
  },

  getGroupOrders: function () {
    if (app.globalData.shopList) {
      let that = this
      wx.request({
        url: API_ENDPOINT,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            groupOrders: res.data
          })
          console.log('get groupOrders:', res.data)
        }
      })
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
    this.getGroupOrders()
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

  },

  engage: function (e){
    
    const data = e.currentTarget.id.split(',')

    let selected = {}
    this.data.groupOrders.forEach((og)=>{selected = og._id == data[1]? og : null })

    app.globalData.groupInfo = {
      step: parseInt(data[2]),
      group: selected
    }
    console.log("选择跟单：",app.globalData.groupInfo)
    wx.navigateTo({
      url: "../shops/shop/shop?openid=" + data[0]
    })
  }
})