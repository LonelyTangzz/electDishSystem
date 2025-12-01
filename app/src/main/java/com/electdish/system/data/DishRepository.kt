package com.electdish.system.data

/**
 * 菜品数据仓库
 * 这里使用模拟数据，实际应用中可以从网络或数据库获取
 */
object DishRepository {
    
    /**
     * 获取所有菜品
     */
    fun getAllDishes(): List<Dish> {
        return listOf(
            // 热菜
            Dish(
                id = "1",
                name = "宫保鸡丁",
                description = "经典川菜，鸡肉鲜嫩，花生酥脆，麻辣鲜香",
                price = 38.0,
                imageUrl = "",
                category = DishCategory.HOT_DISHES.displayName,
                rating = 4.8f,
                soldCount = 256
            ),
            Dish(
                id = "2",
                name = "鱼香肉丝",
                description = "酸甜可口，色泽红润，肉丝嫩滑",
                price = 32.0,
                imageUrl = "",
                category = DishCategory.HOT_DISHES.displayName,
                rating = 4.7f,
                soldCount = 189
            ),
            Dish(
                id = "3",
                name = "麻婆豆腐",
                description = "麻辣鲜香，豆腐滑嫩，下饭神器",
                price = 28.0,
                imageUrl = "",
                category = DishCategory.HOT_DISHES.displayName,
                rating = 4.9f,
                soldCount = 312
            ),
            Dish(
                id = "4",
                name = "红烧排骨",
                description = "色泽红亮，肉质酥烂，咸甜适中",
                price = 48.0,
                imageUrl = "",
                category = DishCategory.HOT_DISHES.displayName,
                rating = 4.6f,
                soldCount = 178
            ),
            Dish(
                id = "5",
                name = "清蒸鲈鱼",
                description = "鱼肉鲜嫩，原汁原味，营养健康",
                price = 68.0,
                imageUrl = "",
                category = DishCategory.HOT_DISHES.displayName,
                rating = 4.8f,
                soldCount = 145
            ),
            
            // 凉菜
            Dish(
                id = "6",
                name = "拍黄瓜",
                description = "清爽可口，蒜香浓郁，开胃小菜",
                price = 12.0,
                imageUrl = "",
                category = DishCategory.COLD_DISHES.displayName,
                rating = 4.5f,
                soldCount = 234
            ),
            Dish(
                id = "7",
                name = "凉拌木耳",
                description = "口感爽脆，营养丰富，清淡健康",
                price = 15.0,
                imageUrl = "",
                category = DishCategory.COLD_DISHES.displayName,
                rating = 4.4f,
                soldCount = 167
            ),
            Dish(
                id = "8",
                name = "夫妻肺片",
                description = "麻辣鲜香，牛肉薄而不柴，川菜经典",
                price = 36.0,
                imageUrl = "",
                category = DishCategory.COLD_DISHES.displayName,
                rating = 4.7f,
                soldCount = 198
            ),
            
            // 汤类
            Dish(
                id = "9",
                name = "番茄蛋花汤",
                description = "酸甜开胃，营养丰富，老少皆宜",
                price = 18.0,
                imageUrl = "",
                category = DishCategory.SOUP.displayName,
                rating = 4.6f,
                soldCount = 289
            ),
            Dish(
                id = "10",
                name = "酸辣汤",
                description = "酸辣开胃，口感丰富，暖心暖胃",
                price = 20.0,
                imageUrl = "",
                category = DishCategory.SOUP.displayName,
                rating = 4.5f,
                soldCount = 156
            ),
            
            // 主食
            Dish(
                id = "11",
                name = "扬州炒饭",
                description = "粒粒分明，配料丰富，香气扑鼻",
                price = 25.0,
                imageUrl = "",
                category = DishCategory.STAPLE.displayName,
                rating = 4.7f,
                soldCount = 345
            ),
            Dish(
                id = "12",
                name = "兰州拉面",
                description = "面条劲道，汤汁浓郁，西北特色",
                price = 22.0,
                imageUrl = "",
                category = DishCategory.STAPLE.displayName,
                rating = 4.8f,
                soldCount = 412
            ),
            Dish(
                id = "13",
                name = "煎饺",
                description = "外焦里嫩，馅料饱满，回味无穷",
                price = 18.0,
                imageUrl = "",
                category = DishCategory.STAPLE.displayName,
                rating = 4.6f,
                soldCount = 267
            ),
            
            // 甜品
            Dish(
                id = "14",
                name = "红豆汤圆",
                description = "软糯香甜，红豆沙细腻，甜而不腻",
                price = 15.0,
                imageUrl = "",
                category = DishCategory.DESSERT.displayName,
                rating = 4.5f,
                soldCount = 189
            ),
            Dish(
                id = "15",
                name = "芒果布丁",
                description = "芒果香浓，口感细腻，清凉爽口",
                price = 18.0,
                imageUrl = "",
                category = DishCategory.DESSERT.displayName,
                rating = 4.7f,
                soldCount = 234
            ),
            
            // 饮料
            Dish(
                id = "16",
                name = "鲜榨橙汁",
                description = "新鲜橙子现榨，维C丰富，健康饮品",
                price = 15.0,
                imageUrl = "",
                category = DishCategory.DRINKS.displayName,
                rating = 4.6f,
                soldCount = 312
            ),
            Dish(
                id = "17",
                name = "柠檬绿茶",
                description = "清新爽口，酸甜适中，解腻佳品",
                price = 12.0,
                imageUrl = "",
                category = DishCategory.DRINKS.displayName,
                rating = 4.5f,
                soldCount = 278
            ),
            Dish(
                id = "18",
                name = "奶茶",
                description = "奶香浓郁，茶味醇厚，人气饮品",
                price = 16.0,
                imageUrl = "",
                category = DishCategory.DRINKS.displayName,
                rating = 4.8f,
                soldCount = 456
            )
        )
    }
    
    /**
     * 根据分类获取菜品
     */
    fun getDishesByCategory(category: DishCategory): List<Dish> {
        if (category == DishCategory.ALL) {
            return getAllDishes()
        }
        return getAllDishes().filter { it.category == category.displayName }
    }
    
    /**
     * 根据ID获取菜品
     */
    fun getDishById(id: String): Dish? {
        return getAllDishes().find { it.id == id }
    }
    
    /**
     * 搜索菜品
     */
    fun searchDishes(query: String): List<Dish> {
        if (query.isBlank()) return getAllDishes()
        return getAllDishes().filter { 
            it.name.contains(query, ignoreCase = true) || 
            it.description.contains(query, ignoreCase = true)
        }
    }
}

