const app = getApp()
import route from '../route'
import utils from '../utils'
Page({
  data: {
    
  },
  toPage(){
    // wx.navigateTo({
    //   url:route.top
    // })
    let param = {
      name:'掘金',
      domain:'https://juejin.im'
    }
    utils.navigateTo(route.top,param)
  },
  onLoad: function () {
    // const ctx = wx.createCanvasContext('poster')
    // ctx.drawImage('../images/img.jpg',0,0,300,450)
    // ctx.draw()
  },
})
