// miniprogram/pages/chef/chef.js
const app = getApp();
const db = require('../../utils/db');
const util = require('../../utils/util');

Page({
  data: {
    currentTab: 'pending', // 当前标签：pending, cooking, completed
    orders: [], // 订单列表
    stats: {
      pending: 0,
      cooking: 0,
      completed: 0
    },
    isChef: false, // 是否是厨师
    openid: '' // 用户 openid
  },

  onLoad() {
    console.log('厨师页面加载');
    this.checkChefPermission();
  },

  onShow() {
    // 每次显示页面时刷新订单
    if (this.data.isChef) {
      this.loadOrders();
    }
  },

  /**
   * 检查厨师权限
   * 注意：实际应用中应该在数据库中配置厨师 openid 列表
   */
  async checkChefPermission() {
    try {
      const openid = app.globalData.openid;
      
      if (!openid) {
        wx.showModal({
          title: '需要登录',
          content: '请先登录后再访问厨师页面',
          showCancel: false,
          success: () => {
            wx.switchTab({ url: '/pages/mine/mine' });
          }
        });
        return;
      }

      this.setData({ 
        openid,
        isChef: true // 暂时允许所有登录用户访问（演示模式）
      });

      // 实际应用中应该检查数据库中的厨师权限
      // const isChef = await this.checkChefInDatabase(openid);
      // this.setData({ isChef });

      if (this.data.isChef) {
        this.loadOrders();
      } else {
        wx.showModal({
          title: '权限不足',
          content: '您没有访问厨师页面的权限',
          showCancel: false,
          success: () => {
            wx.switchTab({ url: '/pages/index/index' });
          }
        });
      }
    } catch (error) {
      console.error('检查厨师权限失败:', error);
      util.showToast('检查权限失败', 'error');
    }
  },

  /**
   * 切换标签
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadOrders();
  },

  /**
   * 加载订单列表
   */
  async loadOrders() {
    try {
      wx.showLoading({ title: '加载中...', mask: true });

      // 根据当前标签加载不同状态的订单
      const status = this.data.currentTab;
      const orders = await db.getOrdersByStatus(status);

      // 格式化订单数据
      const formattedOrders = orders.map(order => {
        return {
          ...order,
          createTimeFormatted: this.formatTime(order.createTime),
          completedTimeFormatted: order.completedTime ? this.formatTime(order.completedTime) : '',
          statusText: this.getStatusText(order.status),
          // 为每个菜品添加 emoji
          items: order.items.map(item => ({
            ...item,
            emoji: this.getDishEmoji(item.name),
            subtotal: item.subtotal.toFixed(2)
          })),
          totalAmount: order.totalAmount.toFixed(2)
        };
      });

      // 更新统计数据
      await this.updateStats();

      this.setData({ orders: formattedOrders });

      wx.hideLoading();
    } catch (error) {
      console.error('加载订单失败:', error);
      wx.hideLoading();
      util.showToast('加载订单失败', 'error');
    }
  },

  /**
   * 更新统计数据
   */
  async updateStats() {
    try {
      const pendingOrders = await db.getOrdersByStatus('pending');
      const cookingOrders = await db.getOrdersByStatus('cooking');
      
      // 获取今日完成订单
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const completedOrders = await db.getOrdersByStatusAndTime('completed', today.getTime());

      this.setData({
        'stats.pending': pendingOrders.length,
        'stats.cooking': cookingOrders.length,
        'stats.completed': completedOrders.length
      });
    } catch (error) {
      console.error('更新统计数据失败:', error);
    }
  },

  /**
   * 接单 - 将订单状态改为制作中
   */
  async acceptOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    try {
      const result = await wx.showModal({
        title: '确认接单',
        content: '确认接单并开始制作？'
      });

      if (!result.confirm) return;

      wx.showLoading({ title: '处理中...', mask: true });

      await db.updateOrderStatus(orderId, 'cooking');

      wx.hideLoading();
      util.showToast('已接单，开始制作', 'success');
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('接单失败:', error);
      wx.hideLoading();
      util.showToast('接单失败', 'error');
    }
  },

  /**
   * 拒单
   */
  async rejectOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    try {
      const result = await wx.showModal({
        title: '确认拒单',
        content: '确定要拒绝这个订单吗？',
        confirmColor: '#d32f2f'
      });

      if (!result.confirm) return;

      wx.showLoading({ title: '处理中...', mask: true });

      await db.updateOrderStatus(orderId, 'cancelled');

      wx.hideLoading();
      util.showToast('订单已拒绝', 'success');
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('拒单失败:', error);
      wx.hideLoading();
      util.showToast('拒单失败', 'error');
    }
  },

  /**
   * 完成订单
   */
  async completeOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    try {
      const result = await wx.showModal({
        title: '确认完成',
        content: '确认此订单已完成出餐？'
      });

      if (!result.confirm) return;

      wx.showLoading({ title: '处理中...', mask: true });

      await db.updateOrderStatus(orderId, 'completed', Date.now());

      wx.hideLoading();
      util.showToast('订单已完成', 'success');
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('完成订单失败:', error);
      wx.hideLoading();
      util.showToast('完成订单失败', 'error');
    }
  },

  /**
   * 刷新订单列表
   */
  refreshOrders() {
    // 触发刷新动画
    const query = wx.createSelectorQuery();
    query.select('.refresh-icon').node();
    
    this.loadOrders();
    util.showToast('已刷新', 'success');
  },

  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 1分钟内
    if (diff < 60000) {
      return '刚刚';
    }
    
    // 1小时内
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }
    
    // 今天
    if (date.toDateString() === now.toDateString()) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `今天 ${hours}:${minutes}`;
    }
    
    // 其他日期
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'pending': '待处理',
      'cooking': '制作中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知';
  },

  /**
   * 根据菜品名称获取 emoji
   */
  getDishEmoji(dishName) {
    const emojiMap = {
      '宫保鸡丁': '🍗',
      '鱼香肉丝': '🥩',
      '麻婆豆腐': '🧊',
      '红烧排骨': '🍖',
      '清蒸鲈鱼': '🐟',
      '拍黄瓜': '🥒',
      '凉拌木耳': '🍄',
      '夫妻肺片': '🥩',
      '番茄蛋花汤': '🍅',
      '酸辣汤': '🥣',
      '扬州炒饭': '🍚',
      '兰州拉面': '🍜',
      '煎饺': '🥟',
      '红豆汤圆': '🍡',
      '芒果布丁': '🥭',
      '鲜榨橙汁': '🍊',
      '柠檬绿茶': '🍋',
      '奶茶': '🧋'
    };
    return emojiMap[dishName] || '🍽️';
  }
});

