// pages/mine/mine.js
const app = getApp();
const db = require('../../utils/db.js');
const demoStorage = require('../../utils/demoStorage.js');
const util = require('../../utils/util.js');
const initDishes = require('../../utils/initDishes.js');
const userManager = require('../../utils/userManager.js');

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    inputName: '', // 用户输入的名字
    orderStats: {
      pending: 0,
      completed: 0,
      total: 0
    },
    demoMode: true,
    chefTaskCount: 0, // 待处理的厨房任务
    inputName: '' // 输入的名字
  },

  // 输入名字
  onInputName(e) {
    this.setData({
      inputName: e.detail.value
    });
  },

  // 专属名字登录
  handleNameLogin() {
    const name = this.data.inputName.trim();
    
    // 定义合法用户
    const validUsers = {
      '陈小宝大笨蛋': {
        nickName: '陈小宝大笨蛋',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
        openid: 'chen_xiaobao' // 模拟固定 openid
      },
      '汤大宝小聪明': {
        nickName: '汤大宝小聪明',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
        openid: 'tang_dabao' // 模拟固定 openid
      }
    };

    if (validUsers[name]) {
      // 登录成功
      const userInfo = validUsers[name];
      
      // 保存到全局
      app.globalData.userInfo = userInfo;
      app.globalData.openid = userInfo.openid;
      
      // 保存到本地存储
      userManager.saveUserInfo(userInfo);
      wx.setStorageSync('user_openid', userInfo.openid); // 额外存一个openid
      
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        inputName: ''
      });
      
      util.showSuccess(`欢迎回来，${name}！💕`);
      this.loadOrderStats();
      this.loadChefStats();
      
    } else {
      // 登录失败
      util.showError('名字不对哦！你是谁？😤');
    }
  },

  onLoad() {
    this.setData({
      demoMode: app.globalData.demoMode
    });
    
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
    
    if (this.data.hasUserInfo) {
      this.loadOrderStats();
      this.loadChefStats();
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    // 检查是否已登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      this.loadOrderStats();
    } else {
      // 尝试从本地存储恢复用户信息
      const userInfo = userManager.restoreUserInfo();
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
        this.loadOrderStats();
      } else {
        this.setData({
          userInfo: null,
          hasUserInfo: false
        });
      }
    }
  },

  // 输入名字
  onInputName(e) {
    this.setData({
      inputName: e.detail.value
    });
  },

  // 专属名字登录
  handleNameLogin() {
    const name = this.data.inputName.trim();
    
    // 定义合法用户
    const validUsers = {
      '陈小宝大笨蛋': {
        nickName: '陈小宝大笨蛋',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
        openid: 'chen_xiaobao' // 模拟固定 openid
      },
      '汤大宝小聪明': {
        nickName: '汤大宝小聪明',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
        openid: 'tang_dabao' // 模拟固定 openid
      }
    };

    if (validUsers[name]) {
      // 登录成功
      const userInfo = validUsers[name];
      
      // 保存到全局
      app.globalData.userInfo = userInfo;
      app.globalData.openid = userInfo.openid;
      
      // 保存到本地存储
      userManager.saveUserInfo(userInfo);
      wx.setStorageSync('user_openid', userInfo.openid); // 额外存一个openid
      
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        inputName: ''
      });
      
      util.showSuccess(`欢迎回来，${name}！💕`);
      this.loadOrderStats();
      this.loadChefStats();
      
    } else {
      // 登录失败
      util.showError('名字不对哦！你是谁？😤');
    }
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
      
      // 消费端统计：我下的单
      // 待完成 = 我下的 && (状态是 pending / confirmed / preparing / delivering / cooking)
      const pending = orders.filter(o => 
        ['pending', 'confirmed', 'preparing', 'delivering', 'cooking'].includes(o.status)
      ).length;
      
      // 已完成 = 我下的 && 状态是 completed
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

  // 加载厨房任务统计
  async loadChefStats() {
    if (!app.globalData.openid) return;
    
    try {
      const allPendingOrders = await db.getOrdersByStatus('pending');
      const myOpenid = app.globalData.openid;
      
      // 只要不是我下的单，就是我的任务 (且必须有有效openid)
      const myTasks = allPendingOrders.filter(order => order.openid && order.openid !== myOpenid);
      
      this.setData({
        chefTaskCount: myTasks.length
      });
      
      // 更新 TabBar Badge
      app.updateChefBadge();
    } catch (err) {
      console.error('加载厨房统计失败', err);
    }
  },

  // 跳转到厨房
  goToChef() {
    wx.switchTab({
      url: '/pages/chef/chef'
    });
  },

  // 查看订单
  goToOrders(e) {
    const status = e.currentTarget.dataset.status || 'all'; // 默认为 all
    if (!this.data.hasUserInfo) {
      util.showError('请先登录');
      return;
    }
    
    // 如果是"已完成"，传递状态参数以便列表页自动切换Tab
    // 注意：需要在 orders.js 里处理 onLoad 参数
    app.globalData.tempOrderTab = status; // 临时存全局，简单粗暴
    
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
          },
          chefTaskCount: 0
        });
        
        // 清除全局数据
        app.globalData.userInfo = null;
        app.globalData.openid = null;
        
        // 清除所有缓存
        userManager.logout();
        wx.removeStorageSync('user_openid');
        
        util.showSuccess('已退出登录');
      }
    });
  }
});
