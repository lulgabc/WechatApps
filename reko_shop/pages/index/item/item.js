const app = getApp()
const API_ENDPOINT = 'http://localhost:3000/reko/shop';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let itemList = app.globalData.shopInfo.item

    itemList.forEach((item) => {
      if (item.name === options.name) {
        this.setData({ item: item })
      }
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

  create: function () {
    wx.navigateTo({
      url: '../create/create',
    })
  },
  modify: function () {
    wx.navigateTo({
      url: '../modify/modify?name='+this.data.item.name,
    })
  },
  remove: function () {

    let itemList = app.globalData.shopInfo.item
    itemList = itemList.filter(item => item.name !== this.data.item.name)

    let that = this
    wx.showModal({
      content: `点击确认后，【${that.data.item.name}】将被从你的店铺中移除`,
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 调用API删除菜品
          let openid = app.globalData.openid
          wx.request({
            url: API_ENDPOINT + "/" + openid,
            method: "PUT",
            data: { item: itemList },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log("删除一个菜品:", res.statusCode)
            }
          })
          //updata globalData item info in ShopInfo
          app.globalData.shopInfo.item = itemList
          wx.navigateBack({
            delta: 1
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})