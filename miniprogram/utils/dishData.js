// 菜品数据仓库
const categories = [
  { id: 'all', name: '全部' },
  { id: 'hot', name: '热菜' },
  { id: 'cold', name: '凉菜' },
  { id: 'soup', name: '汤类' },
  { id: 'staple', name: '主食' },
  { id: 'dessert', name: '甜品' },
  { id: 'drinks', name: '饮料' }
];

const dishes = [
  // 热菜
  {
    id: '1',
    name: '宫保鸡丁',
    description: '经典川菜，鸡肉鲜嫩，花生酥脆，麻辣鲜香',
    price: 38.0,
    emoji: '🍗',
    category: 'hot',
    categoryName: '热菜',
    isAvailable: true,
    rating: 4.8,
    soldCount: 256
  },
  {
    id: '2',
    name: '鱼香肉丝',
    description: '酸甜可口，色泽红润，肉丝嫩滑',
    price: 32.0,
    emoji: '🥩',
    category: 'hot',
    categoryName: '热菜',
    isAvailable: true,
    rating: 4.7,
    soldCount: 189
  },
  {
    id: '3',
    name: '麻婆豆腐',
    description: '麻辣鲜香，豆腐滑嫩，下饭神器',
    price: 28.0,
    emoji: '🌶️',
    category: 'hot',
    categoryName: '热菜',
    isAvailable: true,
    rating: 4.9,
    soldCount: 312
  },
  {
    id: '4',
    name: '红烧排骨',
    description: '色泽红亮，肉质酥烂，咸甜适中',
    price: 48.0,
    emoji: '🍖',
    category: 'hot',
    categoryName: '热菜',
    isAvailable: true,
    rating: 4.6,
    soldCount: 178
  },
  {
    id: '5',
    name: '清蒸鲈鱼',
    description: '鱼肉鲜嫩，原汁原味，营养健康',
    price: 68.0,
    emoji: '🐟',
    category: 'hot',
    categoryName: '热菜',
    isAvailable: true,
    rating: 4.8,
    soldCount: 145
  },
  
  // 凉菜
  {
    id: '6',
    name: '拍黄瓜',
    description: '清爽可口，蒜香浓郁，开胃小菜',
    price: 12.0,
    emoji: '🥒',
    category: 'cold',
    categoryName: '凉菜',
    isAvailable: true,
    rating: 4.5,
    soldCount: 234
  },
  {
    id: '7',
    name: '凉拌木耳',
    description: '口感爽脆，营养丰富，清淡健康',
    price: 15.0,
    emoji: '🍄',
    category: 'cold',
    categoryName: '凉菜',
    isAvailable: true,
    rating: 4.4,
    soldCount: 167
  },
  {
    id: '8',
    name: '夫妻肺片',
    description: '麻辣鲜香，牛肉薄而不柴，川菜经典',
    price: 36.0,
    emoji: '🥓',
    category: 'cold',
    categoryName: '凉菜',
    isAvailable: true,
    rating: 4.7,
    soldCount: 198
  },
  
  // 汤类
  {
    id: '9',
    name: '番茄蛋花汤',
    description: '酸甜开胃，营养丰富，老少皆宜',
    price: 18.0,
    emoji: '🍅',
    category: 'soup',
    categoryName: '汤类',
    isAvailable: true,
    rating: 4.6,
    soldCount: 289
  },
  {
    id: '10',
    name: '酸辣汤',
    description: '酸辣开胃，口感丰富，暖心暖胃',
    price: 20.0,
    emoji: '🥣',
    category: 'soup',
    categoryName: '汤类',
    isAvailable: true,
    rating: 4.5,
    soldCount: 156
  },
  
  // 主食
  {
    id: '11',
    name: '扬州炒饭',
    description: '粒粒分明，配料丰富，香气扑鼻',
    price: 25.0,
    emoji: '🍚',
    category: 'staple',
    categoryName: '主食',
    isAvailable: true,
    rating: 4.7,
    soldCount: 345
  },
  {
    id: '12',
    name: '兰州拉面',
    description: '面条劲道，汤汁浓郁，西北特色',
    price: 22.0,
    emoji: '🍜',
    category: 'staple',
    categoryName: '主食',
    isAvailable: true,
    rating: 4.8,
    soldCount: 412
  },
  {
    id: '13',
    name: '煎饺',
    description: '外焦里嫩，馅料饱满，回味无穷',
    price: 18.0,
    emoji: '🥟',
    category: 'staple',
    categoryName: '主食',
    isAvailable: true,
    rating: 4.6,
    soldCount: 267
  },
  
  // 甜品
  {
    id: '14',
    name: '红豆汤圆',
    description: '软糯香甜，红豆沙细腻，甜而不腻',
    price: 15.0,
    emoji: '🍡',
    category: 'dessert',
    categoryName: '甜品',
    isAvailable: true,
    rating: 4.5,
    soldCount: 189
  },
  {
    id: '15',
    name: '芒果布丁',
    description: '芒果香浓，口感细腻，清凉爽口',
    price: 18.0,
    emoji: '🍮',
    category: 'dessert',
    categoryName: '甜品',
    isAvailable: true,
    rating: 4.7,
    soldCount: 234
  },
  
  // 饮料
  {
    id: '16',
    name: '鲜榨橙汁',
    description: '新鲜橙子现榨，维C丰富，健康饮品',
    price: 15.0,
    emoji: '🍊',
    category: 'drinks',
    categoryName: '饮料',
    isAvailable: true,
    rating: 4.6,
    soldCount: 312
  },
  {
    id: '17',
    name: '柠檬绿茶',
    description: '清新爽口，酸甜适中，解腻佳品',
    price: 12.0,
    emoji: '🍋',
    category: 'drinks',
    categoryName: '饮料',
    isAvailable: true,
    rating: 4.5,
    soldCount: 278
  },
  {
    id: '18',
    name: '奶茶',
    description: '奶香浓郁，茶味醇厚，人气饮品',
    price: 16.0,
    emoji: '🧋',
    category: 'drinks',
    categoryName: '饮料',
    isAvailable: true,
    rating: 4.8,
    soldCount: 456
  }
];

// 获取所有分类
function getCategories() {
  return categories;
}

// 获取所有菜品
function getAllDishes() {
  return dishes;
}

// 根据分类获取菜品
function getDishesByCategory(categoryId) {
  if (categoryId === 'all') {
    return dishes;
  }
  return dishes.filter(dish => dish.category === categoryId);
}

// 根据ID获取菜品
function getDishById(id) {
  return dishes.find(dish => dish.id === id);
}

// 搜索菜品
function searchDishes(query) {
  if (!query || query.trim() === '') {
    return dishes;
  }
  
  const lowerQuery = query.toLowerCase();
  return dishes.filter(dish => 
    dish.name.toLowerCase().includes(lowerQuery) ||
    dish.description.toLowerCase().includes(lowerQuery)
  );
}

module.exports = {
  dishes,  // 直接导出dishes数组
  categories,  // 直接导出categories数组
  getCategories,
  getAllDishes,
  getDishesByCategory,
  getDishById,
  searchDishes
};
