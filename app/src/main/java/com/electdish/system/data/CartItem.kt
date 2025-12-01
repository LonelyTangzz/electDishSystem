package com.electdish.system.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * 购物车项数据模型
 */
@Parcelize
data class CartItem(
    val dish: Dish,
    var quantity: Int = 1
) : Parcelable {
    
    /**
     * 计算该项总价
     */
    fun getTotalPrice(): Double {
        return dish.price * quantity
    }
    
    /**
     * 格式化总价显示
     */
    fun getFormattedTotalPrice(): String {
        return "¥%.2f".format(getTotalPrice())
    }
    
    /**
     * 增加数量
     */
    fun incrementQuantity() {
        quantity++
    }
    
    /**
     * 减少数量
     */
    fun decrementQuantity() {
        if (quantity > 1) {
            quantity--
        }
    }
}

