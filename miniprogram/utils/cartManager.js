// 购物车管理器
const CART_KEY = 'cart';

/**
 * 获取购物车数据
 */
function getCart() {
  try {
    const cart = wx.getStorageSync(CART_KEY);
    return cart || [];
  } catch (err) {
    console.error('获取购物车失败', err);
    return [];
  }
}

/**
 * 保存购物车数据
 */
function saveCart(cart) {
  try {
    wx.setStorageSync(CART_KEY, cart);
    return true;
  } catch (err) {
    console.error('保存购物车失败', err);
    return false;
  }
}

/**
 * 添加菜品到购物车
 */
function addItem(dish) {
  const cart = getCart();
  const dishId = dish.id || dish._id;
  
  // 查找是否已存在
  const existingItem = cart.find(item => {
    const itemDishId = item.dish.id || item.dish._id;
    return itemDishId === dishId;
  });
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      dish: dish,
      quantity: 1
    });
  }
  
  saveCart(cart);
  return true;
}

/**
 * 从购物车移除菜品（减少数量）
 */
function removeItem(dish) {
  const cart = getCart();
  const dishId = dish.id || dish._id;
  
  // 查找商品
  const index = cart.findIndex(item => {
    const itemDishId = item.dish.id || item.dish._id;
    return itemDishId === dishId;
  });
  
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      saveCart(cart);
      return false; // 未完全移除
    } else {
      cart.splice(index, 1);
      saveCart(cart);
      return true; // 完全移除
    }
  }
  
  return false;
}

/**
 * 删除购物车中的某项
 */
function deleteItem(dishId) {
  const cart = getCart();
  const index = cart.findIndex(item => {
    const itemDishId = item.dish.id || item.dish._id;
    return itemDishId === dishId;
  });
  
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    return true;
  }
  
  return false;
}

/**
 * 获取购物车商品列表
 */
function getCartItems() {
  return getCart();
}

/**
 * 获取某个菜品在购物车中的数量
 */
function getItemQuantity(dishId) {
  const cart = getCart();
  const item = cart.find(item => {
    const itemDishId = item.dish.id || item.dish._id;
    return itemDishId === dishId;
  });
  
  return item ? item.quantity : 0;
}

/**
 * 获取购物车商品总数
 */
function getItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * 获取购物车总价
 */
function getTotalPrice() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + (item.dish.price * item.quantity);
  }, 0);
}

/**
 * 清空购物车
 */
function clear() {
  console.log('🗑️ 执行清空购物车操作');
  try {
    wx.removeStorageSync(CART_KEY);
    console.log('✅ 购物车已清空');
    return true;
  } catch (err) {
    console.error('❌ 清空购物车失败', err);
    return false;
  }
}

/**
 * 检查购物车是否为空
 */
function isEmpty() {
  const cart = getCart();
  return cart.length === 0;
}

module.exports = {
  addItem,
  removeItem,
  deleteItem,
  getCartItems,
  getItemQuantity,
  getItemCount,
  getTotalPrice,
  clear,
  isEmpty
};
