// pages/cart/cart.js
const cartManager = require('../../utils/cartManager.js');
const util = require('../../utils/util.js');

const app = getApp();

Page({
  data: {
    cartItems: [],
    totalPrice: '0.00',
    formattedTotalPrice: '0.00',
    isEmpty: true
  },

  onLoad() {
    console.log('购物车页面 onLoad');
  },

  onShow() {
    console.log('购物车页面 onShow');
    this.loadCartData();
    // 强制更新TabBar徽标
    app.updateCartCount();
  },

  // 加载购物车数据
  loadCartData() {
    const dishData = require('../../utils/dishData.js');
    
    const cartItems = cartManager.getCartItems().map(item => {
      // 从最新的菜品数据中获取stars字段
      const latestDish = dishData.getDishById(item.dish.id || item.dish._id);
      const stars = latestDish ? latestDish.stars : (item.dish.stars || 0);
      
      return {
        ...item,
        dish: {
          ...item.dish,
          stars: stars  // 更新stars字段
        },
        itemTotal: (item.dish.price * item.quantity).toFixed(2),
        totalStars: stars * item.quantity  // 计算总爱心数
      };
    });
    const totalPrice = cartManager.getTotalPrice();
    const isEmpty = cartManager.isEmpty();
    
    // 计算总爱心数
    const totalStars = cartItems.reduce((sum, item) => sum + item.totalStars, 0);

    console.log('购物车数据:', {
      商品数量: cartItems.length,
      总价: totalPrice,
      总爱心数: totalStars,
      是否为空: isEmpty
    });

    this.setData({
      cartItems: cartItems,
      totalPrice: totalPrice,
      formattedTotalPrice: totalPrice.toFixed(2),
      totalStars: totalStars,  // 总爱心数
      isEmpty: isEmpty
    });
  },

  // 增加数量
  onIncrease(e) {
    const dishId = e.currentTarget.dataset.id;
    const item = this.data.cartItems.find(item => {
      const itemDishId = item.dish.id || item.dish._id;
      return itemDishId === dishId;
    });
    
    if (item) {
      cartManager.addItem(item.dish);
      this.loadCartData();
      app.updateCartCount();
    }
  },

  // 减少数量
  onDecrease(e) {
    const dishId = e.currentTarget.dataset.id;
    const item = this.data.cartItems.find(item => {
      const itemDishId = item.dish.id || item.dish._id;
      return itemDishId === dishId;
    });
    
    if (item) {
      cartManager.removeItem(item.dish);
      this.loadCartData();
      app.updateCartCount();
    }
  },

  // 删除商品
  onRemove(e) {
    const dishId = e.currentTarget.dataset.id;
    const dishName = e.currentTarget.dataset.name;
    
    util.showConfirm('确认删除', `确定要从购物车移除 "${dishName}" 吗？`).then(confirm => {
      if (confirm) {
        cartManager.deleteItem(dishId);
        this.loadCartData();
        app.updateCartCount();
        util.showSuccess('已删除');
      }
    });
  },

  // 清空购物车
  onClear() {
    if (this.data.isEmpty) {
      return;
    }
    
    util.showConfirm('清空购物车', '确定要清空购物车吗？').then(confirm => {
      if (confirm) {
        cartManager.clear();
        this.loadCartData();
        app.updateCartCount();
        util.showSuccess('已清空购物车');
      }
    });
  },

  // 去结算
  onCheckout() {
    console.log('===== 点击去结算按钮 =====');
    console.log('购物车是否为空:', this.data.isEmpty);
    console.log('商品数量:', this.data.cartItems.length);
    
    if (this.data.isEmpty) {
      console.log('❌ 购物车为空');
      util.showError('购物车还是空的');
      return;
    }
    
    console.log('✅ 开始跳转到订单页面');
    wx.navigateTo({
      url: '/pages/order/order',
      success: () => {
        console.log('✅ 跳转成功');
      },
      fail: (err) => {
        console.error('❌ 跳转失败:', err);
        wx.showModal({
          title: '跳转失败',
          content: JSON.stringify(err),
          showCancel: false
        });
      }
    });
  },

  // 去首页点餐
  goToIndex(e) {
    console.log('===== 点击去点餐按钮 =====');
    
    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        console.log('✅ 跳转首页成功');
      },
      fail: (err) => {
        console.error('❌ 跳转首页失败:', err);
        util.showError('跳转失败');
      }
    });
  }
});
