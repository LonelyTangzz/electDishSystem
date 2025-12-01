// pages/index/index.js
const cartManager = require('../../utils/cartManager.js');
const util = require('../../utils/util.js');
const db = require('../../utils/db.js');
const dishData = require('../../utils/dishData.js');

const app = getApp();

Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'hot', name: '热菜' },
      { id: 'cold', name: '凉菜' },
      { id: 'soup', name: '汤类' },
      { id: 'staple', name: '主食' },
      { id: 'dessert', name: '甜品' },
      { id: 'drinks', name: '饮料' }
    ],
    currentCategory: 'all',
    allDishes: [],
    filteredDishes: [],
    searchKeyword: '',
    loading: true,
    demoMode: true
  },

  onLoad() {
    console.log('========== 首页加载开始 ==========');
    this.setData({
      demoMode: app.globalData.demoMode
    });
    
    console.log('Demo模式:', app.globalData.demoMode);
    
    // 加载菜品
    if (app.globalData.demoMode) {
      this.loadDishesFromLocal();
    } else {
      this.loadDishesFromDB();
    }
  },

  onShow() {
    console.log('首页 onShow');
    // 刷新购物车数据
    this.updateCartBadges();
    // 强制更新TabBar徽标
    app.updateCartCount();
  },

  // 从本地加载菜品（Demo模式）
  loadDishesFromLocal() {
    console.log('========== 开始加载本地菜品 ==========');
    
    try {
      let dishes = null;
      
      if (dishData.dishes) {
        dishes = dishData.dishes;
        console.log('✅ 方式1成功: dishData.dishes');
      } else if (dishData.getAllDishes) {
        dishes = dishData.getAllDishes();
        console.log('✅ 方式2成功: dishData.getAllDishes()');
      }
      
      if (!dishes || !Array.isArray(dishes)) {
        console.error('❌ 无法获取菜品数据');
        this.setData({
          allDishes: [],
          filteredDishes: [],
          loading: false
        });
        return;
      }
      
      console.log('✅ 加载到的菜品数量:', dishes.length);
      
      this.setData({
        allDishes: dishes,
        filteredDishes: dishes,
        loading: false
      }, () => {
        console.log('✅ 页面数据已更新');
        console.log('========== 加载完成 ==========');
      });
      
    } catch (err) {
      console.error('❌ 加载本地菜品数据失败:', err);
      this.setData({
        allDishes: [],
        filteredDishes: [],
        loading: false
      });
    }
  },

  // 从云数据库加载菜品
  async loadDishesFromDB() {
    this.setData({ loading: true });

    try {
      const dishes = await db.DishDB.getAllDishes();
      
      if (dishes && dishes.length > 0) {
        console.log('从云数据库加载菜品成功', dishes.length);
        this.setData({
          allDishes: dishes,
          filteredDishes: dishes,
          loading: false
        });
      } else {
        console.log('云数据库暂无数据，使用本地数据');
        this.loadDishesFromLocal();
      }
    } catch (err) {
      console.error('加载菜品失败，使用本地数据', err);
      this.loadDishesFromLocal();
    }
  },

  // 分类切换
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    console.log('切换分类:', categoryId);
    this.setData({
      currentCategory: categoryId,
      searchKeyword: ''
    });
    this.filterDishes();
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterDishes();
  },

  // 清除搜索
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      currentCategory: 'all'
    });
    this.filterDishes();
  },

  // 过滤菜品
  filterDishes() {
    const { allDishes, currentCategory, searchKeyword } = this.data;
    
    if (!Array.isArray(allDishes)) {
      console.error('❌ allDishes 不是数组:', allDishes);
      this.setData({ filteredDishes: [] });
      return;
    }
    
    let filtered = [...allDishes];

    if (currentCategory && currentCategory !== 'all') {
      filtered = filtered.filter(dish => dish.category === currentCategory);
    }

    if (searchKeyword && searchKeyword.trim() !== '') {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(dish => 
        (dish.name && dish.name.toLowerCase().includes(keyword)) ||
        (dish.description && dish.description.toLowerCase().includes(keyword))
      );
    }

    this.setData({
      filteredDishes: filtered
    });
  },

  // 增加数量
  onIncrease(e) {
    const dishId = e.currentTarget.dataset.id;
    const dish = this.data.allDishes.find(d => d.id === dishId || d._id === dishId);
    
    if (dish) {
      cartManager.addItem(dish);
      this.updateCartBadges();
      app.updateCartCount();
      util.showSuccess('已添加到购物车');
    }
  },

  // 减少数量
  onDecrease(e) {
    const dishId = e.currentTarget.dataset.id;
    const dish = this.data.allDishes.find(d => d.id === dishId || d._id === dishId);
    
    if (dish) {
      const removed = cartManager.removeItem(dish);
      this.updateCartBadges();
      app.updateCartCount();
      
      if (removed) {
        util.showSuccess('已从购物车移除');
      }
    }
  },

  // 更新购物车徽标
  updateCartBadges() {
    this.setData({
      filteredDishes: this.data.filteredDishes
    });
  },

  // 获取菜品数量
  getDishQuantity(dishId) {
    return cartManager.getItemQuantity(dishId) || 0;
  }
});
