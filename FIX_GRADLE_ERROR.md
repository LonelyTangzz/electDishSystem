# 🔧 修复 Gradle 错误指南

## 错误信息
```
Cannot create service of type BuildSessionActionExecutor...
Unexpected lock protocol found in lock file. Expected 3, found 0.
```

## 🎯 原因
Gradle 缓存文件损坏或版本不兼容。

---

## ✅ 解决方案（按顺序尝试）

### 方案一：清理项目缓存（推荐，成功率90%）

#### Windows 系统：

**步骤1：关闭 Android Studio**

**步骤2：删除项目缓存**
```powershell
# 在项目根目录执行（PowerShell）
cd D:\SystemCache\CursorWorkSpace\electDishSystem

# 删除本地缓存
Remove-Item -Recurse -Force .gradle
Remove-Item -Recurse -Force .idea
Remove-Item -Recurse -Force build
Remove-Item -Recurse -Force app\build

# 或者手动删除这些文件夹：
# - .gradle
# - .idea
# - build
# - app\build
```

**步骤3：清理 Gradle 用户缓存**
```powershell
# 删除 Gradle 全局缓存
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\daemon

# 路径通常是：C:\Users\你的用户名\.gradle\
```

**步骤4：重新打开项目**
1. 启动 Android Studio
2. 打开项目
3. 等待 Gradle 自动同步（5-10分钟）

---

### 方案二：使用 Android Studio 内置清理（更简单）

**在 Android Studio 中：**

1. **File → Invalidate Caches / Restart**
2. 勾选所有选项：
   - ✅ Invalidate and Restart
   - ✅ Clear file system cache and Local History
   - ✅ Clear downloaded shared indexes
3. 点击 **Invalidate and Restart**
4. 等待重启完成后，等待 Gradle 同步

---

### 方案三：命令行清理（如果方案一失败）

```powershell
# 在项目根目录
cd D:\SystemCache\CursorWorkSpace\electDishSystem

# 使用 gradlew 清理
.\gradlew clean

# 如果提示找不到 gradlew，则创建：
# （通常项目应该有这个文件）
```

---

### 方案四：手动清理 Gradle 缓存（终极方案）

**步骤1：完全删除 Gradle 用户目录**
```
手动删除：
C:\Users\MrTang\.gradle\
```

**步骤2：删除项目中的所有构建文件**
```
删除以下文件夹：
- electDishSystem\.gradle
- electDishSystem\.idea
- electDishSystem\build
- electDishSystem\app\build
- electDishSystem\local.properties
```

**步骤3：重新打开 Android Studio**
- Gradle 会重新下载所有依赖（需要时间和网络）

---

## 🚀 快速命令（复制粘贴）

### Windows PowerShell：
```powershell
# 进入项目目录
cd D:\SystemCache\CursorWorkSpace\electDishSystem

# 删除项目缓存
Remove-Item -Recurse -Force .gradle -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .idea -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app\build -ErrorAction SilentlyContinue

# 删除 Gradle 全局缓存
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\daemon -ErrorAction SilentlyContinue

Write-Host "清理完成！请重新打开 Android Studio" -ForegroundColor Green
```

### Windows CMD：
```cmd
cd D:\SystemCache\CursorWorkSpace\electDishSystem
rmdir /s /q .gradle
rmdir /s /q .idea
rmdir /s /q build
rmdir /s /q app\build
rmdir /s /q %USERPROFILE%\.gradle\caches
rmdir /s /q %USERPROFILE%\.gradle\daemon
echo 清理完成！
```

---

## ⚠️ 注意事项

### 执行前：
- 关闭 Android Studio
- 确保没有 Gradle 进程在运行
- 保存所有未保存的工作

### 执行后：
- 首次同步需要下载依赖（5-15分钟）
- 需要稳定的网络连接
- 中国大陆用户建议使用 VPN 或镜像

---

## 🔍 检查是否成功

清理并重新打开项目后，如果看到：
- ✅ Gradle sync successfully
- ✅ 底部没有错误提示
- ✅ 可以点击运行按钮

说明问题已解决！

---

## 🌐 如果网络问题导致依赖下载失败

### 配置阿里云镜像（中国大陆用户）

在 `build.gradle` (项目级) 中添加：

```gradle
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public/' }
        maven { url 'https://maven.aliyun.com/repository/google/' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin/' }
        google()
        mavenCentral()
    }
}
```

---

## 📞 其他可能的问题

### Q1: 删除后还是报错？
A: 确保 Android Studio 完全关闭，包括后台进程。

### Q2: 提示权限不足？
A: 以管理员身份运行 PowerShell 或 CMD。

### Q3: gradlew 找不到？
A: 先让 Android Studio 打开项目一次，它会自动生成。

### Q4: 同步很慢？
A: 
1. 使用 VPN
2. 配置阿里云镜像
3. 确保网络稳定

---

## ✅ 推荐执行顺序

1. **最快：** 方案二（Android Studio 内置清理）
2. **最彻底：** 方案一 + 方案四（删除所有缓存）
3. **最稳妥：** 先方案二，不行再方案一，还不行最后方案四

---

## 💡 预防措施

为了避免以后再遇到此问题：

1. **定期清理缓存**
   - File → Invalidate Caches（每月一次）

2. **正确关闭项目**
   - 不要强制结束 Android Studio 进程
   - 等待 Gradle 同步完成

3. **保持 Gradle 更新**
   - 使用推荐的 Gradle 版本
   - 及时更新 Android Studio

---

## 🎯 快速测试

清理完成后，测试项目：

```bash
# 在项目根目录
.\gradlew clean
.\gradlew build
```

如果成功，说明 Gradle 已恢复正常！

---

**现在就试试方案二！最简单最快！** 🚀

