# Android Studio 下载与安装教程

## 📥 下载地址

### 官方下载（推荐）

**官方网站：**
- 国际版：https://developer.android.com/studio
- 中国版：https://developer.android.google.cn/studio

### 系统要求

**Windows系统要求：**
- 操作系统：Windows 10 或更高版本（64位）
- 内存：最少8GB RAM（推荐16GB）
- 磁盘空间：最少8GB（推荐SSD）
- 屏幕分辨率：1280 x 800 最低

**其他系统：**
- macOS：10.14 (Mojave) 或更高
- Linux：64位 GNU/Linux（Ubuntu, Debian等）

### JDK要求
- Android Studio自带JDK，无需单独安装
- 如需要：JDK 17 或更高版本

## 🚀 Windows安装步骤

### 第一步：下载安装包

1. **访问官方网站**
   ```
   https://developer.android.com/studio
   或
   https://developer.android.google.cn/studio （中国大陆用户推荐）
   ```

2. **点击"Download Android Studio"按钮**
   - 文件名类似：`android-studio-2023.x.x.x-windows.exe`
   - 大小约：1-1.5GB

3. **同意服务条款**
   - 勾选同意复选框
   - 开始下载

### 第二步：安装Android Studio

1. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 如果弹出UAC提示，点击"是"

2. **安装向导**
   ```
   ① 欢迎界面 → 点击 "Next"
   ② 选择组件 → 全部勾选（推荐）
      ✅ Android Studio
      ✅ Android Virtual Device
   ③ 选择安装位置
      - 默认：C:\Program Files\Android\Android Studio
      - 可以更改到其他盘（建议SSD）
   ④ 选择开始菜单文件夹 → 点击 "Install"
   ⑤ 等待安装完成（约5-10分钟）
   ⑥ 完成 → 勾选 "Start Android Studio" → 点击 "Finish"
   ```

### 第三步：首次启动配置

1. **导入设置**
   - 如果是首次安装，选择 "Do not import settings"
   - 点击 "OK"

2. **欢迎向导**
   ```
   ① Welcome → 点击 "Next"
   ② Install Type → 选择 "Standard"（标准安装）
   ③ Select UI Theme → 选择主题
      - Light（浅色）
      - Darcula（深色，推荐）
   ④ Verify Settings → 确认设置
   ⑤ 点击 "Finish" 开始下载组件
   ```

3. **下载SDK组件**
   - 会自动下载Android SDK、模拟器等
   - 大小约：3-5GB
   - 时间：10-30分钟（取决于网速）
   - **注意：** 需要良好的网络连接

### 第四步：配置SDK（可选）

如果下载速度很慢，可以配置镜像：

1. **打开Settings**
   - File → Settings (或 Ctrl+Alt+S)

2. **配置HTTP Proxy**
   ```
   Appearance & Behavior → System Settings → HTTP Proxy
   
   可选择：
   - Auto-detect proxy settings（自动检测）
   - Manual proxy configuration（手动配置）
   ```

3. **中国大陆用户镜像源（可选）**
   ```
   清华大学镜像：
   https://mirrors.tuna.tsinghua.edu.cn/
   
   腾讯镜像：
   https://mirrors.cloud.tencent.com/
   ```

## 🎯 安装完成后

### 打开您的项目

1. **启动Android Studio**

2. **选择打开项目**
   ```
   Open → 浏览到 D:\SystemCache\CursorWorkSpace\electDishSystem
   ```

3. **等待Gradle同步**
   - 首次打开会下载项目依赖
   - 时间：5-15分钟
   - 底部会显示进度

4. **创建虚拟设备**
   ```
   Tools → Device Manager → Create Device
   
   推荐配置：
   - 设备：Pixel 5
   - 系统镜像：API 34 (Android 14.0)
   - RAM：2048 MB
   ```

5. **运行应用**
   - 点击工具栏的绿色运行按钮 ▶️
   - 或按快捷键：Shift + F10

## 🔧 常见问题解决

### Q1: 下载速度很慢怎么办？

**方案A：使用VPN**
- 使用稳定的VPN连接

**方案B：离线安装**
1. 从其他来源获取安装包
2. 从 https://androidsdkmanager.azurewebsites.net/ 下载离线SDK

**方案C：使用中国镜像**
- 访问 https://developer.android.google.cn/studio

### Q2: Gradle同步失败

**解决方法：**
```
1. 检查网络连接
2. 在项目根目录创建 gradle.properties：
   systemProp.http.proxyHost=127.0.0.1
   systemProp.http.proxyPort=你的代理端口
   systemProp.https.proxyHost=127.0.0.1
   systemProp.https.proxyPort=你的代理端口

3. 或修改为阿里云镜像：
   在 build.gradle 中添加：
   maven { url 'https://maven.aliyun.com/repository/public/' }
   maven { url 'https://maven.aliyun.com/repository/google/' }
```

### Q3: 虚拟设备启动失败

**解决方法：**
```
1. 确认已启用虚拟化（BIOS中开启VT-x/AMD-V）
2. 在 BIOS 中启用：
   - Intel: VT-x
   - AMD: SVM Mode
3. 重启电脑后重试
```

### Q4: 提示"SDK location not found"

**解决方法：**
```
File → Project Structure → SDK Location
设置 Android SDK location 路径，例如：
C:\Users\你的用户名\AppData\Local\Android\Sdk
```

### Q5: 编译时内存不足

**解决方法：**
在 `gradle.properties` 中增加：
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m
```

## 📚 推荐插件（可选）

安装后可以添加这些插件提升开发体验：

```
File → Settings → Plugins

推荐插件：
1. Chinese Language Pack（中文语言包）
2. Rainbow Brackets（彩虹括号）
3. Key Promoter X（快捷键提示）
4. ADB Idea（ADB工具集成）
```

## 💡 快捷键（Windows）

```
常用快捷键：
- Ctrl + Alt + L     格式化代码
- Shift + F10        运行应用
- Shift + F9         调试应用
- Ctrl + Space       代码补全
- Ctrl + /           注释/取消注释
- Ctrl + D           复制当前行
- Alt + Enter        快速修复
- Ctrl + B           跳转到定义
- Ctrl + Alt + S     打开设置
```

## 🎓 学习资源

**官方文档：**
- https://developer.android.com/docs
- https://developer.android.com/courses

**中文社区：**
- https://developer.android.google.cn/

## 📞 需要帮助？

如果遇到问题：
1. 查看Android Studio的 Event Log（右下角）
2. 检查 Build 窗口的错误信息
3. Google搜索具体错误信息
4. 访问 Stack Overflow

---

## ⚡ 快速链接

| 下载内容 | 链接 |
|---------|------|
| Android Studio (官方) | https://developer.android.com/studio |
| Android Studio (中国) | https://developer.android.google.cn/studio |
| SDK Tools | https://developer.android.com/studio/releases/sdk-tools |
| 系统要求 | https://developer.android.com/studio/install |

---

**安装完成后，就可以打开您的 electDishSystem 项目了！** 🎉

有任何问题随时问我！


