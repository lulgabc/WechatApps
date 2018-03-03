//index.js
//获取应用实例
const app = getApp()

// shop.js
Page({

  data: {
    itemList: null,
    hasItemList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.shopInfo && !this.hasItemList) {
      this.setData({
        itemList: app.globalData.shopInfo.item,
        hasItemList: true
      })
    } else if (!this.hasItemList) {
      app.shopInfoReadyCallback = (res) => {
        console.log("Recall Function")
        this.setData({
          itemList: app.globalData.shopInfo.item,
          hasItemList: true
        })
      }
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
    if (app.globalData.shopInfo) {
      this.setData({
        itemList: app.globalData.shopInfo.item,
        hasItemList: true
      })
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
    if (app.globalData.shopInfo) {
      this.setData({
        itemList: app.globalData.shopInfo.item,
        hasItemList: true
      })
    }
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

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.itemList;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].name == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      itemList: list
    });
  },

  itemPage: function (e) {
    var name = e.currentTarget.id;
    wx.navigateTo({
      url: "item/item?name=" + name
    })
  }

})