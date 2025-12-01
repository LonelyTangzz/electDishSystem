package com.electdish.system.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.data.CartItem

/**
 * 购物车适配器
 */
class CartAdapter(
    private val onQuantityChanged: (CartItem, Int) -> Unit,
    private val onRemoveItem: (CartItem) -> Unit
) : ListAdapter<CartItem, CartAdapter.CartViewHolder>(CartItemDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cart, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class CartViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val dishImage: ImageView = itemView.findViewById(R.id.cartDishImage)
        private val dishName: TextView = itemView.findViewById(R.id.cartDishName)
        private val dishPrice: TextView = itemView.findViewById(R.id.cartDishPrice)
        private val quantityText: TextView = itemView.findViewById(R.id.quantityText)
        private val decreaseButton: ImageButton = itemView.findViewById(R.id.decreaseButton)
        private val increaseButton: ImageButton = itemView.findViewById(R.id.increaseButton)
        private val totalPrice: TextView = itemView.findViewById(R.id.cartItemTotalPrice)
        private val removeButton: ImageButton = itemView.findViewById(R.id.removeButton)

        fun bind(cartItem: CartItem) {
            val dish = cartItem.dish
            
            dishName.text = dish.name
            dishPrice.text = dish.getFormattedPrice()
            quantityText.text = cartItem.quantity.toString()
            totalPrice.text = cartItem.getFormattedTotalPrice()

            // 设置图片
            dishImage.setImageResource(R.drawable.ic_dish_placeholder)

            // 减少数量
            decreaseButton.setOnClickListener {
                if (cartItem.quantity > 1) {
                    onQuantityChanged(cartItem, cartItem.quantity - 1)
                } else {
                    onRemoveItem(cartItem)
                }
            }

            // 增加数量
            increaseButton.setOnClickListener {
                onQuantityChanged(cartItem, cartItem.quantity + 1)
            }

            // 移除按钮
            removeButton.setOnClickListener {
                onRemoveItem(cartItem)
            }
        }
    }

    private class CartItemDiffCallback : DiffUtil.ItemCallback<CartItem>() {
        override fun areItemsTheSame(oldItem: CartItem, newItem: CartItem): Boolean {
            return oldItem.dish.id == newItem.dish.id
        }

        override fun areContentsTheSame(oldItem: CartItem, newItem: CartItem): Boolean {
            return oldItem == newItem
        }
    }
}

