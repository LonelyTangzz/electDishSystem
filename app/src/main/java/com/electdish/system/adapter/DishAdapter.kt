package com.electdish.system.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.data.CartManager
import com.electdish.system.data.Dish

/**
 * 菜品列表适配器
 */
class DishAdapter(
    private val onDishClick: (Dish) -> Unit,
    private val onAddToCart: (Dish) -> Unit
) : ListAdapter<Dish, DishAdapter.DishViewHolder>(DishDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DishViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_dish, parent, false)
        return DishViewHolder(view)
    }

    override fun onBindViewHolder(holder: DishViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class DishViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val dishImage: ImageView = itemView.findViewById(R.id.dishImage)
        private val dishName: TextView = itemView.findViewById(R.id.dishName)
        private val dishDescription: TextView = itemView.findViewById(R.id.dishDescription)
        private val dishPrice: TextView = itemView.findViewById(R.id.dishPrice)
        private val dishRating: TextView = itemView.findViewById(R.id.dishRating)
        private val dishSoldCount: TextView = itemView.findViewById(R.id.dishSoldCount)
        private val addToCartButton: Button = itemView.findViewById(R.id.addToCartButton)
        private val cartQuantity: TextView = itemView.findViewById(R.id.cartQuantity)

        fun bind(dish: Dish) {
            dishName.text = dish.name
            dishDescription.text = dish.getShortDescription(40)
            dishPrice.text = dish.getFormattedPrice()
            dishRating.text = "⭐ ${dish.rating}"
            dishSoldCount.text = itemView.context.getString(R.string.sold_count, dish.soldCount)

            // 设置图片（这里使用占位符，实际项目中可以使用Glide或Picasso加载网络图片）
            dishImage.setImageResource(R.drawable.ic_dish_placeholder)

            // 显示购物车中的数量
            val quantity = CartManager.getDishQuantity(dish.id)
            if (quantity > 0) {
                cartQuantity.visibility = View.VISIBLE
                cartQuantity.text = quantity.toString()
            } else {
                cartQuantity.visibility = View.GONE
            }

            // 根据是否可用设置状态
            if (!dish.isAvailable) {
                addToCartButton.isEnabled = false
                addToCartButton.text = itemView.context.getString(R.string.unavailable)
            } else {
                addToCartButton.isEnabled = true
                addToCartButton.text = itemView.context.getString(R.string.add_to_cart)
            }

            // 点击事件
            itemView.setOnClickListener {
                onDishClick(dish)
            }

            addToCartButton.setOnClickListener {
                if (dish.isAvailable) {
                    onAddToCart(dish)
                    // 更新数量显示
                    val newQuantity = CartManager.getDishQuantity(dish.id)
                    cartQuantity.visibility = View.VISIBLE
                    cartQuantity.text = newQuantity.toString()
                }
            }
        }
    }

    private class DishDiffCallback : DiffUtil.ItemCallback<Dish>() {
        override fun areItemsTheSame(oldItem: Dish, newItem: Dish): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Dish, newItem: Dish): Boolean {
            return oldItem == newItem
        }
    }
}

