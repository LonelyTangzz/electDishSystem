# 云数据库配置指南

## 1. 开通云开发环境

### 步骤：
1. 登录微信开发者工具
2. 打开你的小程序项目
3. 点击顶部菜单栏"云开发"按钮
4. 点击"开通"，选择一个环境（如：cloud1-xxxx）
5. 记下你的**环境ID**（env-id）

### 配置环境ID：
打开 `miniprogram/app.js`，修改第13行：

```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云开发环境ID
  traceUser: true
});
```

---

## 2. 创建云数据库集合

### 在微信开发者工具中创建：

#### 集合1：dishes（菜品）
**权限设置：** 所有用户可读，仅创建者可写
**字段结构：**
```json
{
  "_id": "自动生成",
  "id": "string - 菜品ID（可选，用于兼容）",
  "name": "string - 菜品名称",
  "description": "string - 菜品描述",
  "price": "number - 价格",
  "emoji": "string - emoji图标",
  "category": "string - 分类（hot/cold/soup/staple/dessert/drinks）",
  "categoryName": "string - 分类名称",
  "isAvailable": "boolean - 是否可用",
  "rating": "number - 评分",
  "soldCount": "number - 销量",
  "createTime": "serverDate - 创建时间"
}
```

#### 集合2：orders（订单）
**权限设置：** 仅创建者可读写
**字段结构：**
```json
{
  "_id": "自动生成",
  "openid": "string - 用户OpenID",
  "items": "array - 订单商品列表",
  "totalAmount": "number - 总金额",
  "phoneNumber": "string - 联系电话",
  "remarks": "string - 订单备注",
  "status": "string - 订单状态（pending/confirmed/preparing/delivering/completed/cancelled）",
  "hasReview": "boolean - 是否已评价",
  "createTime": "serverDate - 创建时间",
  "updateTime": "serverDate - 更新时间"
}
```

#### 集合3：reviews（评价）
**权限设置：** 所有用户可读，仅创建者可写
**字段结构：**
```json
{
  "_id": "自动生成",
  "openid": "string - 用户OpenID",
  "orderId": "string - 订单ID",
  "dishId": "string - 菜品ID",
  "dishName": "string - 菜品名称",
  "rating": "number - 评分（1-5）",
  "comment": "string - 评论内容",
  "overallRating": "number - 总体评分",
  "overallComment": "string - 总体评论",
  "createTime": "serverDate - 创建时间"
}
```

#### 集合4：users（用户）
**权限设置：** 仅创建者可读写
**字段结构：**
```json
{
  "_id": "自动生成",
  "openid": "string - 用户OpenID",
  "nickName": "string - 昵称",
  "avatarUrl": "string - 头像URL",
  "createTime": "serverDate - 创建时间",
  "updateTime": "serverDate - 更新时间"
}
```

---

## 3. 上传并部署云函数

### 步骤：
1. 在微信开发者工具中，右键点击 `cloudfunctions/login` 目录
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

### 测试云函数：
1. 在云开发控制台选择"云函数"
2. 找到 `login` 函数
3. 点击"测试"按钮
4. 查看返回的 openid

---

## 4. 初始化菜品数据

### 方法一：在云开发控制台手动导入
1. 打开云开发控制台
2. 进入"数据库"
3. 选择"dishes"集合
4. 点击"导入"
5. 上传 `miniprogram/database/dishes_import.json` 文件

### 方法二：使用小程序代码批量添加

在首页（`pages/index/index.js`）添加临时初始化方法：

```javascript
// 临时方法：初始化菜品数据到云数据库
async initDishesToDB() {
  const dishData = require('../../utils/dishData.js');
  const dishes = dishData.dishes;
  
  wx.showLoading({ title: '初始化中...' });
  
  try {
    const db = wx.cloud.database();
    
    // 批量添加菜品
    for (let dish of dishes) {
      await db.collection('dishes').add({
        data: {
          ...dish,
          createTime: db.serverDate()
        }
      });
    }
    
    wx.hideLoading();
    wx.showToast({
      title: '初始化成功',
      icon: 'success'
    });
    
    // 重新加载数据
    this.loadDishesFromDB();
  } catch (err) {
    console.error('初始化失败', err);
    wx.hideLoading();
    wx.showToast({
      title: '初始化失败',
      icon: 'error'
    });
  }
}
```

然后在页面添加一个临时按钮调用此方法，初始化完成后删除。

---

## 5. 权限说明

### 推荐权限配置：

| 集合 | 读权限 | 写权限 |
|-----|-------|-------|
| dishes | 所有用户 | 仅管理员 |
| orders | 仅创建者 | 仅创建者 |
| reviews | 所有用户 | 仅创建者 |
| users | 仅创建者 | 仅创建者 |

### 设置方法：
1. 在云开发控制台选择"数据库"
2. 选择对应的集合
3. 点击"权限设置"
4. 选择合适的权限模板

---

## 6. 常见问题

### Q1: 提示"openid获取失败"
**A:** 确保：
- 已开通云开发
- 已上传并部署 `login` 云函数
- 小程序已配置正确的 AppID

### Q2: 数据库操作失败
**A:** 检查：
- 权限设置是否正确
- 集合名称是否拼写正确
- 是否已登录（获取了 openid）

### Q3: 本地数据和云数据不同步
**A:** 
- 云数据库是独立的，不会自动同步本地数据
- 需要手动初始化或导入数据
- 建议使用云数据库作为主要数据源

---

## 7. 后续优化建议

1. **添加数据索引**：为常用查询字段（如 `category`, `openid`）添加索引以提升性能
2. **使用云函数**：将复杂的业务逻辑移至云函数，提升安全性
3. **数据备份**：定期导出数据库数据进行备份
4. **监控日志**：在云开发控制台查看数据库操作日志

---

## 8. 测试清单

- [ ] 云开发环境已开通并配置
- [ ] 4个数据库集合已创建
- [ ] 权限设置正确
- [ ] login 云函数已部署
- [ ] 菜品数据已初始化
- [ ] 用户可以正常登录
- [ ] 订单可以正常提交
- [ ] 订单历史可以查看
- [ ] 评价功能可以正常使用

完成以上步骤后，您的外卖小程序就可以正常使用云数据库了！🎉

