package com.electdish.system.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.data.DishCategory

/**
 * 分类适配器
 */
class CategoryAdapter(
    private val categories: List<DishCategory>,
    private val onCategorySelected: (DishCategory) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder>() {

    private var selectedPosition = 0

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CategoryViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_category, parent, false)
        return CategoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: CategoryViewHolder, position: Int) {
        holder.bind(categories[position], position == selectedPosition)
    }

    override fun getItemCount(): Int = categories.size

    fun setSelectedPosition(position: Int) {
        val previousPosition = selectedPosition
        selectedPosition = position
        notifyItemChanged(previousPosition)
        notifyItemChanged(selectedPosition)
    }

    inner class CategoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val categoryName: TextView = itemView.findViewById(R.id.categoryName)

        fun bind(category: DishCategory, isSelected: Boolean) {
            categoryName.text = category.displayName

            // 设置选中状态
            if (isSelected) {
                categoryName.setBackgroundResource(R.drawable.bg_category_selected)
                categoryName.setTextColor(ContextCompat.getColor(itemView.context, R.color.text_white))
            } else {
                categoryName.setBackgroundResource(R.drawable.bg_category_normal)
                categoryName.setTextColor(ContextCompat.getColor(itemView.context, R.color.text_primary))
            }

            itemView.setOnClickListener {
                if (adapterPosition != RecyclerView.NO_POSITION && adapterPosition != selectedPosition) {
                    setSelectedPosition(adapterPosition)
                    onCategorySelected(category)
                }
            }
        }
    }
}

