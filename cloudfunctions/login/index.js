// 云函数：用户登录 - 获取用户OpenID和会话信息
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  
  const openid = wxContext.OPENID;
  const appid = wxContext.APPID;
  const unionid = wxContext.UNIONID;

  try {
    // 查询或创建用户记录
    const userCollection = db.collection('users');
    
    // 检查用户是否已存在
    const userResult = await userCollection.where({
      _openid: openid
    }).get();

    const now = new Date();

    if (userResult.data.length === 0) {
      // 新用户，创建记录
      await userCollection.add({
        data: {
          _openid: openid,
          appid: appid,
          unionid: unionid || '',
          createTime: now,
          lastLoginTime: now,
          nickName: '',
          avatarUrl: '',
          isAuthorized: false
        }
      });
      console.log('创建新用户记录:', openid);
    } else {
      // 老用户，更新最后登录时间
      await userCollection.where({
        _openid: openid
      }).update({
        data: {
          lastLoginTime: now
        }
      });
      console.log('更新用户登录时间:', openid);
    }

    return {
      success: true,
      openid: openid,
      appid: appid,
      unionid: unionid,
      message: '登录成功'
    };
  } catch (err) {
    console.error('登录失败:', err);
    return {
      success: false,
      openid: openid,
      appid: appid,
      unionid: unionid,
      message: '登录成功（用户信息记录失败）'
    };
  }
};




