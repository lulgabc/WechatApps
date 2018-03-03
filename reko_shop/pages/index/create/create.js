const API_ENDPOINT = 'http://localhost:3000/reko/shop';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let itemList = app.globalData.shopInfo.item
    this.setData({
      itemList: itemList
    })
    console.log(this.data.itemList)
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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let itemList = this.data.itemList
    itemList.push(e.detail.value)
    console.log(itemList)
    let openid = app.globalData.openid
    wx.request({
      url: API_ENDPOINT + "/" + openid,
      method: "PUT",
      data: { item: itemList },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("新建一个菜品:", res.statusCode)
      }
    })
    //updata globalData item info in ShopInfo
    app.globalData.shopInfo.item = itemList
    wx.navigateBack({
      delta: 2
    })
  },

  formReset: function (e) {

  }
})

