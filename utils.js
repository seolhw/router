// 封装路由方法
export default {

  /** 
   * function
   * @param {string} url 目标页面的路由
   * @param {Object} param 传递给目标页面的参数
   * @description  处理目标页面的参数，转成json字符串传递给param字段，在目标页面通过JSON.parse(options.param)接收
   */  
  navigateTo(url,param={}){
    if(param){
      url+=`?param=${JSON.stringify(param)}`
    }
    wx.navigateTo({
      url:url,
      fail(err) {
        console.log('navigateTo跳转出错',err)  
      },
    })
  },


   /** 
   * function
   * @param {string} url 目标页面的路由
   * @param {Object} param 传递给目标页面的参数，只有页面栈无目标页面调用navigateTo时，参数才会生效，单单返回不能设置参数
   * @description  先取出页面栈，页面栈最多十层，判断目标页面是否在页面栈中，如果在，则通过目标页的位置，返回到目标页面，否则调用navigateTo方法跳转到目标页
   */   
  navigateBack(url,param={}){
    const pagesList = getCurrentPages()
    let index =  pagesList.findIndex(e=>{
      return url.indexOf(e.route)>=0
    })
    if(index == -1){  // 没有在页面栈中，可以调用navigateTo方法
      this.navigateTo(url,param)
    }else{
      wx.navigateBack({
        delta: pagesList.length-1-index,
        fail(err){
          console.log('navigateBack返回出错',err)
        }
      })
    }
  },


  switchTab(url){ // 封装switchTab，switchTab不能有参数
    wx.switchTab({
      url:url
    })
  },
  redirectTo(url,param={}){ // 封装redirectTo，和navigateTo没啥区别
    if(param){
      url+=`?param=${JSON.stringify(param)}`
    }
    wx.redirectTo({
      url:url,
      fail(err) {
        console.log('redirectTo跳转出错',err)  
      },
    })
  },
  reLaunch(url,param={}){ // 封装reLaunch，和navigateTo没啥区别
    if(param){
      url+=`?param=${JSON.stringify(param)}`
    }
    wx.reLaunch({
      url:url,
      fail(err) {
        console.log('reLaunch跳转出错',err)  
      },
    })
  }
}