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
    shop: null,
    category: [],
    itemsByCategory: null,
    count: 0,
    amount: 0,
    items: [],
    groupInfo: null,
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
        items: tempOrder.items,

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
    let itemsByCategory = groupBy(this.data.shop.item, 'category')
    this.setData({
      itemsByCategory: itemsByCategory,
      category: Object.keys(itemsByCategory)
    })
    console.log(itemsByCategory, Object.keys(itemsByCategory))
    if (app.globalData.groupInfo) {
      this.setData({ groupInfo: app.globalData.groupInfo })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.tempOrders[this.data.shop.openid] = {
      shop: this.data.shop.openid,
      shopname: this.data.shop.shopname,
      shopavatar: this.data.shop.avatar,
      currency: this.data.shop.currency,
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
      shop: this.data.shop.openid,
      shopname: this.data.shop.shopname,
      shopavatar: this.data.shop.avatar,
      currency: this.data.shop.currency,
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
    let _id = e.currentTarget.id.split(',')
    var id = _id[1], list = this.data.itemsByCategory[_id[0]];
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].name == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    let itemsByCategory = this.data.itemsByCategory
    itemsByCategory[_id[0]] = list
    this.setData({
      itemsByCategory: itemsByCategory
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

  order: function (e) {
    if (this.data.amount > 0) {
      //刷新最新order信息到app全局变量
      app.globalData.tempOrders[this.data.shop.openid] = {
        shop: this.data.shop.openid,
        shopname: this.data.shop.shopname,
        shopavatar: this.data.shop.avatar,
        currency: this.data.shop.currency,
        count: this.data.count,
        amount: this.data.amount,
        items: this.data.items,
      }

      //进入order页面
      wx.navigateTo({
        url: '../order/order?shop=' + this.data.shop.openid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },

  cancelGroup: function () {
    app.globalData.groupInfo = null
    this.setData({
      groupInfo: null
    })
  }
})