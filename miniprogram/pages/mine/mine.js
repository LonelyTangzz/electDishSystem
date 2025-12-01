// pages/mine/mine.js
const app = getApp();
const db = require('../../utils/db.js');
const demoStorage = require('../../utils/demoStorage.js');
const util = require('../../utils/util.js');
const initDishes = require('../../utils/initDishes.js');

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    orderStats: {
      pending: 0,
      completed: 0,
      total: 0
    },
    demoMode: true
  },

  onLoad() {
    this.setData({
      demoMode: app.globalData.demoMode
    });
    
    // 检查是否已登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      this.loadOrderStats();
    } else {
      // Demo模式：尝试从本地存储恢复用户信息
      if (app.globalData.demoMode) {
        try {
          const savedUserInfo = wx.getStorageSync('demo_userInfo');
          if (savedUserInfo) {
            app.setUserInfo(savedUserInfo);
            this.setData({
              userInfo: savedUserInfo,
              hasUserInfo: true
            });
            this.loadOrderStats();
          }
        } catch (err) {
          console.log('未找到本地用户信息');
        }
      }
    }
  },

  onShow() {
    if (this.data.hasUserInfo) {
      this.loadOrderStats();
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
        app.setUserInfo(userInfo);
        
        // 保存用户信息
        if (app.globalData.openid) {
          if (app.globalData.demoMode) {
            demoStorage.DemoUserStorage.saveUserInfo(app.globalData.openid, userInfo);
          } else {
            db.UserDB.saveUserInfo(app.globalData.openid, userInfo);
          }
        }
        
        util.showSuccess('登录成功');
        this.loadOrderStats();
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        util.showError('登录失败');
      }
    });
  },

  // 加载订单统计
  async loadOrderStats() {
    if (!app.globalData.openid) {
      return;
    }

    try {
      let orders;
      
      if (app.globalData.demoMode) {
        // Demo模式：从本地存储获取
        orders = demoStorage.DemoOrderStorage.getUserOrders(app.globalData.openid);
      } else {
        // 云开发模式
        orders = await db.OrderDB.getUserOrders(app.globalData.openid);
      }
      
      const pending = orders.filter(o => 
        o.status === 'pending' || 
        o.status === 'confirmed' || 
        o.status === 'preparing'
      ).length;
      const completed = orders.filter(o => o.status === 'completed').length;
      
      this.setData({
        orderStats: {
          pending: pending,
          completed: completed,
          total: orders.length
        }
      });
    } catch (err) {
      console.error('加载订单统计失败', err);
    }
  },

  // 查看订单
  goToOrders(e) {
    const status = e.currentTarget.dataset.status || '';
    if (!this.data.hasUserInfo) {
      util.showError('请先登录');
      return;
    }
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  // 初始化云数据库菜品
  initCloudDishes() {
    util.showConfirm('初始化云数据库', '确定要初始化菜品数据到云数据库吗？\n\n注意：如果已有数据，会产生重复。').then(confirm => {
      if (confirm) {
        initDishes.initDishesToCloud();
      }
    });
  },

  // 退出登录
  logout() {
    util.showConfirm('提示', '确定要退出登录吗？').then(confirm => {
      if (confirm) {
        this.setData({
          userInfo: null,
          hasUserInfo: false,
          orderStats: {
            pending: 0,
            completed: 0,
            total: 0
          }
        });
        app.setUserInfo(null);
        
        // Demo模式：清除本地存储
        if (app.globalData.demoMode) {
          wx.removeStorageSync('demo_userInfo');
        }
        
        util.showSuccess('已退出登录');
      }
    });
  }
});
