// 用户管理工具类

/**
 * 微信登录 - 获取OpenID
 * @param {boolean} showLoading - 是否显示加载提示，默认false（静默登录）
 */
function wxLogin(showLoading = false) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    
    // Demo模式
    if (app && app.globalData && app.globalData.demoMode) {
      const openid = 'demo_' + Date.now();
      app.globalData.openid = openid;
      resolve({
        success: true,
        openid: openid,
        isDemo: true
      });
      return;
    }

    // 云开发模式 - 静默登录，不显示loading
    if (showLoading) {
      wx.showLoading({
        title: '登录中...',
        mask: true
      });
    }

    // 先调用wx.login获取code
    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数获取openid
          wx.cloud.callFunction({
            name: 'login',
            success: cloudRes => {
              if (showLoading) {
                wx.hideLoading();
              }
              console.log('云函数登录成功:', cloudRes);
              
              if (cloudRes.result && cloudRes.result.openid) {
                if (app && app.globalData) {
                  app.globalData.openid = cloudRes.result.openid;
                }
                resolve({
                  success: true,
                  openid: cloudRes.result.openid,
                  isDemo: false
                });
              } else {
                reject(new Error('获取OpenID失败'));
              }
            },
            fail: err => {
              if (showLoading) {
                wx.hideLoading();
              }
              console.error('云函数调用失败:', err);
              // 降级为Demo模式
              const openid = 'demo_' + Date.now();
              if (app && app.globalData) {
                app.globalData.demoMode = true;
                app.globalData.openid = openid;
              }
              resolve({
                success: true,
                openid: openid,
                isDemo: true,
                fallback: true
              });
            }
          });
        } else {
          if (showLoading) {
            wx.hideLoading();
          }
          reject(new Error('wx.login失败: ' + res.errMsg));
        }
      },
      fail: err => {
        if (showLoading) {
          wx.hideLoading();
        }
        console.error('wx.login调用失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 获取用户信息授权 - 使用按钮方式
 * 注意：此方法需要配合 <button open-type="getUserInfo"> 使用
 */
function getUserInfoByButton(e) {
  return new Promise((resolve, reject) => {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      saveUserInfo(userInfo);
      resolve(userInfo);
    } else {
      reject(new Error('用户拒绝授权'));
    }
  });
}

/**
 * 获取用户信息 - 使用getUserProfile (新版方式)
 */
function getUserProfile() {
  return new Promise((resolve, reject) => {
    console.log('🔐 调用 wx.getUserProfile');
    
    // 检查是否支持getUserProfile
    if (!wx.getUserProfile) {
      console.error('❌ 不支持 getUserProfile API');
      reject(new Error('当前微信版本过低，请升级微信'));
      return;
    }
    
    console.log('✅ 支持 getUserProfile，开始调用...');
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: res => {
        console.log('✅ wx.getUserProfile 调用成功:', res);
        const userInfo = res.userInfo;
        console.log('📝 用户信息:', {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        });
        saveUserInfo(userInfo);
        resolve(userInfo);
      },
      fail: err => {
        console.error('❌ wx.getUserProfile 调用失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 保存用户信息
 */
function saveUserInfo(userInfo) {
  if (!userInfo) {
    console.warn('⚠️ 用户信息为空，无法保存');
    return;
  }

  console.log('💾 开始保存用户信息:', userInfo.nickName);
  const app = getApp();
  
  // 保存到全局数据
  if (app && app.globalData) {
    app.globalData.userInfo = userInfo;
    console.log('✅ 已保存到全局数据');
  }

  // 保存到本地存储
  try {
    wx.setStorageSync('userInfo', userInfo);
    console.log('✅ 已保存到本地存储');
  } catch (err) {
    console.error('❌ 保存用户信息到本地失败:', err);
  }

  // 保存到数据库
  if (app && app.globalData && app.globalData.openid) {
    const openid = app.globalData.openid;
    console.log('☁️ 保存到云数据库, OpenID:', openid);
    saveUserInfoToDB(openid, userInfo);
  }
}

/**
 * 保存用户信息到数据库
 */
function saveUserInfoToDB(openid, userInfo) {
  const app = getApp();
  
  if (app && app.globalData && app.globalData.demoMode) {
    // Demo模式：保存到本地存储
    try {
      const demoStorage = require('./demoStorage.js');
      demoStorage.DemoUserStorage.saveUserInfo(openid, userInfo);
    } catch (err) {
      console.error('Demo模式保存失败:', err);
    }
  } else {
    // 云开发模式：保存到云数据库
    wx.cloud.database().collection('users').where({
      _openid: openid
    }).update({
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city,
        isAuthorized: true,
        updateTime: new Date()
      },
      success: res => {
        console.log('用户信息保存成功:', res);
      },
      fail: err => {
        console.error('用户信息保存失败:', err);
      }
    });
  }
}

/**
 * 从本地存储恢复用户信息
 */
function restoreUserInfo() {
  const app = getApp();
  
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      if (app && app.globalData) {
        app.globalData.userInfo = userInfo;
      }
      return userInfo;
    }
  } catch (err) {
    console.error('恢复用户信息失败:', err);
  }
  return null;
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  const app = getApp();
  return app && app.globalData && app.globalData.openid !== null;
}

/**
 * 检查是否已授权用户信息
 */
function isAuthorized() {
  const app = getApp();
  return app && app.globalData && app.globalData.userInfo !== null;
}

/**
 * 退出登录
 */
function logout() {
  console.log('🚪 开始退出登录...');
  const app = getApp();
  
  // 清除全局数据
  if (app && app.globalData) {
    app.globalData.userInfo = null;
    console.log('✅ 已清除全局用户数据');
  }
  
  // 清除本地存储
  try {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('demo_userInfo');
    console.log('✅ 已清除本地存储');
  } catch (err) {
    console.error('❌ 清除本地存储失败:', err);
  }
}

/**
 * 完整的登录流程
 */
async function fullLogin() {
  try {
    // 1. 先进行微信登录获取openid
    const loginResult = await wxLogin();
    console.log('登录结果:', loginResult);

    // 2. 尝试从本地恢复用户信息
    const cachedUserInfo = restoreUserInfo();
    if (cachedUserInfo) {
      console.log('从缓存恢复用户信息:', cachedUserInfo);
      return {
        success: true,
        openid: loginResult.openid,
        userInfo: cachedUserInfo,
        needAuth: false
      };
    }

    // 3. 需要用户授权
    return {
      success: true,
      openid: loginResult.openid,
      userInfo: null,
      needAuth: true
    };
  } catch (err) {
    console.error('登录流程失败:', err);
    throw err;
  }
}

module.exports = {
  wxLogin,
  getUserInfoByButton,
  getUserProfile,
  saveUserInfo,
  restoreUserInfo,
  isLoggedIn,
  isAuthorized,
  logout,
  fullLogin
};
