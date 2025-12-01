# 阿汤的小食堂 - 微信小程序版

这是与Android应用功能完全一致的微信小程序版本。

## 🎯 功能特性

### 核心功能（与Android版一致）
- ✅ **菜品浏览** - 18道示例菜品，精美卡片展示
- ✅ **分类筛选** - 全部、热菜、凉菜、汤类、主食、甜品、饮料
- ✅ **实时搜索** - 支持菜品名称和描述搜索
- ✅ **购物车管理** - 添加、修改、删除商品
- ✅ **订单提交** - 填写地址和电话，提交订单
- ✅ **数据持久化** - 购物车数据本地缓存

### UI特点
- 🎨 Material Design 风格
- 📱 响应式布局
- 🔄 流畅的交互动画
- 💫 友好的用户反馈

## 📂 项目结构

```
miniprogram/
├── pages/                  # 页面目录
│   ├── index/             # 首页（菜品列表）
│   ├── cart/              # 购物车页面
│   └── order/             # 订单确认页面
├── utils/                  # 工具函数
│   ├── cartManager.js     # 购物车管理器
│   ├── dishData.js        # 菜品数据
│   └── util.js            # 通用工具函数
├── images/                 # 图片资源
│   ├── home.png           # TabBar图标
│   ├── home-active.png
│   ├── cart.png
│   ├── cart-active.png
│   └── dishes/            # 菜品图片
├── app.js                  # 小程序逻辑
├── app.json                # 小程序配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
└── sitemap.json           # 搜索优化配置
```

## 🚀 快速开始

### 前置要求

1. **安装微信开发者工具**
   - 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 支持 Windows、macOS、Linux

2. **注册微信小程序**
   - 访问：https://mp.weixin.qq.com/
   - 注册并获取 AppID

### 安装步骤

#### 1. 打开微信开发者工具

#### 2. 导入项目
- 点击"导入项目"
- 选择项目目录：`electDishSystem/miniprogram`
- 输入 AppID（或选择"测试号"进行开发）
- 项目名称：阿汤的小食堂

#### 3. 配置 AppID
如果有正式 AppID，在 `project.config.json` 中修改：
```json
"appid": "wx你的AppID"
```

#### 4. 编译运行
- 点击工具栏的"编译"按钮
- 在模拟器中查看效果
- 使用真机预览：点击"预览"扫码

## 📱 页面说明

### 1. 首页（pages/index）
**功能：**
- 展示所有菜品
- 分类筛选
- 搜索功能
- 加入购物车
- 显示购物车数量徽标

**交互：**
- 点击分类标签切换分类
- 输入关键词实时搜索
- 点击"加入购物车"添加商品
- 点击菜品查看详情

### 2. 购物车（pages/cart）
**功能：**
- 查看购物车商品列表
- 调整商品数量（+/-）
- 删除单个商品
- 清空购物车
- 显示订单总价
- 进入结算流程

**交互：**
- 点击+/-调整数量
- 点击垃圾桶删除商品
- 点击"清空购物车"清空
- 点击"去结算"进入订单页

### 3. 订单确认（pages/order）
**功能：**
- 填写配送地址
- 输入联系电话（带验证）
- 添加订单备注
- 查看订单明细
- 显示配送费（¥5.00）
- 提交订单

**表单验证：**
- 地址不能为空
- 电话号码格式验证（11位手机号）
- 提交成功后清空购物车

## 💾 数据管理

### 购物车管理（cartManager.js）
使用 `wx.setStorageSync` 实现本地持久化：
```javascript
// 添加商品
cartManager.addDish(dish);

// 获取购物车列表
const items = cartManager.getCartItems();

// 获取总价
const total = cartManager.getTotalPrice();

// 清空购物车
cartManager.clear();
```

### 菜品数据（dishData.js）
模拟数据，包含18道菜品：
```javascript
// 获取所有菜品
const dishes = dishData.getAllDishes();

// 按分类获取
const hotDishes = dishData.getDishesByCategory('hot');

// 搜索菜品
const results = dishData.searchDishes('宫保');
```

### 工具函数（util.js）
```javascript
// 格式化价格
util.formatPrice(38.5); // ¥38.50

// 显示提示
util.showSuccess('操作成功');
util.showError('请输入地址');

// 验证手机号
util.validatePhone('13800138000'); // true

// 显示确认对话框
await util.showConfirm('提示', '确认删除？');
```

## 🎨 主题配置

### 颜色方案
```css
主色：#FF6B35
深主色：#E85A2A
强调色：#FFA726
背景色：#F5F5F5
文字主色：#212121
文字副色：#757575
价格色：#FF5722
```

### 自定义主题
在 `app.wxss` 中修改全局样式，或在各页面的 `.wxss` 文件中自定义。

## 🔧 配置说明

### app.json
```json
{
  "pages": [/* 页面路径 */],
  "window": {/* 窗口配置 */},
  "tabBar": {/* 底部导航 */}
}
```

### project.config.json
```json
{
  "appid": "你的AppID",
  "projectname": "electDishMiniProgram",
  "libVersion": "2.32.0"
}
```

## 📝 开发注意事项

### 1. AppID配置
- 开发阶段可使用测试号
- 正式发布需要注册小程序并配置真实AppID

### 2. 图标准备
当前TabBar图标需要手动准备：
- `images/home.png` 和 `home-active.png`
- `images/cart.png` 和 `cart-active.png`
- 尺寸：40x40 或 81x81 像素

### 3. 真机调试
- 使用真机预览：点击"预览"扫码
- 确保手机与电脑在同一网络
- 微信版本 >= 7.0.0

### 4. 性能优化
- 图片使用webp格式
- 列表使用虚拟滚动
- 避免频繁setData

## 🚀 发布上线

### 1. 准备工作
- [ ] 完善小程序信息
- [ ] 准备小程序logo
- [ ] 配置服务器域名
- [ ] 上传真实菜品图片

### 2. 提交审核
```
1. 点击"上传"按钮
2. 填写版本号和项目备注
3. 登录小程序后台
4. 提交审核
5. 等待审核通过（通常1-7天）
```

### 3. 发布
- 审核通过后，在后台点击"发布"
- 用户即可搜索并使用

## 🔄 与Android版对比

| 功能 | Android | 小程序 |
|------|---------|--------|
| 菜品浏览 | ✅ | ✅ |
| 分类筛选 | ✅ | ✅ |
| 搜索功能 | ✅ | ✅ |
| 购物车 | ✅ | ✅ |
| 订单提交 | ✅ | ✅ |
| 数据持久化 | SharedPreferences | Storage |
| UI框架 | Material Design | WeUI风格 |
| 开发语言 | Kotlin | JavaScript |

## 🌟 后续优化

### 功能增强
- [ ] 用户登录
- [ ] 订单历史
- [ ] 支付功能
- [ ] 地址管理
- [ ] 优惠券
- [ ] 评价系统

### 技术优化
- [ ] 接入真实后端API
- [ ] 使用云开发
- [ ] 添加骨架屏
- [ ] 图片懒加载
- [ ] 分享功能

## 📚 相关文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [小程序开发指南](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a)
- [WeUI组件库](https://github.com/Tencent/weui-wxss/)

## 🆘 常见问题

### Q: 如何获取AppID？
A: 访问 https://mp.weixin.qq.com/ 注册小程序账号，在设置-开发设置中查看AppID。

### Q: 可以使用测试号吗？
A: 可以。在导入项目时选择"测试号"即可，功能完全可用。

### Q: 如何在真机上测试？
A: 点击工具栏的"预览"按钮，使用微信扫码即可在手机上查看。

### Q: 图标在哪里？
A: 需要手动准备TabBar图标放入 `images/` 目录，或暂时忽略（会显示默认图标）。

### Q: 如何连接后端？
A: 在工具函数中使用 `wx.request()` 调用API，需要在小程序后台配置服务器域名。

## 📞 技术支持

如有问题，请查看：
- Android版项目的 README.md
- 微信小程序官方文档
- 项目内的代码注释

---

**小程序已完成，可直接运行！** 🎉

与Android版功能完全一致，欢迎体验！


