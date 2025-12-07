# 📤 上传项目到 GitHub 指南

## ✅ 已完成的步骤

- ✅ Git 仓库已初始化
- ✅ 创建了 `.gitignore` 文件（排除敏感信息和不必要的文件）
- ✅ 完成了初始提交（110个文件）

---

## 🚀 接下来的步骤

### 方法一：通过 GitHub 网站创建（推荐新手）

#### 1️⃣ 在 GitHub 上创建新仓库

1. 打开浏览器，访问 [https://github.com](https://github.com)
2. 登录您的 GitHub 账号
3. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
4. 填写仓库信息：
   - **Repository name**: `electDishSystem` 或 `atang-canteen`
   - **Description**: `阿汤的小食堂 - Android应用与微信小程序点餐系统`
   - **可见性**: 选择 **Public**（公开）或 **Private**（私有）
   - ⚠️ **不要勾选** "Add a README file"（我们已经有了）
   - ⚠️ **不要勾选** "Add .gitignore"（我们已经有了）
5. 点击 **"Create repository"** 按钮

#### 2️⃣ 连接到远程仓库并推送

创建完仓库后，GitHub 会显示一个页面，上面有命令。复制类似这样的 URL：

```
https://github.com/您的用户名/electDishSystem.git
```

然后在**当前终端**中运行以下命令（记得替换成您的仓库 URL）：

```bash
# 添加远程仓库
git remote add origin https://github.com/您的用户名/electDishSystem.git

# 推送到 GitHub（首次推送）
git push -u origin master
```

**或者使用 SSH 方式**（如果您已经配置了 SSH 密钥）：

```bash
# 添加远程仓库（SSH）
git remote add origin git@github.com:您的用户名/electDishSystem.git

# 推送到 GitHub
git push -u origin master
```

---

### 方法二：通过 GitHub CLI（适合命令行爱好者）

如果您安装了 GitHub CLI (`gh`)：

```bash
# 登录 GitHub（首次使用）
gh auth login

# 创建仓库并推送
gh repo create electDishSystem --public --source=. --remote=origin --push
```

---

## 🔐 关于敏感信息

您的 `.gitignore` 已经配置好，以下文件**不会**被上传到 GitHub：

- ✅ `project.private.config.json` - 包含您的个人 AppID
- ✅ `local.properties` - Android 本地配置
- ✅ `node_modules/` - 依赖包
- ✅ `.idea/` - IDE 配置
- ✅ `build/` - 编译产物

---

## 📝 后续更新代码

当您修改了代码想要更新到 GitHub 时：

```bash
# 查看修改了哪些文件
git status

# 添加所有修改的文件
git add .

# 提交修改（填写有意义的提交信息）
git commit -m "您的修改说明，例如：修复购物车bug"

# 推送到 GitHub
git push
```

---

## 🎯 推送完成后

访问您的 GitHub 仓库页面：
```
https://github.com/您的用户名/electDishSystem
```

您应该能看到：
- ✅ 完整的项目文件
- ✅ README.md 显示在首页
- ✅ 110 个文件
- ✅ 初始提交记录

---

## 🐛 常见问题

### Q1: 推送时要求输入用户名和密码？

**A**: GitHub 已经不再支持密码登录，您需要使用**个人访问令牌**（Personal Access Token）：

1. 访问 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写名称，勾选 `repo` 权限
4. 生成后复制令牌（**只显示一次，请保存好**）
5. 推送时，用户名输入您的 GitHub 用户名，密码输入刚才的令牌

### Q2: 如何切换到 SSH 方式？

**A**: 如果您已经配置了 SSH 密钥：

```bash
# 查看当前远程仓库
git remote -v

# 删除旧的 HTTPS 远程仓库
git remote remove origin

# 添加 SSH 远程仓库
git remote add origin git@github.com:您的用户名/electDishSystem.git

# 推送
git push -u origin master
```

### Q3: 推送时提示 "master" 分支不存在？

**A**: 新版 Git 默认分支名可能是 `main`：

```bash
# 查看当前分支
git branch

# 如果是 main 分支，推送时使用 main
git push -u origin main
```

---

## 📚 更多资源

- [GitHub 快速入门](https://docs.github.com/zh/get-started/quickstart)
- [Git 基础教程](https://git-scm.com/book/zh/v2)
- [配置 SSH 密钥](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)

---

**准备好了吗？现在就去创建您的 GitHub 仓库吧！** 🚀


