// 云数据库操作工具
// 延迟初始化，避免在Demo模式下报错
let db = null;
let _ = null;

// 初始化数据库
function initDB() {
  if (!db && wx.cloud) {
    try {
      db = wx.cloud.database();
      _ = db.command;
    } catch (err) {
      console.log('云数据库未初始化，使用Demo模式');
    }
  }
}

/**
 * 菜品数据库操作
 */
const DishDB = {
  // 获取所有菜品
  async getAllDishes() {
    initDB();
    if (!db) {
      console.log('云数据库未启用，请使用Demo模式');
      return [];
    }
    
    try {
      const res = await db.collection('dishes').get();
      return res.data;
    } catch (err) {
      console.error('获取菜品失败', err);
      return [];
    }
  },

  // 根据分类获取菜品
  async getDishesByCategory(category) {
    initDB();
    if (!db) return [];
    
    try {
      if (category === 'all') {
        return await this.getAllDishes();
      }
      const res = await db.collection('dishes')
        .where({ category: category })
        .get();
      return res.data;
    } catch (err) {
      console.error('获取菜品失败', err);
      return [];
    }
  },

  // 搜索菜品
  async searchDishes(keyword) {
    initDB();
    if (!db) return [];
    
    try {
      const res = await db.collection('dishes')
        .where({
          name: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        })
        .get();
      return res.data;
    } catch (err) {
      console.error('搜索菜品失败', err);
      return [];
    }
  }
};

/**
 * 订单数据库操作
 */
const OrderDB = {
  // 创建订单
  async createOrder(orderData) {
    initDB();
    if (!db) {
      console.log('云数据库未启用');
      return { success: false, error: 'DB not initialized' };
    }
    
    try {
      const res = await db.collection('orders').add({
        data: {
          ...orderData,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      });
      return { success: true, orderId: res._id };
    } catch (err) {
      console.error('创建订单失败', err);
      return { success: false, error: err };
    }
  },

  // 获取用户订单列表
  async getUserOrders(openid, status = null) {
    initDB();
    if (!db) return [];
    
    try {
      let query = db.collection('orders').where({ openid: openid });
      
      if (status) {
        query = query.where({ status: status });
      }
      
      const res = await query
        .orderBy('createTime', 'desc')
        .get();
      return res.data;
    } catch (err) {
      console.error('获取订单失败', err);
      return [];
    }
  },

  // 获取订单详情
  async getOrderById(orderId) {
    initDB();
    if (!db) return null;
    
    try {
      const res = await db.collection('orders').doc(orderId).get();
      return res.data;
    } catch (err) {
      console.error('获取订单详情失败', err);
      return null;
    }
  },

  // 更新订单状态
  async updateOrderStatus(orderId, status) {
    initDB();
    if (!db) return { success: false };
    
    try {
      await db.collection('orders').doc(orderId).update({
        data: {
          status: status,
          updateTime: db.serverDate()
        }
      });
      return { success: true };
    } catch (err) {
      console.error('更新订单状态失败', err);
      return { success: false, error: err };
    }
  },

  // 根据状态获取所有订单（厨师端使用）
  async getOrdersByStatus(status) {
    initDB();
    if (!db) return [];
    
    try {
      const res = await db.collection('orders')
        .where({ status: status })
        .orderBy('createTime', 'desc')
        .limit(100)
        .get();
      return res.data;
    } catch (err) {
      console.error('获取订单失败', err);
      return [];
    }
  },

  // 根据状态和时间获取订单（厨师端统计使用）
  async getOrdersByStatusAndTime(status, startTime) {
    initDB();
    if (!db) return [];
    
    try {
      const res = await db.collection('orders')
        .where({
          status: status,
          createTime: _.gte(startTime)
        })
        .get();
      return res.data;
    } catch (err) {
      console.error('获取订单失败', err);
      return [];
    }
  }
};

/**
 * 评价数据库操作
 */
const ReviewDB = {
  // 创建评价
  async createReview(reviewData) {
    initDB();
    if (!db) return { success: false };
    
    try {
      const res = await db.collection('reviews').add({
        data: {
          ...reviewData,
          createTime: db.serverDate()
        }
      });
      return { success: true, reviewId: res._id };
    } catch (err) {
      console.error('创建评价失败', err);
      return { success: false, error: err };
    }
  },

  // 获取菜品评价
  async getDishReviews(dishId) {
    initDB();
    if (!db) return [];
    
    try {
      const res = await db.collection('reviews')
        .where({ dishId: dishId })
        .orderBy('createTime', 'desc')
        .get();
      return res.data;
    } catch (err) {
      console.error('获取评价失败', err);
      return [];
    }
  },

  // 获取用户评价
  async getUserReviews(openid) {
    initDB();
    if (!db) return [];
    
    try {
      const res = await db.collection('reviews')
        .where({ openid: openid })
        .orderBy('createTime', 'desc')
        .get();
      return res.data;
    } catch (err) {
      console.error('获取用户评价失败', err);
      return [];
    }
  },

  // 检查用户是否已评价某订单
  async hasReviewed(openid, orderId) {
    initDB();
    if (!db) return false;
    
    try {
      const res = await db.collection('reviews')
        .where({
          openid: openid,
          orderId: orderId
        })
        .count();
      return res.total > 0;
    } catch (err) {
      console.error('检查评价失败', err);
      return false;
    }
  }
};

/**
 * 用户数据库操作
 */
const UserDB = {
  // 创建或更新用户信息
  async saveUserInfo(openid, userInfo) {
    initDB();
    if (!db) return { success: false };
    
    try {
      // 先检查用户是否存在
      const res = await db.collection('users')
        .where({ openid: openid })
        .get();
      
      if (res.data.length > 0) {
        // 更新用户信息
        await db.collection('users').doc(res.data[0]._id).update({
          data: {
            ...userInfo,
            updateTime: db.serverDate()
          }
        });
      } else {
        // 创建新用户
        await db.collection('users').add({
          data: {
            openid: openid,
            ...userInfo,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      return { success: true };
    } catch (err) {
      console.error('保存用户信息失败', err);
      return { success: false, error: err };
    }
  },

  // 获取用户信息
  async getUserInfo(openid) {
    initDB();
    if (!db) return null;
    
    try {
      const res = await db.collection('users')
        .where({ openid: openid })
        .get();
      return res.data.length > 0 ? res.data[0] : null;
    } catch (err) {
      console.error('获取用户信息失败', err);
      return null;
    }
  }
};

// 导出简化的API（向后兼容）
module.exports = {
  // 完整的模块导出
  DishDB,
  OrderDB,
  ReviewDB,
  UserDB,
  
  // 简化的API（chef页面使用）
  getOrdersByStatus: OrderDB.getOrdersByStatus.bind(OrderDB),
  getOrdersByStatusAndTime: OrderDB.getOrdersByStatusAndTime.bind(OrderDB),
  updateOrderStatus: async (orderId, status, completedTime) => {
    initDB();
    if (!db) return { success: false };
    
    try {
      const updateData = {
        status: status,
        updateTime: db.serverDate()
      };
      
      // 如果是完成状态，添加完成时间
      if (status === 'completed' && completedTime) {
        updateData.completedTime = completedTime;
      }
      
      await db.collection('orders').doc(orderId).update({
        data: updateData
      });
      return { success: true };
    } catch (err) {
      console.error('更新订单状态失败', err);
      throw err;
    }
  }
};

