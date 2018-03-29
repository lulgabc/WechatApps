const API_ENDPOINT = 'http://localhost:3000/reko/shop';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: null
  },

  // 更新shop基本信息：name,country,province,city,avatar
  updateUserInfo: function (userInfo, shopOpenId) {
    wx.request({
      url: API_ENDPOINT + "/" + shopOpenId,
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
        console.log("跟新店铺userInfo. statusCode:", res.statusCode)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopInfo: app.globalData.shopInfo
    })
    if (app.globalData.userInfo && app.globalData.openid) {
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
    this.setData({
      shopInfo: app.globalData.shopInfo
    })
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

  formSubmit: function (e) {
    let shopChangeInfo = e.detail.value
    shopChangeInfo.category = shopChangeInfo.category.split(',')
    console.log('form发生了submit事件，更新数据为：', shopChangeInfo)

    let openid = app.globalData.openid
    wx.request({
      url: API_ENDPOINT + "/" + openid,
      method: "PUT",
      data: shopChangeInfo,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("更新店铺信息:", res.statusCode)
        wx.showToast({
          title: "更新成功"
        })
      }
    })
  }
})