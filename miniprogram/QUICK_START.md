# 快速开始指南

## ⚡ 5分钟快速部署

按照以下步骤快速启动您的外卖小程序：

---

## 步骤1：开通云开发（2分钟）

1. 打开微信开发者工具
2. 加载本项目
3. 点击顶部工具栏"云开发"按钮
4. 点击"开通"
5. 选择一个环境（推荐：按量付费，新用户有免费额度）
6. **复制环境ID**（格式：cloud1-xxxxxx）

---

## 步骤2：配置环境ID（30秒）

打开 `miniprogram/app.js`，找到第13行，替换环境ID：

```javascript
wx.cloud.init({
  env: 'cloud1-xxxxxx', // 粘贴你的环境ID
  traceUser: true
});
```

**保存文件！**

---

## 步骤3：创建数据库集合（1分钟）

在微信开发者工具中：

1. 点击"云开发控制台"
2. 进入"数据库"
3. 点击"+"创建集合，依次创建：
   - `dishes` （权限：所有用户可读，仅创建者可写）
   - `orders` （权限：仅创建者可读写）
   - `reviews` （权限：所有用户可读，仅创建者可写）
   - `users` （权限：仅创建者可读写）

---

## 步骤4：上传云函数（30秒）

在微信开发者工具左侧目录树：

1. 右键点击 `cloudfunctions/login` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成（绿色图标）

---

## 步骤5：导入菜品数据（1分钟）

### 方法A：云开发控制台导入
1. 进入"云开发控制台" → "数据库"
2. 选择 `dishes` 集合
3. 点击"导入"
4. 选择 `miniprogram/database/dishes_import.json`
5. 点击"确认导入"

### 方法B：使用代码初始化
1. 在 `miniprogram/pages/index/index.js` 的 `onLoad` 方法中临时添加：

```javascript
onLoad() {
  // 临时初始化按钮：仅首次运行
  this.initDishesToDB();
  
  this.loadDishesFromDB();
},

// 临时方法
async initDishesToDB() {
  const dishData = require('../../utils/dishData.js');
  const db = wx.cloud.database();
  
  wx.showLoading({ title: '初始化中...' });
  
  try {
    for (let dish of dishData.dishes) {
      await db.collection('dishes').add({
        data: { ...dish, createTime: db.serverDate() }
      });
    }
    wx.hideLoading();
    wx.showToast({ title: '初始化成功', icon: 'success' });
  } catch (err) {
    wx.hideLoading();
    console.error(err);
  }
}
```

2. 保存并编译
3. 小程序启动后会自动初始化
4. **重要：初始化完成后删除这段代码！**

---

## 步骤6：测试运行（30秒）

1. 点击"编译"
2. 在模拟器中测试：
   - ✅ 浏览菜品
   - ✅ 加入购物车
   - ✅ 切换到"我的"页面
   - ✅ 点击"点击登录"（会弹授权窗口）
   - ✅ 返回购物车，提交订单
   - ✅ 查看订单历史
   - ✅ 评价订单

---

## ✅ 完成！

如果所有功能正常，恭喜你已经成功部署！

---

## 🔍 常见问题

### Q1: 编译报错"云开发未初始化"
**A:** 检查 `app.js` 中的环境ID是否正确配置

### Q2: 点击登录没反应
**A:** 
- 确保云函数 `login` 已上传
- 检查 `project.config.json` 中 `appid` 是否正确

### Q3: 看不到菜品数据
**A:**
- 检查是否成功导入菜品数据
- 在云开发控制台查看 `dishes` 集合是否有数据
- 查看控制台是否有错误日志

### Q4: 提交订单失败
**A:**
- 确保已登录（获取了OpenID）
- 检查 `orders` 集合权限设置
- 查看控制台错误信息

### Q5: 真机调试报错
**A:**
- 在"详情" → "本地设置"中勾选"不校验合法域名"
- 或在小程序后台配置云开发域名白名单

---

## 📱 发布上线

### 1. 体验版
1. 点击"上传"
2. 填写版本号和备注
3. 在小程序后台生成体验版二维码
4. 扫码测试

### 2. 正式版
1. 在小程序后台提交审核
2. 审核通过后点击"发布"
3. 用户可以在微信中搜索到你的小程序

---

## 📚 更多文档

- **完整功能说明：** `FEATURES_UPGRADE.md`
- **数据库详细配置：** `DATABASE_SETUP.md`
- **项目说明：** `README.md`

---

## 🎉 下一步

现在您可以：

1. **自定义菜品：** 在云数据库中添加/修改菜品
2. **修改主题颜色：** 编辑 `app.wxss` 中的颜色变量
3. **添加新功能：** 参考现有代码结构扩展
4. **优化UI：** 修改各页面的 `.wxss` 文件

祝您使用愉快！🚀

