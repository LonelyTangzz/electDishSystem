// Demo模式：本地存储模拟数据库
const app = getApp();

/**
 * 订单本地存储
 */
const DemoOrderStorage = {
  // 保存订单
  saveOrder(orderData) {
    try {
      const orders = this.getAllOrders();
      const newOrder = {
        _id: 'order_' + Date.now(),
        ...orderData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      orders.unshift(newOrder);
      wx.setStorageSync('demo_orders', orders);
      return { success: true, orderId: newOrder._id };
    } catch (err) {
      console.error('保存订单失败', err);
      return { success: false, error: err };
    }
  },

  // 获取所有订单
  getAllOrders() {
    try {
      const orders = wx.getStorageSync('demo_orders');
      return orders || [];
    } catch (err) {
      return [];
    }
  },

  // 获取用户订单
  getUserOrders(openid) {
    const allOrders = this.getAllOrders();
    return allOrders.filter(order => order.openid === openid);
  },

  // 获取订单详情
  getOrderById(orderId) {
    const orders = this.getAllOrders();
    return orders.find(order => order._id === orderId);
  },

  // 更新订单状态
  updateOrderStatus(orderId, status) {
    try {
      const orders = this.getAllOrders();
      const index = orders.findIndex(order => order._id === orderId);
      if (index !== -1) {
        orders[index].status = status;
        orders[index].updateTime = new Date().toISOString();
        wx.setStorageSync('demo_orders', orders);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err };
    }
  }
};

/**
 * 评价本地存储
 */
const DemoReviewStorage = {
  // 保存评价
  saveReview(reviewData) {
    try {
      const reviews = this.getAllReviews();
      const newReview = {
        _id: 'review_' + Date.now(),
        ...reviewData,
        createTime: new Date().toISOString()
      };
      reviews.unshift(newReview);
      wx.setStorageSync('demo_reviews', reviews);
      
      // 标记订单为已评价
      DemoOrderStorage.updateOrderStatus(reviewData.orderId, 'completed');
      
      return { success: true, reviewId: newReview._id };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  // 获取所有评价
  getAllReviews() {
    try {
      const reviews = wx.getStorageSync('demo_reviews');
      return reviews || [];
    } catch (err) {
      return [];
    }
  },

  // 获取菜品评价
  getDishReviews(dishId) {
    const reviews = this.getAllReviews();
    return reviews.filter(review => review.dishId === dishId);
  },

  // 检查是否已评价
  hasReviewed(openid, orderId) {
    const reviews = this.getAllReviews();
    return reviews.some(review => 
      review.openid === openid && review.orderId === orderId
    );
  }
};

/**
 * 用户本地存储
 */
const DemoUserStorage = {
  // 保存用户信息
  saveUserInfo(openid, userInfo) {
    try {
      const users = this.getAllUsers();
      const existingIndex = users.findIndex(u => u.openid === openid);
      
      const userData = {
        openid: openid,
        ...userInfo,
        updateTime: new Date().toISOString()
      };
      
      if (existingIndex !== -1) {
        users[existingIndex] = userData;
      } else {
        userData.createTime = new Date().toISOString();
        users.push(userData);
      }
      
      wx.setStorageSync('demo_users', users);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  // 获取所有用户
  getAllUsers() {
    try {
      const users = wx.getStorageSync('demo_users');
      return users || [];
    } catch (err) {
      return [];
    }
  },

  // 获取用户信息
  getUserInfo(openid) {
    const users = this.getAllUsers();
    return users.find(user => user.openid === openid);
  }
};

module.exports = {
  DemoOrderStorage,
  DemoReviewStorage,
  DemoUserStorage
};

