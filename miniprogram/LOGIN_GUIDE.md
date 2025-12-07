# 微信登录功能说明

## 功能概述

小程序现已支持完整的微信登录功能，用户可以通过微信授权登录来使用完整的功能。

## 登录流程

### 1. 自动登录（获取OpenID）

当用户打开小程序时，系统会自动执行以下操作：
- 调用 `wx.login()` 获取登录凭证
- 调用云函数 `login` 获取用户的 OpenID
- OpenID 会被保存到全局数据中，用于标识用户身份

### 2. 用户信息授权

用户需要手动授权才能获取头像、昵称等个人信息：
1. 进入"我的"页面
2. 点击"微信授权登录"按钮
3. 在弹出的授权窗口中点击"允许"
4. 系统会保存用户信息到本地和云数据库

## 技术实现

### 文件结构

```
miniprogram/
├── app.js                          # 应用入口，初始化登录流程
├── utils/
│   └── userManager.js              # 用户管理工具类
└── pages/
    └── mine/
        ├── mine.js                 # 我的页面逻辑
        ├── mine.wxml               # 我的页面结构
        └── mine.wxss               # 我的页面样式

cloudfunctions/
└── login/
    └── index.js                    # 登录云函数
```

### 核心功能

#### 1. 用户管理工具类 (userManager.js)

提供以下核心方法：

- `wxLogin()` - 执行微信登录，获取 OpenID
- `getUserProfile()` - 获取用户信息授权（新版API）
- `getUserInfoByButton(e)` - 通过按钮获取用户信息（兼容老版本）
- `saveUserInfo(userInfo)` - 保存用户信息
- `restoreUserInfo()` - 从本地存储恢复用户信息
- `isLoggedIn()` - 检查是否已登录
- `isAuthorized()` - 检查是否已授权
- `logout()` - 退出登录
- `fullLogin()` - 完整的登录流程

#### 2. 登录云函数 (cloudfunctions/login/index.js)

功能：
- 自动获取用户的 OpenID、AppID、UnionID
- 在云数据库中创建或更新用户记录
- 记录用户的登录时间

#### 3. 应用初始化 (app.js)

启动时自动执行：
1. 初始化云开发环境
2. 执行登录流程获取 OpenID
3. 尝试从本地恢复用户信息

#### 4. 我的页面 (pages/mine/)

功能：
- 显示用户信息（头像、昵称）
- 提供登录授权按钮
- 支持两种授权方式：
  - `getUserProfile` - 新版API（推荐）
  - `button open-type="getUserInfo"` - 老版本兼容
- 退出登录功能

## 兼容性说明

### 支持的授权方式

1. **getUserProfile** (推荐)
   - 适用于基础库 2.10.4 及以上
   - 需要用户主动触发
   - 每次调用都需要用户确认

2. **button open-type="getUserInfo"** (兼容)
   - 适用于老版本微信
   - 自动降级使用

### Demo模式

如果云开发环境未配置或出现错误，系统会自动切换到Demo模式：
- 使用本地存储保存数据
- 生成模拟的 OpenID
- 所有功能仍然可用

## 数据存储

### 云数据库（云开发模式）

用户信息存储在 `users` 集合中，包含以下字段：
- `_openid` - 用户OpenID（自动添加）
- `appid` - 小程序AppID
- `unionid` - 用户UnionID（如果有）
- `nickName` - 昵称
- `avatarUrl` - 头像URL
- `gender` - 性别
- `country` - 国家
- `province` - 省份
- `city` - 城市
- `isAuthorized` - 是否已授权
- `createTime` - 创建时间
- `lastLoginTime` - 最后登录时间
- `updateTime` - 更新时间

### 本地存储（Demo模式）

- `userInfo` - 用户信息对象
- `demo_userInfo` - Demo模式的用户信息（兼容旧数据）

## 使用示例

### 在其他页面中使用

```javascript
const app = getApp();
const userManager = require('../../utils/userManager.js');

Page({
  onLoad() {
    // 检查是否已登录
    if (userManager.isLoggedIn()) {
      console.log('用户OpenID:', app.globalData.openid);
    }
    
    // 检查是否已授权
    if (userManager.isAuthorized()) {
      const userInfo = app.globalData.userInfo;
      console.log('用户信息:', userInfo);
    } else {
      // 提示用户去授权
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine'
            });
          }
        }
      });
    }
  }
});
```

### 手动触发登录

```javascript
const userManager = require('../../utils/userManager.js');

// 完整登录流程
userManager.fullLogin()
  .then(result => {
    if (result.needAuth) {
      // 需要用户授权
      return userManager.getUserProfile();
    }
    return result.userInfo;
  })
  .then(userInfo => {
    console.log('登录成功:', userInfo);
  })
  .catch(err => {
    console.error('登录失败:', err);
  });
```

## 注意事项

1. **隐私政策**
   - 在使用用户信息前，请确保已添加隐私政策说明
   - 需要在小程序管理后台配置隐私设置

2. **云函数部署**
   - 需要部署 `login` 云函数到云端
   - 确保云开发环境已开通

3. **云数据库权限**
   - `users` 集合需要配置适当的权限
   - 建议设置为：仅创建者可读写

4. **测试**
   - 可以使用 Demo 模式进行本地测试
   - 正式发布前请确保云开发环境正常

## 故障排除

### 问题1：无法获取OpenID

**解决方案：**
- 检查云开发环境是否已开通
- 检查云函数是否已部署
- 查看控制台错误信息
- 系统会自动降级到Demo模式

### 问题2：授权窗口不弹出

**解决方案：**
- 确保微信版本 ≥ 6.5.3
- 确保基础库版本 ≥ 2.10.4
- 检查是否在真机上测试（开发者工具可能有差异）

### 问题3：用户信息无法保存

**解决方案：**
- 检查云数据库权限设置
- 查看云函数日志
- 确认网络连接正常

## 更新日志

### v1.0.0 (2025-12-01)
- ✅ 实现微信登录功能
- ✅ 支持 getUserProfile 新版API
- ✅ 兼容老版本授权方式
- ✅ 添加用户管理工具类
- ✅ 实现自动登录和信息缓存
- ✅ 支持Demo模式降级

