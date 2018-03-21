const API_ENDPOINT = 'http://localhost:3000/reko/shop';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: null,
    itemList: null,
    category: "其它"
  },

  getShopInfo: function () {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: API_ENDPOINT + "/" + app.globalData.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            shopInfo: res.data,
            itemList: res.data.item
          })
          console.log('get shopInfo:', res.data)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopInfo()
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
    this.getShopInfo()
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

  bindCategoryChange: function (e) {
    console.log("NEW Category:", this.data.shopInfo.category[e.detail.value])
    this.setData({
      category: this.data.shopInfo.category[e.detail.value]
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let newItem = e.detail.value

    //更新修正
    newItem.price = Number(newItem.price)
    newItem.promoprice = Number(newItem.promoprice)
    newItem.category = this.data.category

    let itemList = this.data.itemList
    itemList.push(newItem)

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

    wx.navigateBack({
      delta: 2
    })
  },

  formReset: function (e) {

  }
})

