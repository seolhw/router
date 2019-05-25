## 明确要解决的问题

- 每次使用路由时，总是粘贴复制路径，这样在路径有修改时，需要修改所有用到该路径的地方，维护成本高
- 路由跳转时拼接参数让人头大，业务复杂时要拼接十几个参数
- 路由返回，只会返回一层，不能直接返回到目标页面，因为不知道目标页面是否在路由栈中，也不知道在第几层

这些问题都可以通过封装路由文件和路由方法解决，提供开发效率，减少BUG，省下来的时间可以多陪陪女朋友

## 封装路由文件，对路由进行统一管理

在根目录创建router.js

```
// 这是路由管理页面，在此统一配置路由
export default {
  'index':'/index/index', // 首页
  'list':'/list/list', // list页面
  'top':'/top/top', // top页面
}
```
解决了第一个问题

## 封装路由方法

路由方法有五个，常用的有三个`switchTab`、`navigateTo`、`navigateBack`

简单介绍一下这五个方法及使用场景

 - `switchTab`,跳转tabBar页面专用，其他页面出栈，新页面入栈
 - `navigateTo`最常用的路由跳转，会加入到页面栈，允许返回，也就是新页面不断入栈
 - `navigateBack`返回，只能返回到页面栈中存在的页面，页面不断出栈，直到到达目标页
 - `redirectTo`关闭当前页面，跳转某个页面，当前页面不会加入到页面栈，也就是说当前页面不能通过返回到达，比如付款页面，付款完成后，最好不要再让用户返回到付款页，再比如一些无法修改的操作，比如删除商品，商品删除后再通过`navigateBack`返回再删除一次商品，体验肯定不好，表现为当前页面出栈，新页面入栈
 - `reLaunch`关闭所有页面，打开某个页面，可以打开任意页面包括tabBar，适合强制完成某个操作的页面，比如登录页，当已登录的用户点击退出后，进入登录页，那么就不能通过返回再回去了，就必须留下来登录或注册，适合用这个，表现为所有页面出栈，新页面入栈


开始封装，在根目录创建utils.js

```
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
      url+=`?param=${JSON.stringify(param)}`要根据具体业务来，该返回就返回，该跳转就用跳转，不能一直跳转！
    }
    wx.reLaunch({
      url:url,
      fail(err) {
        console.log('reLaunch跳转出错',err)  
      },
    })
  }
}
```

以上对参数的封装解决了第二个问题，对`navigateBack`的封装解决了第三个问题

## 总结

小程序的路由跳转有很多方法，但具体场景下合适的只有一个，选择合适的路由跳转方式会提高用户体验，封装主要是提升开发效率，减少后期维护成本

[小程序代码片段地址 https://developers.weixin.qq.com/s/CsoJwDmR7B8N](https://developers.weixin.qq.com/s/CsoJwDmR7B8N)
