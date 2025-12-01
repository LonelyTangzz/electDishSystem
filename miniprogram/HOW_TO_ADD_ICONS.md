# 如何添加 TabBar 图标

当前小程序 TabBar 只显示文字，如果想添加图标，请按照以下步骤操作。

---

## 📋 需要的图标

需要准备 **4个图标文件**：

1. `images/home.png` - 点餐图标（未选中）
2. `images/home-active.png` - 点餐图标（选中）
3. `images/cart.png` - 购物车图标（未选中）
4. `images/cart-active.png` - 购物车图标（选中）

---

## 🎨 图标规范

- **格式：** PNG（支持透明背景）
- **尺寸：** 40x40 像素 或 81x81 像素
- **大小：** 每个文件 < 40KB
- **颜色建议：**
  - 未选中：灰色 `#999999`
  - 选中：主题色 `#FF6B35`

---

## 🔍 获取图标的方法

### 方法1：iconfont（推荐，免费）

1. 访问 https://www.iconfont.cn/
2. 搜索 "home" 和 "购物车"
3. 选择喜欢的图标
4. 点击"下载" → 选择 PNG 格式
5. 调整尺寸为 40x40 或 81x81
6. 下载两种颜色（灰色和橙色）

### 方法2：在线图标生成

使用在线工具生成简单图标：
- https://icon-icons.com/
- https://icons8.com/icons

### 方法3：使用 Emoji 表情

最简单的方法，使用系统 Emoji：
- 🏠 作为 home 图标
- 🛒 作为 cart 图标

（但需要转换为 PNG 图片）

---

## 📂 放置图标文件

1. 将准备好的 4个 PNG 文件放入：
   ```
   miniprogram/images/
   ```

2. 确保文件名正确：
   ```
   miniprogram/
   └── images/
       ├── home.png
       ├── home-active.png
       ├── cart.png
       └── cart-active.png
   ```

---

## 🔧 恢复图标配置

放好图标文件后，修改 `app.json`：

```json
"tabBar": {
  "color": "#999999",
  "selectedColor": "#FF6B35",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "点餐",
      "iconPath": "images/home.png",
      "selectedIconPath": "images/home-active.png"
    },
    {
      "pagePath": "pages/cart/cart",
      "text": "购物车",
      "iconPath": "images/cart.png",
      "selectedIconPath": "images/cart-active.png"
    }
  ]
},
```

---

## ✅ 验证

1. 保存文件
2. 在开发者工具中点击"编译"
3. 查看底部 TabBar 是否显示图标
4. 切换页面，检查选中状态的图标是否变色

---

## 💡 快速测试图标

如果只是想快速测试，可以：

1. 找任意 2张小图片（40x40 左右）
2. 重命名为上述文件名
3. 放入 `images/` 目录
4. 编译查看效果

---

## ⚠️ 常见问题

### Q: 图标不显示？
A: 检查：
- 文件路径是否正确
- 文件名是否完全匹配（包括大小写）
- 文件格式是否为 PNG
- 文件大小是否 < 40KB

### Q: 图标显示变形？
A: 确保图标是正方形（宽高相等）

### Q: 可以用 JPG 格式吗？
A: 不可以，必须是 PNG 格式

---

## 🎯 推荐图标示例

### 点餐图标（home）
- 房子图标 🏠
- 刀叉图标 🍴
- 碗筷图标 🥢

### 购物车图标（cart）
- 购物车 🛒
- 购物袋 🛍️
- 菜篮子 🧺

---

## 📝 注意事项

1. **图标是可选的**
   - 没有图标也不影响功能
   - 只是 TabBar 会显得简单一些

2. **保持统一风格**
   - 4个图标应该风格一致
   - 选中和未选中只是颜色不同

3. **文件大小**
   - 小程序对图片大小有限制
   - 尽量优化图标大小

---

## 🚀 现在可以做的

**如果不急着添加图标：**
- 当前配置完全可用
- 先熟悉小程序功能
- 以后再添加图标

**如果想立即添加：**
- 按照上述步骤准备图标
- 放入 images 目录
- 恢复 app.json 配置
- 重新编译

---

**现在小程序已经可以正常运行了！图标可以以后慢慢添加。** ✅

