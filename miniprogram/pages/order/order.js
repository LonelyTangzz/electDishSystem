// pages/order/order.js
const cartManager = require('../../utils/cartManager.js');
const util = require('../../utils/util.js');
const db = require('../../utils/db.js');
const demoStorage = require('../../utils/demoStorage.js');

const app = getApp();

Page({
  data: {
    cartItems: [],
    subtotal: '0.00',
    deliveryFee: '5.00',
    totalAmount: '0.00',
    subtotalStars: 0,  // 小计爱心数
    deliveryStars: 1,  // 配送费：1颗爱心
    totalStars: 0,     // 总爱心数
    contactName: '',
    remarks: '',
    demoMode: true
  },

  onLoad() {
    console.log('订单页面加载');
    this.loadOrderData();
    this.setData({
      demoMode: app.globalData.demoMode
    });
    
    // 自动填充联系人姓名（从用户信息获取）
    this.autoFillContactName();
  },

  // 自动填充联系人
  autoFillContactName() {
    const userInfo = app.getUserInfo();
    if (userInfo && userInfo.nickName) {
      console.log('自动填充联系人:', userInfo.nickName);
      this.setData({
        contactName: userInfo.nickName
      });
    }
  },

  // 加载订单数据
  loadOrderData() {
    const dishData = require('../../utils/dishData.js');
    const cartItems = cartManager.getCartItems();
    const subtotal = cartManager.getTotalPrice();
    const deliveryFee = 5.0;
    const totalAmount = subtotal + deliveryFee;

    // 格式化订单项的价格和爱心数
    const formattedCartItems = cartItems.map(item => {
      // 从最新的菜品数据中获取stars字段
      const latestDish = dishData.getDishById(item.dish.id || item.dish._id);
      const stars = latestDish ? latestDish.stars : (item.dish.stars || 0);
      
      return {
        dish: {
          ...item.dish,
          stars: stars  // 更新stars字段
        },
        quantity: item.quantity,
        itemTotal: (item.dish.price * item.quantity).toFixed(2),
        totalStars: stars * item.quantity  // 计算每项的爱心数
      };
    });

    // 计算总爱心数
    const subtotalStars = formattedCartItems.reduce((sum, item) => sum + item.totalStars, 0);
    const deliveryStars = 1;  // 配送费：1颗爱心
    const totalStars = subtotalStars + deliveryStars;

    console.log('订单数据加载完成:', {
      商品数量: formattedCartItems.length,
      小计: subtotal,
      小计爱心: subtotalStars,
      配送费: deliveryFee,
      配送爱心: deliveryStars,
      总计: totalAmount,
      总爱心: totalStars
    });

    this.setData({
      cartItems: formattedCartItems,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      subtotalStars: subtotalStars,
      deliveryStars: deliveryStars,
      totalStars: totalStars
    });
  },

  // 输入联系人
  onContactNameInput(e) {
    this.setData({
      contactName: e.detail.value
    });
  },

  // 输入备注
  onRemarksInput(e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  // 提交订单
  async onSubmitOrder() {
    const { contactName, cartItems, totalAmount, remarks } = this.data;

    console.log('===== 开始提交订单 =====');

    // 验证输入
    if (!contactName || contactName.trim() === '') {
      util.showError('请输入联系人姓名');
      return;
    }

    if (cartItems.length === 0) {
      util.showError('购物车为空');
      return;
    }

    // 检查是否登录
    if (!app.globalData.openid) {
      console.log('用户未登录，跳转到登录页');
      wx.showModal({
        title: '需要登录',
        content: '请先登录后再提交订单',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine'
            });
          }
        }
      });
      return;
    }

    util.showLoading('提交中...');

    try {
      // 获取配对的伴侣 openid
      const partnerOpenid = app.globalData.partnerOpenid || '';
      
      // 创建订单数据
      const orderData = {
        openid: app.globalData.openid,
        contactName: contactName.trim(),
        items: cartItems,
        totalAmount: parseFloat(totalAmount),
        remarks: remarks || '',
        status: 'pending',
        hasReview: false,
        forChef: partnerOpenid  // 分配给配对的另一方
      };

      console.log('订单数据:', orderData);
      console.log('订单将分配给:', partnerOpenid || '（未配对）');

      let result;
      
      // Demo模式：使用本地存储
      if (app.globalData.demoMode) {
        result = demoStorage.DemoOrderStorage.saveOrder(orderData);
      } else {
        // 云开发模式：提交到云数据库
        result = await db.OrderDB.createOrder(orderData);
      }

      util.hideLoading();

      if (result.success) {
        this.showOrderSuccess(result.orderId);
      } else {
        util.showError('订单提交失败，请重试');
      }
    } catch (err) {
      console.error('提交订单失败', err);
      util.hideLoading();
      util.showError('订单提交失败');
    }
  },

  // 显示订单成功
  showOrderSuccess(orderId) {
    const shortId = orderId.substring(0, 10);
    const demoTip = this.data.demoMode ? '\n\n💡 当前为Demo模式\n订单保存在本地存储中' : '';
    
    // 先清空购物车
    console.log('===== 清空购物车 =====');
    console.log('清空前购物车商品数量:', cartManager.getItemCount());
    
    cartManager.clear();
    
    console.log('清空后购物车商品数量:', cartManager.getItemCount());
    console.log('购物车是否为空:', cartManager.isEmpty());
    
    // 更新全局购物车计数
    app.updateCartCount();
    
    wx.showModal({
      title: '🎉 订单提交成功',
      content: `订单号：${shortId}\n联系人：${this.data.contactName}\n订单状态：待确认\n预计 30 分钟送达${demoTip}`,
      showCancel: false,
      confirmText: '返回首页',
      success: (res) => {
        if (res.confirm) {
          // 返回首页
          wx.switchTab({
            url: '/pages/index/index',
            success: () => {
              console.log('✅ 已返回首页');
              setTimeout(() => {
                util.showSuccess('订单已提交，配送员正在赶来！', 2000);
              }, 500);
            }
          });
        }
      }
    });
  }
});
