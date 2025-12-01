package com.electdish.system.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * 菜品数据模型
 */
@Parcelize
data class Dish(
    val id: String,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String,
    val category: String,
    val isAvailable: Boolean = true,
    val rating: Float = 0f,
    val soldCount: Int = 0
) : Parcelable {
    
    /**
     * 格式化价格显示
     */
    fun getFormattedPrice(): String {
        return "¥%.2f".format(price)
    }
    
    /**
     * 获取菜品简介（如果描述太长则截断）
     */
    fun getShortDescription(maxLength: Int = 50): String {
        return if (description.length > maxLength) {
            description.substring(0, maxLength) + "..."
        } else {
            description
        }
    }
}

