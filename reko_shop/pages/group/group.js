const ORDERGROUP_API_ENDPOINT = 'http://localhost:3000/reko/ordergroup';
const ORDER_API_ENDPOINT = 'http://localhost:3000/reko/order';

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
    date: null,
    steps: null,
    show: false,
    groupOrders: null,
    orderByGroup: null,
    status: app.globalData.status,
  },

  getGroupOrders: function () {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: ORDERGROUP_API_ENDPOINT + '/' + app.globalData.openid,
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

  getOrders: function () {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: ORDER_API_ENDPOINT + '/shop/' + app.globalData.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          const orderByGroup = groupBy(res.data, 'groupid')
          that.setData({
            orderByGroup: orderByGroup,

          })
          console.log('get orderByGroup:', orderByGroup)
        }
      })
    }
  },

  updateGroupOrders: function (id, data) {
    wx.request({
      url: API_ENDPOINT + '/' + id,
      method: "PUT",
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: function (res) {
        console.log('update groupOrders:', res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    this.setData({
      date: date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate()
    })

    this.getGroupOrders()

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

  show: function () { this.setData({ show: true }) },

  clear: function () { this.setData({ show: false, steps: null }) },

  removeLast: function () {
    let steps = this.data.steps
    steps.pop()
    this.setData({
      steps: steps
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log(e.detail.value)
    let steps = this.data.steps ? this.data.steps : []
    steps.push({
      time: e.detail.value.time,
      place: e.detail.value.place,
      index: steps.length,
    })
    this.setData({
      steps: steps,
      t: "",
      p: ""
    })
  },

  publish: function () {
    let orderGroup = {
      shop: app.globalData.shopInfo.openid,
      shopname: app.globalData.shopInfo.shopname,
      shopavatar: app.globalData.shopInfo.avatar,
      date: this.data.date,
      about: "",
      open: true,
      visible: true,
      steps: this.data.steps
    }
    console.log("orderGroup:", orderGroup)

    wx.request({
      url: API_ENDPOINT,
      method: "POST",
      data: orderGroup,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("新建一个跟单:", res.statusCode)
      }
    })
    this.onShow()
    this.setData({ show: false, steps: null })
  },

  close: function (e) {
    this.updateGroupOrders(e.currentTarget.id, { open: false })
    this.onShow()
  },

  hide: function (e) {
    this.updateGroupOrders(e.currentTarget.id, { visible: false })
    this.onShow()
  }
})