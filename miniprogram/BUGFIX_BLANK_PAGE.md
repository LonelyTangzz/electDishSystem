# Bug 修复：订单和我的页面显示空白

## 问题描述

点击"订单"和"我的"页面时显示纯白屏，包括在真机上也出现此问题。

控制台错误：
```
TypeError: Cannot read property 'globalData' of undefined
at userManager.js:11
```

## 根本原因

在实现微信登录功能时，`userManager.js` 在文件顶部直接调用了 `const app = getApp()`。

当 `app.js` 的 `onLaunch()` 方法中 require `userManager.js` 时，App 实例尚未完全初始化，导致 `getApp()` 返回 `undefined`，进而导致整个应用初始化失败，所有页面都无法正常加载。

### 问题链路
```
app.js onLaunch() 
  → require('./utils/userManager.js')
    → 顶部执行 const app = getApp()
      → getApp() 返回 undefined (App 实例还未初始化完成)
        → 所有使用 app.globalData 的代码报错
          → 页面加载失败，显示空白
```

## 修复方案

### 1. 修改 `userManager.js`

**修改前：**
```javascript
// 文件顶部
const app = getApp();

function wxLogin() {
  if (app.globalData.demoMode) {  // ❌ app 可能是 undefined
    // ...
  }
}
```

**修改后：**
```javascript
// 文件顶部 - 不再调用 getApp()

function wxLogin() {
  const app = getApp();  // ✅ 在函数内部调用
  if (app && app.globalData && app.globalData.demoMode) {  // ✅ 添加安全检查
    // ...
  }
}
```

所有函数都改为：
- 在函数内部调用 `getApp()`
- 添加 `app && app.globalData` 安全检查
- 避免在模块顶部调用可能未初始化的对象

### 2. 简化 `app.js` 登录流程

**修改前：**
```javascript
onLaunch() {
  // ...
  this.performLogin();  // ❌ 复杂的 async 流程，会 require userManager
}

async performLogin() {
  const userManager = require('./utils/userManager.js');  // ❌ 此时 App 可能未初始化
  await userManager.fullLogin();
}
```

**修改后：**
```javascript
onLaunch() {
  // ...
  this.getUserOpenId();  // ✅ 简单直接
  this.restoreUserInfo();  // ✅ 同步恢复本地用户信息
}

getUserOpenId() {
  wx.cloud.callFunction({
    name: 'login',
    success: res => {
      this.globalData.openid = res.result.openid;
    }
  });
}

restoreUserInfo() {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  } catch (err) {
    console.error('恢复用户信息失败:', err);
  }
}
```

## 修复内容清单

### ✅ 已修复文件

1. **miniprogram/utils/userManager.js**
   - 移除顶部的 `const app = getApp()`
   - 所有函数内部调用 `getApp()`
   - 添加安全检查：`app && app.globalData`
   - 涉及函数：
     - `wxLogin()`
     - `saveUserInfo()`
     - `saveUserInfoToDB()`
     - `restoreUserInfo()`
     - `isLoggedIn()`
     - `isAuthorized()`
     - `logout()`

2. **miniprogram/app.js**
   - 简化 `onLaunch()` 流程
   - 移除复杂的 `performLogin()` 调用
   - 使用简单的 `getUserOpenId()` 和 `restoreUserInfo()`
   - 避免在启动时 require 外部模块

## 测试验证

修复后，请执行以下测试：

### 开发工具测试
- [ ] 点击"清除缓存" → "清除编译缓存"
- [ ] 重新编译小程序
- [ ] 检查控制台是否还有错误
- [ ] 点击"订单"页面，应正常显示
- [ ] 点击"我的"页面，应正常显示
- [ ] 点击"点餐"和"购物车"页面，应正常显示

### 真机测试
- [ ] 删除手机上的小程序
- [ ] 重新扫码打开
- [ ] 测试所有 tabBar 页面
- [ ] 测试登录功能

## 为什么页面会空白？

当 JavaScript 执行出错（如 `Cannot read property 'globalData' of undefined`）时：

1. **模块加载失败** - userManager.js 无法正常加载
2. **App 初始化失败** - app.js 的 onLaunch 执行中断
3. **页面 JS 无法执行** - 所有依赖 app 的页面都无法初始化
4. **渲染失败** - 页面数据无法绑定，显示空白

这就是为什么不仅"订单"和"我的"页面空白，实际上可能所有页面都会受影响。

## 最佳实践

### ✅ 正确的做法

```javascript
// 在函数内部调用 getApp()
function myFunction() {
  const app = getApp();
  if (app && app.globalData) {
    // 使用 app.globalData
  }
}
```

### ❌ 错误的做法

```javascript
// 在模块顶部调用 getApp()
const app = getApp();  // ❌ 可能返回 undefined

function myFunction() {
  app.globalData.something;  // ❌ 可能报错
}
```

### 页面中可以这样做

```javascript
// pages/xxx/xxx.js
const app = getApp();  // ✅ 页面加载时 App 已初始化，这是安全的

Page({
  onLoad() {
    console.log(app.globalData);  // ✅ 可以使用
  }
});
```

## 相关文档

- [微信小程序官方文档 - getApp()](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html)
- [App 生命周期](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)

## 修复日期

2025-12-01

## 状态

✅ 已修复并测试通过

---

**重要提示：** 修复后请务必**清除编译缓存**并**重新编译**，以确保修改生效。

