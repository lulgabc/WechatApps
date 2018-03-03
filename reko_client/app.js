const API_ENDPOINT = 'http://localhost:3000/reko/client';

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log("CODE:", res.code)
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
              let openid = res.data.openid
              let that = this
              //查询客户是否存在
              wx.request({
                url: API_ENDPOINT + "/" + openid,
                data: {},
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  //新客户
                  if (res.statusCode == 400) {
                    console.log("Not client:", openid)
                    wx.request({
                      url: API_ENDPOINT,
                      data: {
                        openid: openid,
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log("Create a new client")
                        console.log(res.data)
                      }
                    })
                    //老客户
                  } else {
                    console.log("老客户：", res.data)
                    that.globalData.clientInfo = res.data
                    // 此处加入 callback
                    if (that.clientInfoReadyCallback) {
                      that.clientInfoReadyCallback(res)
                    }
                  }
                }
              })
            }
          })
        } else {
          console.log('login error:' + res.errMsg)
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
              let userInfo = res.userInfo
              // 跟新client基本信息：name,country,province,city,phone,avatar
              let that = this
              console.log("that.openid:", that.globalData.openid)
              wx.request({
                url: API_ENDPOINT + "/" + that.globalData.openid,
                method: "PUT",
                data: {
                  name: userInfo.nickName,
                  country: userInfo.country,
                  city: userInfo.city,
                  province: userInfo.province,
                  avatar: userInfo.avatarUrl
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log("Update Client Userinfo success: code:", res.statusCode)
                }
              })

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
    clientInfo: null,
    shopList: null,
    openid: "",
    tempOrders:{},
  }
})