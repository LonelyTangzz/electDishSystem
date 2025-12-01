# 快速启动指南

## 📱 项目简介

这是一个完整的Android外卖点餐应用，包含：
- ✅ 菜品浏览和搜索
- ✅ 分类筛选
- ✅ 购物车管理
- ✅ 订单提交

## 🚀 快速开始

### 1. 导入项目

使用Android Studio打开项目：
```
File -> Open -> 选择 electDishSystem 文件夹
```

### 2. 同步Gradle

项目打开后会自动开始Gradle同步，如果没有自动同步，点击：
```
File -> Sync Project with Gradle Files
```

### 3. 运行应用

**方式一：使用Android模拟器**
1. 点击 Tools -> Device Manager
2. 创建一个新的虚拟设备（推荐Pixel 5，API 34）
3. 点击运行按钮 ▶️ 或按 Shift+F10

**方式二：使用真实设备**
1. 在手机上启用开发者选项和USB调试
2. 用USB连接手机到电脑
3. 点击运行按钮 ▶️

## 📋 项目结构

```
electDishSystem/
├── app/                           # 应用模块
│   ├── src/
│   │   └── main/
│   │       ├── java/com/electdish/system/
│   │       │   ├── adapter/      # RecyclerView适配器
│   │       │   ├── data/         # 数据模型和管理
│   │       │   └── ui/           # Activity界面
│   │       ├── res/              # 资源文件
│   │       │   ├── drawable/     # 图标和背景
│   │       │   ├── layout/       # 布局文件
│   │       │   └── values/       # 字符串、颜色、主题
│   │       └── AndroidManifest.xml
│   └── build.gradle              # 应用级构建配置
├── gradle/                       # Gradle wrapper
├── build.gradle                  # 项目级构建配置
├── settings.gradle               # 项目设置
├── gradle.properties             # Gradle属性
└── README.md                     # 详细文档
```

## 🔧 配置要求

### 必需环境
- **Android Studio**: Hedgehog 2023.1.1 或更高
- **JDK**: 17 或更高
- **Android SDK**: API 34
- **最低支持**: Android 7.0 (API 24)

### 依赖库（已配置）
- AndroidX Core & AppCompat
- Material Components 1.11.0
- RecyclerView & CardView
- ViewModel & LiveData 2.7.0
- Kotlin 1.9.0
- Coroutines 1.7.3
- Gson 2.10.1

## 📝 已完成的功能

### ✅ 主界面 (MainActivity)
- 菜品列表展示（18道示例菜品）
- 分类筛选（全部、热菜、凉菜、汤类、主食、甜品、饮料）
- 实时搜索功能
- 加入购物车
- 购物车数量提示

### ✅ 购物车页面 (CartActivity)
- 查看购物车商品
- 调整商品数量
- 删除商品
- 显示总价
- 去结算

### ✅ 订单确认页面 (OrderConfirmActivity)
- 填写配送地址
- 输入联系电话（带验证）
- 添加订单备注
- 查看订单明细
- 计算配送费（¥5.00）
- 提交订单

### ✅ 数据管理
- 单例购物车管理器
- 模拟数据仓库（18道菜品）
- 数据模型（Dish、CartItem、Order）

### ✅ UI/UX设计
- Material Design规范
- 响应式卡片布局
- 流畅的滚动体验
- 友好的错误提示
- 操作反馈动画

## 🎯 使用流程

1. **启动应用** → 看到菜品列表
2. **浏览菜品** → 点击分类/搜索查找
3. **加入购物车** → 点击"加入购物车"按钮
4. **查看购物车** → 点击右下角购物车按钮
5. **调整数量** → 增加/减少数量或删除商品
6. **去结算** → 点击"去结算"按钮
7. **填写信息** → 输入地址和电话
8. **提交订单** → 完成下单，购物车清空

## 🎨 主题颜色

- **主色**: #FF6B35（橙色）
- **深主色**: #E85A2A
- **强调色**: #FFA726
- **背景色**: #F5F5F5

## 📱 测试数据

应用包含18道示例菜品：
- 热菜：宫保鸡丁、鱼香肉丝、麻婆豆腐、红烧排骨、清蒸鲈鱼
- 凉菜：拍黄瓜、凉拌木耳、夫妻肺片
- 汤类：番茄蛋花汤、酸辣汤
- 主食：扬州炒饭、兰州拉面、煎饺
- 甜品：红豆汤圆、芒果布丁
- 饮料：鲜榨橙汁、柠檬绿茶、奶茶

## ⚠️ 注意事项

1. **模拟数据**: 当前使用本地模拟数据，没有连接真实后端
2. **图片占位符**: 菜品图片使用占位图标，实际应用需要真实图片
3. **支付功能**: 未实现真实支付，仅演示订单提交流程
4. **订单持久化**: 订单数据未保存到数据库

## 🔍 常见问题

### Q: Gradle同步失败？
A: 检查网络连接，或使用VPN。也可以修改`gradle/wrapper/gradle-wrapper.properties`中的镜像地址。

### Q: 找不到SDK？
A: 在Android Studio中：Preferences -> Appearance & Behavior -> System Settings -> Android SDK，安装API 34。

### Q: 编译错误？
A: 确保JDK版本是17或更高，在Project Structure中检查Java版本设置。

### Q: 应用无法运行？
A: 检查模拟器API级别（需要API 24+），清理项目（Build -> Clean Project），然后重新构建。

## 📚 下一步

如果想扩展功能，可以：
1. 集成网络请求（Retrofit + OkHttp）
2. 添加Room数据库存储订单
3. 使用Glide加载真实图片
4. 实现用户登录注册
5. 添加订单历史记录
6. 集成支付SDK

## 📞 支持

如有问题，请查看详细的`README.md`文档。

---

**祝您开发愉快！** 🎉


