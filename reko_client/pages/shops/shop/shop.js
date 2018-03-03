const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: null,
    count: 0,
    amount: 0,
    items: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopList = app.globalData.shopList
    shopList.forEach(item => {
      if (item.openid === options.openid) {
        this.setData({ shop: item })
      }
    })
    let tempOrder = app.globalData.tempOrders[this.data.shop.openid]
    if (tempOrder) {
      this.setData({
        count: tempOrder.count,
        amount: tempOrder.amount,
        items: tempOrder.items
      })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.tempOrders[this.data.shop.openid] = {
      shopOpenId: this.data.shop.openid,
      count: this.data.count,
      amount: this.data.amount,
      items: this.data.items
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.tempOrders[this.data.shop.openid] = {
      shopOpenId: this.data.shop.openid,
      count: this.data.count,
      amount: this.data.amount,
      items: this.data.items
    }
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

  detail: function (e) {
    var id = e.currentTarget.id, list = this.data.shop.item;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].name == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    let shop = this.data.shop
    shop.item = list
    this.setData({
      shop: shop
    });
  },

  add: function (e) {
    let itemList = this.data.shop.item
    let items = this.data.items

    itemList.forEach((item) => {
      if (e.currentTarget.id === item.name) {
        items.push(item)
        this.setData({
          count: this.data.count + 1,
          amount: this.data.amount + item.price,
          items: items,
        })
      }
    })
  },

  remove: function (e) {
    let items = this.data.items
    for (var i = 0, len = items.length; i < len; ++i) {
      if (items[i].name === e.currentTarget.id) {
        let price = items[i].price
        items.splice(i, 1)
        this.setData({
          count: this.data.count == 0 ? 0 : this.data.count - 1,
          amount: this.data.count == 0 ? 0 : this.data.amount - price,
          items: items
        })
        break
      }
    }
  },

  order: function(e){
    if(this.data.amount > 0){
      //刷新最新order信息到app全局变量
      app.globalData.tempOrders[this.data.shop.openid] = {
        shopOpenId: this.data.shop.openid,
        count: this.data.count,
        amount: this.data.amount,
        items: this.data.items
      }

      //进入order页面
      wx.navigateTo({
        url: '../order/order?shopOpenId=' + this.data.shop.openid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  }
})