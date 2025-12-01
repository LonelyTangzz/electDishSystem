# ⚠️ Gradle 版本锁定说明

## 🚨 重要提示

**请不要修改 Gradle 版本！**

当前项目配置的 Gradle 版本是经过测试的稳定版本组合。

---

## ✅ 当前配置（已锁定）

```
Gradle: 8.2（稳定版）
Android Gradle Plugin: 8.1.0
Kotlin: 1.9.0
JDK: 17
```

这是经过验证的兼容组合！

---

## ❌ 不要使用的版本

**绝对不要使用：**
- ❌ Gradle 9.0-milestone-1（测试版，不稳定）
- ❌ Gradle 9.0+（尚未发布稳定版）
- ❌ Gradle 7.0-（太旧，不兼容）

**为什么？**
1. Gradle 9.0-milestone-1 是**测试版**，API 不稳定
2. `module()` 等方法在测试版中被移除或修改
3. 会导致各种编译错误
4. 无法保证项目正常运行

---

## 🔍 如何确认当前版本

### 方法1：查看文件
打开 `gradle/wrapper/gradle-wrapper.properties`：
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.2-bin.zip
```

✅ 正确：**gradle-8.2-bin.zip**  
❌ 错误：**gradle-9.0-milestone-1-bin.zip**

### 方法2：命令行查看
```bash
.\gradlew --version
```

应该显示：`Gradle 8.2`

---

## 🛡️ 版本被自动修改的原因

如果 Gradle 版本自动改变，可能是因为：

1. **Android Studio 自动升级**
   - 解决：File → Settings → Build → Gradle
   - 取消勾选 "Use Gradle from"
   - 选择 "Gradle wrapper"

2. **Gradle wrapper 自动更新**
   - 解决：不要运行 `gradle wrapper --gradle-version=xxx`

3. **IDE 建议升级**
   - 解决：忽略升级提示，保持当前版本

---

## 🔧 如果版本被改了怎么办

### 步骤1：恢复正确版本
确保 `gradle/wrapper/gradle-wrapper.properties` 包含：
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.2-bin.zip
```

### 步骤2：清理缓存
```powershell
# 删除 Gradle 缓存
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\daemon

# 删除项目缓存
Remove-Item -Recurse -Force .gradle
Remove-Item -Recurse -Force build
Remove-Item -Recurse -Force app\build
```

### 步骤3：重新同步
```bash
.\gradlew clean
```

然后在 Android Studio 中：
**File → Sync Project with Gradle Files**

---

## 📋 常见错误对应

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `module() not found` | Gradle 9.0+ | 降级到 8.2 |
| `API changed` | 测试版不稳定 | 使用稳定版 |
| `Plugin incompatible` | 版本不匹配 | 使用推荐组合 |

---

## 🎯 推荐的版本升级路径

如果将来需要升级（目前不需要）：

```
当前：Gradle 8.2 → Android Plugin 8.1.0
可升级到：Gradle 8.3 → Android Plugin 8.2.0
未来稳定：Gradle 8.5 → Android Plugin 8.3.0
```

**永远使用稳定版，不要使用 milestone/alpha/beta 版本！**

---

## ⚠️ 最后的警告

**如果看到任何提示让你升级 Gradle 到 9.0+，请忽略！**

当前配置是最佳实践，经过充分测试，完全满足项目需求。

不要因为版本号"看起来更新"就升级，稳定 > 新版！

---

## 📞 遇到问题？

如果确实需要升级或修改版本：
1. 先查看官方兼容性文档
2. 确认所有插件都支持新版本
3. 在测试分支中验证
4. 不要直接在主分支修改

---

**记住：Gradle 8.2 + Android Plugin 8.1.0 = 稳定可靠！** ✅

