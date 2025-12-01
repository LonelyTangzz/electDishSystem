// 初始化菜品数据到云数据库
const dishData = require('./dishData.js');

async function initDishesToCloud() {
  console.log('===== 开始初始化菜品到云数据库 =====');
  
  const db = wx.cloud.database();
  const dishes = dishData.dishes;
  
  wx.showLoading({ title: '初始化中...', mask: true });
  
  try {
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      
      try {
        await db.collection('dishes').add({
          data: {
            ...dish,
            createTime: db.serverDate()
          }
        });
        successCount++;
        console.log(`✅ 第${i + 1}/${dishes.length}道: ${dish.name}`);
      } catch (err) {
        failCount++;
        console.error(`❌ 失败: ${dish.name}`, err);
      }
    }
    
    wx.hideLoading();
    
    wx.showModal({
      title: '初始化完成',
      content: `成功: ${successCount}道\n失败: ${failCount}道`,
      showCancel: false
    });
    
    console.log('===== 初始化完成 =====');
    console.log(`成功: ${successCount}, 失败: ${failCount}`);
    
  } catch (err) {
    wx.hideLoading();
    console.error('初始化失败:', err);
    wx.showModal({
      title: '初始化失败',
      content: err.message || '请检查云开发是否已开通',
      showCancel: false
    });
  }
}

module.exports = {
  initDishesToCloud
};



