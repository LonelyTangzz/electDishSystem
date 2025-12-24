// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    cartCount: 0,
    demoMode: false // 云开发模式：使用云数据库
  },

  onLaunch() {
    // 小程序启动
    console.log('阿汤的小食堂小程序启动');
    
    // 尝试初始化云开发（如果可用）
    if (wx.cloud && !this.globalData.demoMode) {
      try {
        wx.cloud.init({
          env: 'cloud1-7gjt5l5i0f2bf5d4', // 云开发环境ID
          traceUser: true
        });
        console.log('云开发初始化成功');
        
        // 简化登录流程 - 只获取 OpenID
        this.getUserOpenId();
      } catch (err) {
        console.log('云开发暂未开通，使用Demo模式');
        this.globalData.demoMode = true;
        this.globalData.openid = 'demo_' + Date.now();
      }
    } else {
      console.log('Demo模式：使用本地数据');
      // Demo模式：生成模拟OpenID
      this.globalData.openid = 'demo_' + Date.now();
    }
    
    // 尝试从本地恢复用户信息
    this.restoreUserInfo();
    
    // 初始化购物车数量
    this.updateCartCount();
    
    // 初始化厨师任务数量
    this.updateChefBadge();
  },

  // 恢复用户信息
  restoreUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const openid = wx.getStorageSync('user_openid'); // 同时也恢复自定义 openid
      
      if (userInfo && openid) {
        this.globalData.userInfo = userInfo;
        this.globalData.openid = openid;
        console.log('已恢复用户信息:', userInfo.nickName);
      }
    } catch (err) {
      console.error('恢复用户信息失败:', err);
    }
  },

  // 获取用户OpenID (保留兼容性)
  getUserOpenId() {
    if (this.globalData.demoMode) {
      this.globalData.openid = 'demo_' + Date.now();
      return;
    }
    
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('获取OpenID成功', res);
        this.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('获取OpenID失败', err);
        // 失败时使用Demo模式
        this.globalData.demoMode = true;
        this.globalData.openid = 'demo_' + Date.now();
      }
    });
  },

  // 更新购物车数量
  updateCartCount() {
    const cart = require('./utils/cartManager.js');
    const count = cart.getItemCount();
    this.globalData.cartCount = count;
    
    // 更新tabBar徽标
    if (count > 0) {
      wx.setTabBarBadge({
        index: 1, // 购物车是第2个Tab
        text: String(count)
      }).catch(err => console.log('非TabBar页面忽略Badge设置'));
    } else {
      wx.removeTabBarBadge({
        index: 1
      }).catch(err => console.log('非TabBar页面忽略Badge移除'));
    }
  },

  /**
   * 更新厨师任务徽标 (新)
   * 检查有多少"非我"的待处理订单
   */
  async updateChefBadge() {
    const db = require('./utils/db.js');
    
    // 必须有openid才能判断"非我"
    if (!this.globalData.openid) return;
    
    try {
      const allPendingOrders = await db.getOrdersByStatus('pending');
      const myOpenid = this.globalData.openid;
      
      // 只要不是我下的单，就是我的任务
      const myTasks = allPendingOrders.filter(order => order.openid !== myOpenid);
      const count = myTasks.length;
      
      console.log('👨‍🍳 厨师任务数:', count);
      
      if (count > 0) {
        wx.setTabBarBadge({
          index: 2, // 厨房是第3个Tab
          text: String(count)
        }).catch(err => console.log('非TabBar页面忽略Badge设置'));
      } else {
        wx.removeTabBarBadge({
          index: 2
        }).catch(err => console.log('非TabBar页面忽略Badge移除'));
      }
    } catch (error) {
      console.error('更新厨师徽标失败:', error);
    }
  },

  // 检查用户登录状态
  checkLogin() {
    return this.globalData.userInfo !== null;
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    
    // Demo模式：保存到本地存储
    if (this.globalData.demoMode && userInfo) {
      wx.setStorageSync('demo_userInfo', userInfo);
    }
  }
});
