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
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseButton: wx.canIUse('button.open-type.getUserInfo'),
    userAvatarTemp: '',  // 临时头像
    userNicknameTemp: '',  // 临时昵称
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
    
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
    
    if (this.data.hasUserInfo) {
      this.loadOrderStats();
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

  // 通过按钮获取用户信息（老方式，用于兼容）
  onGetUserInfo(e) {
    console.log('按钮获取用户信息:', e);
    if (e.detail.userInfo) {
      userManager.getUserInfoByButton(e)
        .then(userInfo => {
          this.setData({
            userInfo: userInfo,
            hasUserInfo: true
          });
          util.showSuccess('登录成功');
          this.loadOrderStats();
        })
        .catch(err => {
          console.error('获取用户信息失败:', err);
          util.showError('您拒绝了授权');
        });
    } else {
      util.showError('您拒绝了授权');
    }
  },

  // 获取用户信息（新方式）
  getUserProfile() {
    console.log('===== 开始获取用户信息 =====');
    userManager.getUserProfile()
      .then(userInfo => {
        console.log('✅ 获取用户信息成功:', userInfo);
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
        util.showSuccess('登录成功');
        this.loadOrderStats();
      })
      .catch(err => {
        console.error('❌ 获取用户信息失败:', err);
        if (err.message && err.message.includes('微信版本')) {
          util.showError('请升级微信版本');
        } else if (err.errMsg && err.errMsg.includes('cancel')) {
          util.showError('您取消了授权');
        } else {
          util.showError('登录失败，请重试');
        }
      });
  },

  // 选择头像（新方式）
  onChooseAvatar(e) {
    console.log('✅ 用户选择了头像:', e.detail.avatarUrl);
    this.setData({
      userAvatarTemp: e.detail.avatarUrl
    });
  },

  // 输入昵称（新方式）
  onNicknameChange(e) {
    console.log('✅ 用户输入了昵称:', e.detail.value);
    this.setData({
      userNicknameTemp: e.detail.value
    });
  },

  // 新方式登录：使用头像昵称填写组件
  handleNewLogin() {
    const { userAvatarTemp, userNicknameTemp } = this.data;
    
    if (!userNicknameTemp || userNicknameTemp.trim() === '') {
      util.showError('请输入昵称');
      return;
    }

    console.log('===== 使用新方式登录 =====');
    console.log('头像:', userAvatarTemp);
    console.log('昵称:', userNicknameTemp);

    // 构建用户信息对象
    const userInfo = {
      nickName: userNicknameTemp,
      avatarUrl: userAvatarTemp || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    };

    // 保存用户信息
    userManager.saveUserInfo(userInfo);

    this.setData({
      userInfo: userInfo,
      hasUserInfo: true,
      userAvatarTemp: '',
      userNicknameTemp: ''
    });

    util.showSuccess('登录成功');
    this.loadOrderStats();
  },

  // 旧方式登录：使用getUserProfile
  handleOldLogin() {
    this.getUserProfile();
  },

  // 点击登录按钮（兼容旧代码）
  handleLogin() {
    // 优先使用新方式
    this.handleNewLogin();
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
        
        // 清除全局数据
        app.setUserInfo(null);
        
        // 调用 userManager 的 logout 方法，清除所有缓存
        userManager.logout();
        
        util.showSuccess('已退出登录');
      }
    });
  }
});
