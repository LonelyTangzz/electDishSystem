package com.electdish.system.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

/**
 * 订单数据模型
 */
@Parcelize
data class Order(
    val orderId: String = UUID.randomUUID().toString(),
    val items: List<CartItem>,
    val totalAmount: Double,
    val orderTime: Long = System.currentTimeMillis(),
    val deliveryAddress: String,
    val phoneNumber: String,
    val remarks: String = "",
    val status: OrderStatus = OrderStatus.PENDING
) : Parcelable {
    
    /**
     * 格式化订单时间
     */
    fun getFormattedOrderTime(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        return sdf.format(Date(orderTime))
    }
    
    /**
     * 格式化总金额
     */
    fun getFormattedTotalAmount(): String {
        return "¥%.2f".format(totalAmount)
    }
    
    /**
     * 获取订单项数量
     */
    fun getTotalItemCount(): Int {
        return items.sumOf { it.quantity }
    }
}

/**
 * 订单状态枚举
 */
@Parcelize
enum class OrderStatus : Parcelable {
    PENDING,        // 待确认
    CONFIRMED,      // 已确认
    PREPARING,      // 准备中
    DELIVERING,     // 配送中
    COMPLETED,      // 已完成
    CANCELLED       // 已取消
}

