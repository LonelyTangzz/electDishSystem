// 工具函数
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// 显示通用提示
const showToast = (title, icon = 'none', duration = 1500) => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
};

// 显示成功提示
const showSuccess = (title, duration = 1500) => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration
  });
};

// 显示错误提示
const showError = (title, duration = 2000) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: duration
  });
};

// 显示加载中
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  });
};

// 隐藏加载
const hideLoading = () => {
  wx.hideLoading();
};

// 确认对话框
const showConfirm = (title, content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// 验证手机号
const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
};

// 格式化价格
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    'pending': '待确认',
    'confirmed': '已确认',
    'preparing': '准备中',
    'delivering': '配送中',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return statusMap[status] || status;
};

// 获取订单状态颜色
const getOrderStatusColor = (status) => {
  const colorMap = {
    'pending': '#FA8C16',
    'confirmed': '#1890FF',
    'preparing': '#FF4D4F',
    'delivering': '#73D13D',
    'completed': '#8C8C8C',
    'cancelled': '#BFBFBF'
  };
  return colorMap[status] || '#8C8C8C';
};

module.exports = {
  formatTime,
  showToast,
  showSuccess,
  showError,
  showLoading,
  hideLoading,
  showConfirm,
  validatePhone,
  formatPrice,
  getOrderStatusText,
  getOrderStatusColor
};
