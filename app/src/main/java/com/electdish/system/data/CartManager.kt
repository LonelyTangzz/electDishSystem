package com.electdish.system.data

/**
 * 购物车管理器（单例模式）
 */
object CartManager {
    private val cartItems = mutableListOf<CartItem>()
    
    /**
     * 添加菜品到购物车
     */
    fun addDish(dish: Dish) {
        val existingItem = cartItems.find { it.dish.id == dish.id }
        if (existingItem != null) {
            existingItem.incrementQuantity()
        } else {
            cartItems.add(CartItem(dish, 1))
        }
    }
    
    /**
     * 从购物车移除菜品
     */
    fun removeDish(dishId: String) {
        cartItems.removeAll { it.dish.id == dishId }
    }
    
    /**
     * 更新购物车项数量
     */
    fun updateQuantity(dishId: String, quantity: Int) {
        val item = cartItems.find { it.dish.id == dishId }
        if (item != null) {
            if (quantity > 0) {
                item.quantity = quantity
            } else {
                removeDish(dishId)
            }
        }
    }
    
    /**
     * 增加数量
     */
    fun incrementQuantity(dishId: String) {
        cartItems.find { it.dish.id == dishId }?.incrementQuantity()
    }
    
    /**
     * 减少数量
     */
    fun decrementQuantity(dishId: String) {
        val item = cartItems.find { it.dish.id == dishId }
        if (item != null) {
            if (item.quantity > 1) {
                item.decrementQuantity()
            } else {
                removeDish(dishId)
            }
        }
    }
    
    /**
     * 获取购物车所有项
     */
    fun getCartItems(): List<CartItem> {
        return cartItems.toList()
    }
    
    /**
     * 获取购物车项数量
     */
    fun getItemCount(): Int {
        return cartItems.sumOf { it.quantity }
    }
    
    /**
     * 计算购物车总价
     */
    fun getTotalPrice(): Double {
        return cartItems.sumOf { it.getTotalPrice() }
    }
    
    /**
     * 清空购物车
     */
    fun clear() {
        cartItems.clear()
    }
    
    /**
     * 检查购物车是否为空
     */
    fun isEmpty(): Boolean {
        return cartItems.isEmpty()
    }
    
    /**
     * 获取菜品在购物车中的数量
     */
    fun getDishQuantity(dishId: String): Int {
        return cartItems.find { it.dish.id == dishId }?.quantity ?: 0
    }
}

