// 测试数据加载
const dishData = require('./utils/dishData.js');

console.log('====== 数据加载测试 ======');
console.log('dishData 对象:', dishData);
console.log('dishData.dishes 是否存在:', !!dishData.dishes);
console.log('dishData.dishes 类型:', Array.isArray(dishData.dishes) ? '数组' : typeof dishData.dishes);
console.log('dishData.dishes 长度:', dishData.dishes ? dishData.dishes.length : 0);

if (dishData.dishes && dishData.dishes.length > 0) {
  console.log('第一道菜:', dishData.dishes[0]);
} else {
  console.log('❌ 没有加载到菜品数据！');
}

console.log('====== 测试结束 ======');

