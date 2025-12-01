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
        this.getUserOpenId();
      } catch (err) {
        console.log('云开发暂未开通，使用Demo模式');
        this.globalData.demoMode = true;
      }
    } else {
      console.log('Demo模式：使用本地数据');
      // Demo模式：生成模拟OpenID
      this.globalData.openid = 'demo_' + Date.now();
    }
    
    // 初始化购物车数量
    this.updateCartCount();
  },

  // 获取用户OpenID
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
    
    console.log('🔄 更新购物车徽标:', count);
    
    // 更新tabBar徽标
    if (count > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: String(count),
        success: () => {
          console.log('✅ TabBar徽标已设置:', count);
        },
        fail: (err) => {
          console.error('❌ 设置TabBar徽标失败:', err);
        }
      });
    } else {
      wx.removeTabBarBadge({
        index: 1,
        success: () => {
          console.log('✅ TabBar徽标已移除');
        },
        fail: (err) => {
          console.error('❌ 移除TabBar徽标失败:', err);
        }
      });
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
