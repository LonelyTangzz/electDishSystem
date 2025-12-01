package com.electdish.system.data

/**
 * 菜品分类枚举
 */
enum class DishCategory(val displayName: String) {
    ALL("全部"),
    HOT_DISHES("热菜"),
    COLD_DISHES("凉菜"),
    SOUP("汤类"),
    STAPLE("主食"),
    DESSERT("甜品"),
    DRINKS("饮料");
    
    companion object {
        /**
         * 获取所有分类
         */
        fun getAllCategories(): List<DishCategory> {
            return values().toList()
        }
        
        /**
         * 根据显示名称获取分类
         */
        fun fromDisplayName(displayName: String): DishCategory {
            return values().find { it.displayName == displayName } ?: ALL
        }
    }
}

