const API_ENDPOINT = 'http://localhost:3000/reko/shop/';
const app = getApp()

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// shop.js
Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    shopInfo: null,
    category: [],
    itemsByCategory: null,
  },

  getShopInfo: function(){
    if (app.globalData.openid) {
      const that = this
      wx.request({
        url: API_ENDPOINT + app.globalData.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {

          const itemsByCategory = groupBy(res.data.item, 'category')
          console.log(itemsByCategory, Object.keys(itemsByCategory))

          that.setData({
            shopInfo: res.data,
            itemsByCategory: itemsByCategory,
            category: Object.keys(itemsByCategory)
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
    if (!app.globalData.shopInfo){
      app.shopInfoReadyCallback = (res) => {
        console.log("Recall Function")
        const itemsByCategory = groupBy(res.data.item, 'category')
        console.log(itemsByCategory, Object.keys(itemsByCategory))

        this.setData({
          shopInfo: res.data,
          itemsByCategory: itemsByCategory,
          category: Object.keys(itemsByCategory)
        })
      }
    }

    // 获取刷新userInfo
    if (app.globalData.userInfo) {
      console.log("userInfo1:", app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("userInfo2:", app.globalData.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log("userInfo3:", app.globalData.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
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
    this.getShopInfo()
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

  itemPage: function (e) {
    var name = e.currentTarget.id;
    wx.navigateTo({
      url: "item/item?name=" + name
    })
  },

  modify: function (e) {
    wx.navigateTo({
      url: './modify/modify?name=' + e.currentTarget.id,
    })
  },

  create: function () {
    wx.navigateTo({
      url: './create/create',
    })
  },

  remove: function (e) {
    let itemList = this.data.shopInfo.item
    itemList = itemList.filter(item => item.name !== e.currentTarget.id)

    let that = this
    wx.showModal({
      content: `点击确认后，【${e.currentTarget.id}】将被从你的店铺中移除`,
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
              //刷新数据
              that.onShow()
              app.globalData.shopInfo.item = itemList
            }
          })
          //updata globalData item info in ShopInfo
          
          //刷新数据
          

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})