var util = require('../../../utils/util.js');

const API_ENDPOINT = 'http://localhost:3000/reko/order';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: null,
    order: null,
    date: '',
    time: '12:01',
    where: null,
    groupInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    app.globalData.shopList.forEach(item => {
      if (item.openid === options.shop) {
        this.setData({
          shop: item,
          date: date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate()
        })
      }
    })

    let order = app.globalData.tempOrders[options.shop]
    this.setData({
      order: order
    })
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
    if (app.globalData.groupInfo) {
      this.setData({ groupInfo: app.globalData.groupInfo })
    }
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

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindInputChange: function (e) {
    this.setData({ where: e.detail.value })
  },

  send: function () {
    let order = this.data.order
    let groupInfo = app.globalData.groupInfo

    order.client = app.globalData.openid
    order.clientname = app.globalData.clientInfo.name
    order.clientavatar = app.globalData.clientInfo.avatar
    order.timestamp = Date.now()
    order.status = 0
    order.rmb = 0.0
    order.date = groupInfo ? groupInfo.group.date : this.data.date
    order.time = groupInfo ? groupInfo.group.steps[groupInfo.step].time : this.data.time
    order.where = groupInfo ? groupInfo.group.steps[groupInfo.step].place : this.data.where
    order.groupid = groupInfo ? groupInfo.group._id : ""
    order.groupstep = groupInfo ? groupInfo.step : -1

    console.log(order)

    wx.request({
      url: API_ENDPOINT,
      data: order,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("Create a new order")
        console.log(res.data)
        //清除跟单信息
        app.globalData.groupInfo = null
      }
    })

    wx.switchTab({
      url: '../../index/index'
    })
  }
})

