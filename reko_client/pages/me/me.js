const app = getApp()
const API_ENDPOINT = 'http://localhost:3000/reko/order';

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Page({

  data: {
    orderByDate: null,
    dateList: [],
    status: app.globalData.status,
    steps: [
      {
        current: true,
        done: true,
        text: '等待'
      },
      {
        done: true,
        current: true,
        text: '接受'
      },
      {
        done: true,
        current: false,
        text: '送出'
      },
      {
        done: true,
        current: true,
        text: '完成'
      }
    ]
  },

  // 更新client基本信息：name,country,province,city,avatar
  updateUserInfo: function (userInfo, clientOpenId) {
    wx.request({
      url: "http://localhost:3000/reko/client/" + clientOpenId,
      method: "PUT",
      data: {
        name: userInfo.nickName,
        country: userInfo.country,
        city: userInfo.city,
        province: userInfo.province,
        avatar: userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("跟新客户userInfo. statusCode:", res.statusCode)
      }
    })
  },

  getOrders: function () {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: API_ENDPOINT + '/client/' + app.globalData.clientInfo.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //过滤掉已完成的订单           
          const finishOrder = res.data.filter(order => order.status == 3)

          let orderByDate = groupBy(finishOrder, 'date')
          let dateList = Object.keys(orderByDate)
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

  onLoad: function (options) {
    if (app.globalData.openid && app.globalData.userInfo){
      this.updateUserInfo(app.globalData.userInfo, app.globalData.openid)
    }
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


})