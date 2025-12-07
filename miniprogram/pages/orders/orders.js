// pages/orders/orders.js
const app = getApp();
const db = require('../../utils/db.js');
const demoStorage = require('../../utils/demoStorage.js');
const util = require('../../utils/util.js');

Page({
  data: {
    orders: [],
    loading: false,
    hasUserInfo: false,
    currentTab: 'all',
    demoMode: true
  },

  onLoad() {
    this.setData({
      demoMode: app.globalData.demoMode
    });
    this.checkLoginAndLoad();
  },

  onShow() {
    this.checkLoginAndLoad();
  },

  // 检查登录并加载数据
  checkLoginAndLoad() {
    if (app.globalData.userInfo && app.globalData.openid) {
      this.setData({ hasUserInfo: true });
      this.loadOrders();
    } else {
      this.setData({ hasUserInfo: false });
    }
  },

  // 加载订单列表
  async loadOrders() {
    this.setData({ loading: true });

    try {
      let orders;
      
      if (app.globalData.demoMode) {
        // Demo模式：从本地存储获取
        orders = demoStorage.DemoOrderStorage.getUserOrders(app.globalData.openid);
      } else {
        // 云开发模式
        orders = await db.OrderDB.getUserOrders(app.globalData.openid);
      }
      
      // 格式化订单数据
      const formattedOrders = orders.map(order => {
        const createTime = new Date(order.createTime);
        
        // 计算订单的总爱心数
        const totalStars = order.items.reduce((sum, item) => {
          const dishStars = item.dish.stars || 0;
          return sum + (dishStars * item.quantity);
        }, 0) + 1;  // +1 是配送费的爱心
        
        // 为每个商品添加爱心数
        const itemsWithStars = order.items.map(item => ({
          ...item,
          totalStars: (item.dish.stars || 0) * item.quantity
        }));
        
        return {
          ...order,
          items: itemsWithStars,
          formattedTime: util.formatTime(createTime),
          formattedTotal: order.totalAmount.toFixed(2),
          totalStars: totalStars,  // 总爱心数
          statusText: this.getStatusText(order.status),
          canReview: order.status === 'completed' && !order.hasReview
        };
      });

      this.setData({
        orders: formattedOrders,
        loading: false
      });
    } catch (err) {
      console.error('加载订单失败', err);
      util.showError('加载订单失败');
      this.setData({ loading: false });
    }
  },

  // 切换Tab
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // 获取状态文字
  getStatusText(status) {
    const statusMap = {
      'pending': '待确认',
      'confirmed': '已确认',
      'preparing': '准备中',
      'delivering': '配送中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    // 暂未实现详情页
    util.showError('订单详情功能开发中');
  },

  // 去评价
  goToReview(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/review/review?orderId=${orderId}`
    });
  },

  // 去登录
  goToLogin() {
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  },

  // 去点餐
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadOrders().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
