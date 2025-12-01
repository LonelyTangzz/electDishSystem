package com.electdish.system.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.adapter.CartAdapter
import com.electdish.system.data.CartItem
import com.electdish.system.data.CartManager

/**
 * 购物车Activity
 */
class CartActivity : AppCompatActivity() {

    private lateinit var toolbar: Toolbar
    private lateinit var cartRecyclerView: RecyclerView
    private lateinit var emptyCartLayout: LinearLayout
    private lateinit var totalPriceText: TextView
    private lateinit var checkoutButton: Button

    private lateinit var cartAdapter: CartAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cart)

        initViews()
        setupToolbar()
        setupAdapter()
        updateUI()
    }

    private fun initViews() {
        toolbar = findViewById(R.id.toolbar)
        cartRecyclerView = findViewById(R.id.cartRecyclerView)
        emptyCartLayout = findViewById(R.id.emptyCartLayout)
        totalPriceText = findViewById(R.id.totalPriceText)
        checkoutButton = findViewById(R.id.checkoutButton)

        // 结算按钮点击事件
        checkoutButton.setOnClickListener {
            if (!CartManager.isEmpty()) {
                val intent = Intent(this, OrderConfirmActivity::class.java)
                startActivity(intent)
            }
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun setupAdapter() {
        cartAdapter = CartAdapter(
            onQuantityChanged = { cartItem, newQuantity ->
                CartManager.updateQuantity(cartItem.dish.id, newQuantity)
                updateUI()
            },
            onRemoveItem = { cartItem ->
                showRemoveDialog(cartItem)
            }
        )
        cartRecyclerView.layoutManager = LinearLayoutManager(this)
        cartRecyclerView.adapter = cartAdapter
    }

    private fun updateUI() {
        val cartItems = CartManager.getCartItems()
        
        if (cartItems.isEmpty()) {
            emptyCartLayout.visibility = View.VISIBLE
            cartRecyclerView.visibility = View.GONE
            findViewById<View>(R.id.checkoutCard).visibility = View.GONE
        } else {
            emptyCartLayout.visibility = View.GONE
            cartRecyclerView.visibility = View.VISIBLE
            findViewById<View>(R.id.checkoutCard).visibility = View.VISIBLE
            
            cartAdapter.submitList(cartItems.toList())
            totalPriceText.text = "¥%.2f".format(CartManager.getTotalPrice())
        }
    }

    private fun showRemoveDialog(cartItem: CartItem) {
        AlertDialog.Builder(this)
            .setTitle(R.string.confirm)
            .setMessage("确定要移除 ${cartItem.dish.name} 吗？")
            .setPositiveButton(R.string.yes) { _, _ ->
                CartManager.removeDish(cartItem.dish.id)
                updateUI()
                Toast.makeText(this, "已移除", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton(R.string.no, null)
            .show()
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finish()
    }
}

