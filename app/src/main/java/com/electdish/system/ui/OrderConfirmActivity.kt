package com.electdish.system.ui

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.adapter.OrderSummaryAdapter
import com.electdish.system.data.CartManager
import com.electdish.system.data.Order
import com.electdish.system.data.OrderStatus
import com.google.android.material.textfield.TextInputEditText

/**
 * 订单确认Activity
 */
class OrderConfirmActivity : AppCompatActivity() {

    private lateinit var toolbar: Toolbar
    private lateinit var addressEditText: TextInputEditText
    private lateinit var phoneEditText: TextInputEditText
    private lateinit var remarksEditText: TextInputEditText
    private lateinit var orderItemsRecyclerView: RecyclerView
    private lateinit var subtotalText: TextView
    private lateinit var deliveryFeeText: TextView
    private lateinit var totalAmountText: TextView
    private lateinit var submitOrderButton: Button

    private val deliveryFee = 5.0 // 配送费

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_confirm)

        initViews()
        setupToolbar()
        setupOrderItems()
        calculateTotal()
    }

    private fun initViews() {
        toolbar = findViewById(R.id.toolbar)
        addressEditText = findViewById(R.id.addressEditText)
        phoneEditText = findViewById(R.id.phoneEditText)
        remarksEditText = findViewById(R.id.remarksEditText)
        orderItemsRecyclerView = findViewById(R.id.orderItemsRecyclerView)
        subtotalText = findViewById(R.id.subtotalText)
        deliveryFeeText = findViewById(R.id.deliveryFeeText)
        totalAmountText = findViewById(R.id.totalAmountText)
        submitOrderButton = findViewById(R.id.submitOrderButton)

        submitOrderButton.setOnClickListener {
            submitOrder()
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun setupOrderItems() {
        val cartItems = CartManager.getCartItems()
        val adapter = OrderSummaryAdapter(cartItems)
        orderItemsRecyclerView.layoutManager = LinearLayoutManager(this)
        orderItemsRecyclerView.adapter = adapter
    }

    private fun calculateTotal() {
        val subtotal = CartManager.getTotalPrice()
        val total = subtotal + deliveryFee

        subtotalText.text = "¥%.2f".format(subtotal)
        deliveryFeeText.text = "¥%.2f".format(deliveryFee)
        totalAmountText.text = "¥%.2f".format(total)
    }

    private fun submitOrder() {
        val address = addressEditText.text?.toString()?.trim() ?: ""
        val phone = phoneEditText.text?.toString()?.trim() ?: ""
        val remarks = remarksEditText.text?.toString()?.trim() ?: ""

        // 验证输入
        if (address.isEmpty()) {
            addressEditText.error = getString(R.string.error_empty_address)
            addressEditText.requestFocus()
            return
        }

        if (phone.isEmpty()) {
            phoneEditText.error = getString(R.string.error_empty_phone)
            phoneEditText.requestFocus()
            return
        }

        if (!isValidPhone(phone)) {
            phoneEditText.error = getString(R.string.error_invalid_phone)
            phoneEditText.requestFocus()
            return
        }

        // 创建订单
        val order = Order(
            items = CartManager.getCartItems(),
            totalAmount = CartManager.getTotalPrice() + deliveryFee,
            deliveryAddress = address,
            phoneNumber = phone,
            remarks = remarks,
            status = OrderStatus.PENDING
        )

        // 显示订单成功对话框
        showOrderSuccessDialog(order)
    }

    private fun isValidPhone(phone: String): Boolean {
        // 简单的手机号验证（中国大陆11位手机号）
        val phoneRegex = "^1[3-9]\\d{9}$".toRegex()
        return phone.matches(phoneRegex)
    }

    private fun showOrderSuccessDialog(order: Order) {
        val message = buildString {
            append(getString(R.string.order_success))
            append("\n\n")
            append(getString(R.string.order_number, order.orderId.substring(0, 8)))
            append("\n")
            append(getString(R.string.order_status, getStatusString(order.status)))
            append("\n")
            append(getString(R.string.estimated_time))
        }

        AlertDialog.Builder(this)
            .setTitle("🎉 订单提交成功")
            .setMessage(message)
            .setCancelable(false)
            .setPositiveButton(R.string.back_to_home) { _, _ ->
                // 清空购物车
                CartManager.clear()
                
                // 返回主页面
                finish()
            }
            .show()

        // 实际应用中，这里应该：
        // 1. 将订单发送到服务器
        // 2. 保存订单到本地数据库
        // 3. 可能需要跳转到订单详情页面
        
        Toast.makeText(
            this,
            "订单已提交，配送员正在赶来的路上！",
            Toast.LENGTH_LONG
        ).show()
    }

    private fun getStatusString(status: OrderStatus): String {
        return when (status) {
            OrderStatus.PENDING -> getString(R.string.status_pending)
            OrderStatus.CONFIRMED -> getString(R.string.status_confirmed)
            OrderStatus.PREPARING -> getString(R.string.status_preparing)
            OrderStatus.DELIVERING -> getString(R.string.status_delivering)
            OrderStatus.COMPLETED -> getString(R.string.status_completed)
            OrderStatus.CANCELLED -> getString(R.string.status_cancelled)
        }
    }
}


