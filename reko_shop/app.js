const API_ENDPOINT = 'http://localhost:3000/reko/shop';

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 微信登录，获得openid，查询店铺是否存在，新建店铺
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxfa676ccaff7c302f&secret=8355c761aa7fc4f9fa54b214c6b694b9&js_code=' + res.code,
            method: 'POST',
            data: {
              grant_type: 'authorization_code'
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              this.globalData.openid = res.data.openid
              this.globalData.session_key = res.data.session_key

              const openid = res.data.openid
              const that = this
              //查询Shop是否存在
              wx.request({
                url: API_ENDPOINT + "/" + openid,
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  //店铺不存在
                  if (res.statusCode == 400) {
                    console.log("新用户，没有店铺信息", openid)
                    wx.request({
                      url: API_ENDPOINT,
                      data: {
                        openid: openid,
                        shopname: "美食小店ABC",
                        about:"小店特色",
                        address:"小店的地址",
                        avatar:"",
                        category:["猪肉","牛肉","其它"],
                        city:"城市",
                        contact:"小店联系人",
                        country:"国家",
                        delivery:"小店外卖订餐信息说明：订餐时间，送餐时间，送餐到达范围和条件，其它说明等（描述简单明了）",
                        name:"店铺微信名字",
                        open:true,
                        phone:"电话",
                        province:"大区",
                        score:0
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log("成功新建一个店铺")
                        that.globalData.shopInfo = res.data
                        console.log(res.data)
                      }
                    })
                    //店铺已存在
                  } else {
                    console.log("店铺已存在：", res.data)
                    that.globalData.shopInfo = res.data
                    // 此处加入 callback
                    if (that.shopInfoReadyCallback) {
                      that.shopInfoReadyCallback(res)
                    }
                  }
                }
              })
            }
          })
        } else {
          console.log('微信登录失败:' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("userInfo:", res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    shopInfo: null,
    openid: "",
    session_key: null,
    status: ["等待", "接受", "送出", "完成", "取消"]
  }
})