const API_ENDPOINT = 'http://localhost:3000/reko/shop';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    categoryList: [],
    category: "其它"
  },

  getItemInfo: function (itemName) {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: API_ENDPOINT + "/" + app.globalData.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          let shopInfo = res.data
          let itemList = shopInfo.item
          itemList.forEach((item) => {
            if (item.name === itemName) {
              that.setData({
                item: item,
                categoryList: shopInfo.category,
                category: item.category
              })
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getItemInfo(options.name)
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
    if (this.data.item) {
      this.getItemInfo(this.data.item.name)
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
    console.log("NEW Category:", this.data.categoryList[e.detail.value])
    this.setData({
      category: this.data.categoryList[e.detail.value]
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    //remove old item
    let itemList = app.globalData.shopInfo.item
    itemList = itemList.filter(item => item.name !== this.data.item.name)

    //update 
    let newItem = this.data.item
    Object.keys(e.detail.value).forEach(key => {
      newItem[key] = e.detail.value[key]
    })
    newItem.category = this.data.category

    //类型修正
    newItem.price = Number(newItem.price)
    newItem.promoprice = Number(newItem.promoprice)

    //add new item
    itemList.push(newItem)

    console.log("new itemlist:", itemList)
    let openid = app.globalData.openid
    wx.request({
      url: API_ENDPOINT + "/" + openid,
      method: "PUT",
      data: { item: itemList },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("更新一个菜品:", res.statusCode)
        wx.showToast({
          title: "更新成功"
        })
      }
    })
    //刷新小程序的shopInfo
    app.globalData.shopInfo.item = itemList
    wx.navigateBack({
      delta: 2
    })
  },
})