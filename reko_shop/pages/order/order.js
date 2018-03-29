var util = require('../../utils/util.js');

const API_ENDPOINT = 'http://localhost:3000/reko/order';
const app = getApp()

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: app.globalData.status,
    orderByDate: null,
    dateList: [],
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },

  getOrders: function () {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: API_ENDPOINT + '/shop/' + app.globalData.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          const orderByDate = groupBy(res.data, 'date')
          const dateList = Object.keys(orderByDate)
          that.setData({
            orderByDate: orderByDate,
            dateList: dateList
          })
          console.log('get orderByDate:', orderByDate, dateList)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  changeOrderStatus: function(orderId, newStatus) {
    wx.request({
      url: API_ENDPOINT + "/" + orderId,
      method: "PUT",
      data: { status: newStatus },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("更新订单:",orderId," 状态To:",newStatus,"statusCode:", res.statusCode)
      }
    })
  },

  onLoad: function (options) {
    this.getOrders()
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
    this.getOrders()
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
    this.getOrders()
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

  showDetail: function (e) {
    let data = e.currentTarget.id.split(',')
    let date = data[0]

    var id = data[1], list = this.data.orderByDate[date];
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }

    let orderByDate = this.data.orderByDate
    orderByDate[date] = list
    this.setData({
      orderByDate: orderByDate
    });
  },

  accept: function (e) {
    this.changeOrderStatus(e.currentTarget.id, 1)
    this.getOrders()
  },

  wait: function (e){
    this.changeOrderStatus(e.currentTarget.id, 0)
    this.getOrders()
  },

  refuse: function (e) {
    this.changeOrderStatus(e.currentTarget.id, 4)
    this.getOrders()
  },

  send: function (e) {
    this.changeOrderStatus(e.currentTarget.id, 2)
    this.getOrders()
  },

  finish: function(e){
    this.changeOrderStatus(e.currentTarget.id, 3)
    this.getOrders()
  }
})