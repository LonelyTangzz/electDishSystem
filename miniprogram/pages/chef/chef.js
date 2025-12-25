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
    // 更新厨师任务徽标
    app.updateChefBadge();
  },

  /**
   * 检查厨师权限
   * 只要登录就可以看（因为只有两个人用）
   */
  async checkChefPermission() {
    try {
      const openid = app.globalData.openid;
      
      if (!openid) {
        wx.showModal({
          title: '需要登录',
          content: '请先登录后再查看TA的点餐',
          showCancel: false,
          success: () => {
            wx.switchTab({ url: '/pages/mine/mine' });
          }
        });
        return;
      }

      this.setData({ 
        openid,
        isChef: true
      });

      this.loadOrders();
    } catch (error) {
      console.error('检查权限失败:', error);
      util.showError('检查失败'); // 修复 showToast 调用
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
      
      // 注意：db.getOrdersByStatus 会返回所有该状态的订单
      const allOrders = await db.getOrdersByStatus(status);
      
      const myOpenid = app.globalData.openid;
      
      // 调试日志
      console.log(`[Chef] 加载 ${status} 订单，共 ${allOrders.length} 条`);
      allOrders.forEach(o => console.log(` - ID:${o._id.substring(0,8)} User:${o.openid} My:${myOpenid}`));
      
      // 精准过滤：
      // 1. 厨房只显示"别人"下的单（我的任务）
      // 2. 必须排除我自己的单（我不能做自己的单）
      // 3. 必须排除无主订单（没有openid的），或者把无主订单视为公共任务（暂定策略：显示出来，方便找回）
      const orders = allOrders.filter(order => {
        // 如果没有openid，默认显示（可能是旧数据），等待被认领
        if (!order.openid) return true;
        // 如果是我的openid，过滤掉（这是我吃的，不是我做的）
        return order.openid !== myOpenid;
      });

      console.log(`[Chef] 过滤后显示 ${orders.length} 条任务`);

      // 格式化订单数据
      const formattedOrders = orders.map(order => {
        return {
          ...order,
          createTimeFormatted: this.formatTime(order.createTime),
          completedTimeFormatted: order.completedTime ? this.formatTime(order.completedTime) : '',
          statusText: this.getStatusText(order.status),
          // 为每个菜品添加 emoji
          items: order.items.map(item => {
            // 兼容不同的数据结构：item 本身可能是 dish，或者 item.dish 才是
            const dishName = item.name || (item.dish && item.dish.name) || '未知菜品';
            const dishPrice = item.price || (item.dish && item.dish.price) || 0;
            const quantity = item.quantity || 1;
            const subtotal = item.subtotal || (dishPrice * quantity) || 0;
            
            return {
              ...item,
              name: dishName, // 确保有 name 字段用于显示
              price: dishPrice, // 确保有 price 字段
              quantity: quantity,
              emoji: this.getDishEmoji(dishName),
              subtotal: parseFloat(subtotal).toFixed(2)
            };
          }),
          totalAmount: (order.totalAmount || 0).toFixed(2)
        };
      });

      // 更新统计数据
      await this.updateStats();

      this.setData({ orders: formattedOrders });

      wx.hideLoading();
    } catch (error) {
      console.error('加载订单失败:', error);
      wx.hideLoading();
      util.showError('加载订单失败'); // 修复 showToast 调用错误
    }
  },

  /**
   * 更新统计数据
   */
  async updateStats() {
    try {
      const myOpenid = app.globalData.openid;
      
      const allPendingOrders = await db.getOrdersByStatus('pending');
      const allCookingOrders = await db.getOrdersByStatus('cooking');
      
      // 精准统计：只要不是我下的单，就是我的任务
      const pendingOrders = allPendingOrders.filter(order => order.openid !== myOpenid);
      const cookingOrders = allCookingOrders.filter(order => order.openid !== myOpenid);
      
      // 获取历史完成订单（移除日期限制，显示所有）
      const allCompletedOrders = await db.getOrdersByStatus('completed');
      
      // 这里的逻辑：如果是我完成的（作为厨师），那么下单人肯定不是我
      const completedOrders = allCompletedOrders.filter(order => order.openid !== myOpenid);

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
      wx.showLoading({ title: '处理中...', mask: true });

      await db.updateOrderStatus(orderId, 'cooking');

      wx.hideLoading();
      util.showSuccess('开始做啦~ 💪'); // 修复 showToast 调用
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('操作失败:', error);
      wx.hideLoading();
      util.showError('操作失败'); // 修复 showToast 调用
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
      util.showSuccess('订单已拒绝'); // 修复 showToast 调用
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('拒单失败:', error);
      wx.hideLoading();
      util.showError('拒单失败'); // 修复 showToast 调用
    }
  },

  /**
   * 完成订单
   */
  async completeOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    try {
      wx.showLoading({ title: '处理中...', mask: true });

      await db.updateOrderStatus(orderId, 'completed', Date.now());

      wx.hideLoading();
      util.showSuccess('做好了！快叫TA来吃吧~ 😋'); // 修复 showToast 调用
      
      // 刷新订单列表
      this.loadOrders();
    } catch (error) {
      console.error('操作失败:', error);
      wx.hideLoading();
      util.showError('操作失败'); // 修复 showToast 调用
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
    util.showSuccess('已刷新'); // 修复 showToast 调用
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

