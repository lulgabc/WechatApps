const API_ENDPOINT = 'http://localhost:3000/reko/order';
const app = getApp()

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clientInfo: {},
    orderByDate: null,
    dateList:[],
    status: app.globalData.status
  },

  //事件处理函数
  getOrders: function() {
    if (app.globalData.openid) {
      let that = this
      wx.request({
        url: API_ENDPOINT + '/client/' + app.globalData.clientInfo.openid,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //过滤掉已完成的订单           
          const activeOrder = res.data.filter(order => order.status !== 3)

          let orderByDate = groupBy(activeOrder, 'date')
          let dateList = Object.keys(orderByDate)
          that.setData({
            orderByDate: orderByDate,
            dateList: dateList
          })
          console.log('get orderByDate:', orderByDate, dateList)
        }
      })
    }
  },

  onLoad: function () {
    if (app.globalData.clientInfo) {
      this.setData({
        clientInfo: app.globalData.clientInfo
      })

      this.getOrders()

    } else {
      //加入 callback
      app.clientInfoReadyCallback = res => {
        this.setData({
          clientInfo: res.data
        })

        this.getOrders

        //获取order 
        
        let that = this
        wx.request({
          url: API_ENDPOINT + '/client/' + app.globalData.clientInfo.openid,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //过滤掉已完成的订单           
            const activeOrder = res.data.filter(order => order.status !== 3)

            let orderByDate = groupBy(activeOrder, 'date')
            let dateList = Object.keys(orderByDate)
            that.setData({
              orderByDate: orderByDate,
              dateList: dateList
            })
            console.log('get orderByDate2:', activeOrder, dateList)
          }
        })
      }
    }

    if (app.globalData.userInfo) {
      console.log("userInfo1")
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("userInfo2")
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log("userInfo3")
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }

  },

  onShow: function () {
    //刷新order
    this.getOrders()
  },

  showDetail: function (e) {
    let data = e.currentTarget.id.split(',')
    let date = data[0]
    
    var id = data[1], list = this.data.orderByDate[date];
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }

    let orderByDate = this.data.orderByDate
    orderByDate[date] = list
    this.setData({
      orderByDate: orderByDate
    });
  },

  changeOrderStatus: function (orderId, newStatus) {
    wx.request({
      url: API_ENDPOINT + "/" + orderId,
      method: "PUT",
      data: { status: newStatus },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("更新订单:", orderId, " 状态To:", newStatus, "statusCode:", res.statusCode)
      }
    })
  },

  remove: function(e) {
    wx.request({
      url: API_ENDPOINT + "/" + e.currentTarget.id,
      method: "DELETE",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("删除订单:", e.currentTarget.id, "statusCode:", res.statusCode)
      }
    })
    this.onLoad()
  },

  finish: function (e) {
    this.changeOrderStatus(e.currentTarget.id, 3)
    this.onLoad()
  },

})
