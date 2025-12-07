# 云函数部署指南 - 解决 -504002 错误

## 错误信息

```
cloud.callFunction:fail Error: errCode: -504002 functions execute fail
Cannot find module 'wx-server-sdk'
```

## 原因分析

这个错误表明：
1. 云函数 `login` 没有部署到云端
2. 或者云函数部署时没有安装依赖包 `wx-server-sdk`

## 解决方案

### 方法一：正确部署云函数（推荐）

#### 1. 在微信开发者工具中部署

**步骤：**

1. **确保已开通云开发**
   - 点击工具栏上的 "云开发" 按钮
   - 如果没有开通，点击 "开通云开发"
   - 创建一个环境（记下环境 ID）

2. **设置云函数根目录**
   - 点击项目根目录的 `project.config.json`
   - 确保有这一行：
     ```json
     "cloudfunctionRoot": "cloudfunctions/"
     ```

3. **部署 login 云函数**
   - 在左侧文件树中找到 `cloudfunctions/login` 文件夹
   - **右键点击 `login` 文件夹**
   - 选择 **"上传并部署：云端安装依赖"** ⚠️ 必须选这个！
   - 等待上传和安装完成（1-2 分钟）

4. **验证部署**
   - 点击 "云开发" 按钮
   - 进入 "云函数" 管理页面
   - 应该能看到 `login` 云函数
   - 状态显示为 "部署成功"

5. **更新环境 ID**
   - 打开 `miniprogram/app.js`
   - 找到这一行：
     ```javascript
     env: 'cloud1-7gjt5l5i0f2bf5d4', // 云开发环境ID
     ```
   - 将环境 ID 改成你自己的环境 ID

#### 2. 重新编译测试

1. 点击 "清除缓存" → "清除编译缓存"
2. 点击 "编译"
3. 查看控制台，应该看到：
   ```
   云开发初始化成功
   获取OpenID成功
   ```

### 方法二：使用 Demo 模式（临时方案）

如果暂时不想部署云函数，可以强制使用 Demo 模式：

**修改 `miniprogram/app.js`：**

```javascript
globalData: {
  userInfo: null,
  openid: null,
  cartCount: 0,
  demoMode: true  // 改为 true，强制使用 Demo 模式
},
```

**Demo 模式的特点：**
- ✅ 不需要云开发，可以直接测试
- ✅ 所有功能都可以使用
- ✅ 数据保存在本地
- ❌ 数据不会同步到云端
- ❌ 无法多端同步
- ❌ 仅适合开发测试

### 方法三：检查云开发配置

#### 1. 检查 project.config.json

确保文件中包含：

```json
{
  "cloudfunctionRoot": "cloudfunctions/",
  "cloud": true
}
```

#### 2. 检查云开发环境

```javascript
// miniprogram/app.js
wx.cloud.init({
  env: '你的环境ID',  // ⚠️ 必须是你自己的环境 ID
  traceUser: true
});
```

获取环境 ID：
1. 打开云开发控制台
2. 顶部显示环境名称和 ID
3. 复制环境 ID

## 常见问题

### Q1: 找不到"上传并部署"选项

**A:** 
- 确保已开通云开发
- 确保 `project.config.json` 中设置了 `cloudfunctionRoot`
- 重启微信开发者工具

### Q2: 部署失败，提示网络错误

**A:**
- 检查网络连接
- 检查是否登录了正确的微信账号
- 尝试切换网络或使用代理

### Q3: 部署成功但调用失败

**A:**
- 检查环境 ID 是否正确
- 检查云函数列表中是否真的有 `login` 函数
- 查看云函数日志，看是否有错误

### Q4: 提示 "wx-server-sdk" 版本不匹配

**A:**
- 右键点击云函数文件夹
- 选择 "上传并部署：云端安装依赖"（不是"上传并部署：所有文件"）
- 这会自动安装正确版本的依赖

## 验证是否部署成功

### 在控制台查看

**成功的日志：**
```
云开发初始化成功
云函数登录成功: {result: {openid: "xxx", success: true}}
登录结果: {success: true, openid: "xxx"}
```

**失败的日志：**
```
cloud.callFunction:fail Error: errCode: -504002
获取OpenID失败
Demo模式：true
```

### 在云开发控制台查看

1. 打开云开发控制台
2. 进入 "云函数" 页面
3. 点击 `login` 函数
4. 查看 "调用日志"
5. 应该能看到调用记录

## 部署检查清单

部署前请确认：

- [ ] 已开通云开发
- [ ] 已创建云开发环境
- [ ] `project.config.json` 中设置了 `cloudfunctionRoot`
- [ ] `app.js` 中的环境 ID 正确
- [ ] 网络连接正常
- [ ] 已登录微信开发者工具

部署后请确认：

- [ ] 云函数列表中能看到 `login`
- [ ] 状态显示为 "部署成功"
- [ ] 控制台没有 -504002 错误
- [ ] 能成功获取 OpenID
- [ ] 登录功能正常

## 推荐方案

**开发阶段：**
- 使用 Demo 模式（`demoMode: true`）
- 快速开发，无需配置云开发

**测试阶段：**
- 部署云函数
- 测试云开发功能
- 验证数据同步

**生产环境：**
- 必须部署云函数
- 配置正确的环境 ID
- 做好数据备份

## 需要帮助？

如果遇到问题：
1. 查看控制台完整错误信息
2. 查看云函数日志
3. 检查上述所有配置项
4. 尝试清除缓存重新编译

---

**最后更新：** 2025-12-01
**状态：** ✅ 可用

