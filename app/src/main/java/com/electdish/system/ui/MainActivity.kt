package com.electdish.system.ui

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.electdish.system.R
import com.electdish.system.adapter.CategoryAdapter
import com.electdish.system.adapter.DishAdapter
import com.electdish.system.data.CartManager
import com.electdish.system.data.Dish
import com.electdish.system.data.DishCategory
import com.electdish.system.data.DishRepository
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton

/**
 * 主界面Activity
 */
class MainActivity : AppCompatActivity() {

    private lateinit var searchEditText: EditText
    private lateinit var categoryRecyclerView: RecyclerView
    private lateinit var dishRecyclerView: RecyclerView
    private lateinit var cartButton: ExtendedFloatingActionButton

    private lateinit var categoryAdapter: CategoryAdapter
    private lateinit var dishAdapter: DishAdapter

    private var currentCategory = DishCategory.ALL
    private var allDishes = listOf<Dish>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        setupAdapters()
        loadDishes()
        updateCartButton()
    }

    override fun onResume() {
        super.onResume()
        // 从购物车页面返回时更新按钮和列表
        updateCartButton()
        dishAdapter.notifyDataSetChanged()
    }

    private fun initViews() {
        searchEditText = findViewById(R.id.searchEditText)
        categoryRecyclerView = findViewById(R.id.categoryRecyclerView)
        dishRecyclerView = findViewById(R.id.dishRecyclerView)
        cartButton = findViewById(R.id.cartButton)

        // 设置搜索监听
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                filterDishes(s?.toString() ?: "")
            }
        })

        // 购物车按钮点击事件
        cartButton.setOnClickListener {
            if (CartManager.isEmpty()) {
                Toast.makeText(this, R.string.cart_empty, Toast.LENGTH_SHORT).show()
            } else {
                val intent = Intent(this, CartActivity::class.java)
                startActivity(intent)
            }
        }
    }

    private fun setupAdapters() {
        // 分类适配器
        categoryAdapter = CategoryAdapter(
            DishCategory.getAllCategories()
        ) { category ->
            currentCategory = category
            filterDishes(searchEditText.text.toString())
        }
        categoryRecyclerView.layoutManager = LinearLayoutManager(
            this,
            LinearLayoutManager.HORIZONTAL,
            false
        )
        categoryRecyclerView.adapter = categoryAdapter

        // 菜品适配器
        dishAdapter = DishAdapter(
            onDishClick = { dish ->
                // 可以在这里添加菜品详情页面
                Toast.makeText(this, dish.name, Toast.LENGTH_SHORT).show()
            },
            onAddToCart = { dish ->
                CartManager.addDish(dish)
                updateCartButton()
                Toast.makeText(
                    this,
                    "${dish.name} ${getString(R.string.add_to_cart)}",
                    Toast.LENGTH_SHORT
                ).show()
                dishAdapter.notifyDataSetChanged()
            }
        )
        dishRecyclerView.layoutManager = LinearLayoutManager(this)
        dishRecyclerView.adapter = dishAdapter
    }

    private fun loadDishes() {
        allDishes = DishRepository.getAllDishes()
        filterDishes("")
    }

    private fun filterDishes(query: String) {
        val filtered = if (query.isBlank()) {
            // 按分类过滤
            if (currentCategory == DishCategory.ALL) {
                allDishes
            } else {
                allDishes.filter { it.category == currentCategory.displayName }
            }
        } else {
            // 搜索过滤
            val categoryFiltered = if (currentCategory == DishCategory.ALL) {
                allDishes
            } else {
                allDishes.filter { it.category == currentCategory.displayName }
            }
            categoryFiltered.filter {
                it.name.contains(query, ignoreCase = true) ||
                it.description.contains(query, ignoreCase = true)
            }
        }
        dishAdapter.submitList(filtered)
    }

    private fun updateCartButton() {
        val itemCount = CartManager.getItemCount()
        if (itemCount > 0) {
            cartButton.text = getString(R.string.cart_count, itemCount)
        } else {
            cartButton.text = getString(R.string.cart)
        }
    }
}

