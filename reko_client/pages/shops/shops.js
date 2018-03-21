const SHOP_ENDPOINT = 'http://localhost:3000/reko/shop';
const CLIENT_ENDPOINT = 'http://localhost:3000/reko/client';

const app = getApp();

Page({

  data: {
    shopList: null,
    clientInfo: app.globalData.clientInfo,
    likeshop: [],
    nolikeshop: []
  },

  getInfo: function () {
    let that = this
    wx.request({
      url: CLIENT_ENDPOINT + "/" + app.globalData.openid,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          clientInfo: res.data,
        })

        //get shops
        wx.request({
          url: SHOP_ENDPOINT,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            const shopList = res.data.filter(shop => shop.open)
            app.globalData.shopList = shopList

            let likeshop = []
            let nolikeshop = []
            shopList.map(shop => {
              if (that.data.clientInfo.likeshop.includes(shop.openid)) {
                likeshop.push(shop)
              } else {
                nolikeshop.push(shop)
              }
            })

            that.setData({
              likeshop: likeshop,
              nolikeshop: nolikeshop,
              shopList: res.data,
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
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
    this.getInfo()
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
    this.getShops()
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

  likeToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.likeshop;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].openid == id) {
        list[i].show = !list[i].show
      } else {
        list[i].show = false
      }
    }
    this.setData({
      likeshop: list
    });
  },

  nolikeToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.nolikeshop;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].openid == id) {
        list[i].show = !list[i].show
      } else {
        list[i].show = false
      }
    }
    this.setData({
      nolikeshop: list
    });
  },

  shopPage: function (e) {
    wx.navigateTo({
      url: "shop/shop?openid=" + e.currentTarget.id
    })
  },

  addLike: function (e) {
    let likeshop = this.data.clientInfo.likeshop
    likeshop.push(e.currentTarget.id)

    wx.request({
      url: CLIENT_ENDPOINT + "/" + app.globalData.openid,
      method: "PUT",
      data: { likeshop: likeshop },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("添加likeshop", "statusCode:", res.statusCode)
      }
    })

    this.onShow()
  },

  removeLike: function (e) {
    let likeshop = this.data.clientInfo.likeshop
    likeshop.splice(likeshop.indexOf(e.currentTarget.id), 1)

    wx.request({
      url: CLIENT_ENDPOINT + "/" + app.globalData.openid,
      method: "PUT",
      data: { likeshop: likeshop },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("删除likeshop", "statusCode:", res.statusCode)
      }
    })

    this.onShow()
  },

})