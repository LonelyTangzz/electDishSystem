package com.electdish.system.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.data.CartItem

/**
 * 订单摘要适配器
 */
class OrderSummaryAdapter(
    private val items: List<CartItem>
) : RecyclerView.Adapter<OrderSummaryAdapter.OrderSummaryViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderSummaryViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_order_summary, parent, false)
        return OrderSummaryViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrderSummaryViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class OrderSummaryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val itemName: TextView = itemView.findViewById(R.id.orderItemName)
        private val itemQuantity: TextView = itemView.findViewById(R.id.orderItemQuantity)
        private val itemPrice: TextView = itemView.findViewById(R.id.orderItemPrice)

        fun bind(cartItem: CartItem) {
            itemName.text = cartItem.dish.name
            itemQuantity.text = "x${cartItem.quantity}"
            itemPrice.text = cartItem.getFormattedTotalPrice()
        }
    }
}

