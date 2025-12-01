// pages/review/review.js
const app = getApp();
const db = require('../../utils/db.js');
const demoStorage = require('../../utils/demoStorage.js');
const util = require('../../utils/util.js');

Page({
  data: {
    orderId: '',
    order: null,
    reviews: [],
    overallRating: 5,
    comment: '',
    demoMode: true
  },

  onLoad(options) {
    const orderId = options.orderId;
    this.setData({
      orderId: orderId,
      demoMode: app.globalData.demoMode
    });
    
    if (orderId) {
      this.loadOrderDetail(orderId);
    }
  },

  // 加载订单详情
  async loadOrderDetail(orderId) {
    try {
      let order;
      
      if (app.globalData.demoMode) {
        // Demo模式：从本地存储获取
        order = demoStorage.DemoOrderStorage.getOrderById(orderId);
      } else {
        // 云开发模式
        order = await db.OrderDB.getOrderById(orderId);
      }
      
      if (order) {
        // 初始化每道菜的评分为5星
        const reviews = order.items.map(item => ({
          dishId: item.dish.id || item.dish._id,
          dishName: item.dish.name,
          dishEmoji: item.dish.emoji || '🍽️',
          rating: 5,
          comment: ''
        }));

        this.setData({
          order: order,
          reviews: reviews
        });
      }
    } catch (err) {
      console.error('加载订单失败', err);
      util.showError('加载订单失败');
    }
  },

  // 评分改变
  onRatingChange(e) {
    const index = e.currentTarget.dataset.index;
    const rating = e.currentTarget.dataset.rating;
    
    const reviews = this.data.reviews;
    reviews[index].rating = rating;
    
    this.setData({
      reviews: reviews
    });
  },

  // 总体评分改变
  onOverallRatingChange(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({
      overallRating: rating
    });
  },

  // 评论输入
  onCommentInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    
    if (index === undefined) {
      // 总体评价
      this.setData({
        comment: value
      });
    } else {
      // 单个菜品评价
      const reviews = this.data.reviews;
      reviews[index].comment = value;
      this.setData({
        reviews: reviews
      });
    }
  },

  // 提交评价
  async onSubmitReview() {
    const { orderId, reviews, overallRating, comment } = this.data;

    if (!app.globalData.openid) {
      util.showError('请先登录');
      return;
    }

    util.showLoading('提交中...');

    try {
      // 保存每道菜的评价
      for (const review of reviews) {
        const reviewData = {
          openid: app.globalData.openid,
          orderId: orderId,
          dishId: review.dishId,
          dishName: review.dishName,
          rating: review.rating,
          comment: review.comment || '',
          overallRating: overallRating,
          overallComment: comment
        };
        
        if (app.globalData.demoMode) {
          // Demo模式：保存到本地存储
          await demoStorage.DemoReviewStorage.saveReview(reviewData);
        } else {
          // 云开发模式
          await db.ReviewDB.createReview(reviewData);
        }
      }

      // 更新订单的已评价状态
      if (app.globalData.demoMode) {
        const order = demoStorage.DemoOrderStorage.getOrderById(orderId);
        if (order) {
          order.hasReview = true;
          // 更新订单
          const orders = demoStorage.DemoOrderStorage.getAllOrders();
          const index = orders.findIndex(o => o._id === orderId);
          if (index !== -1) {
            orders[index] = order;
            wx.setStorageSync('demo_orders', orders);
          }
        }
      } else {
        await db.OrderDB.updateOrderStatus(orderId, 'completed');
      }

      util.hideLoading();
      
      const demoTip = this.data.demoMode ? '\n\n💡 当前为Demo模式\n评价保存在本地存储中' : '';
      
      wx.showModal({
        title: '评价成功',
        content: `感谢您的评价！${demoTip}`,
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
    } catch (err) {
      console.error('提交评价失败', err);
      util.hideLoading();
      util.showError('提交评价失败');
    }
  }
});
