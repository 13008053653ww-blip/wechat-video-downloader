# 微信视频号链接提取助手 - 部署教程

## 这是什么？

一个微信公众号机器人。你在视频号看到喜欢的视频，分享给公众号，机器人自动回复视频链接。

## 你需要准备什么？

1. 一个 GitHub 账号（免费注册）
2. 一个 Vercel 账号（免费注册）
3. 一个微信公众号（个人订阅号，免费注册）

全程不花一分钱。

---

## 第一步：注册微信公众号

1. 打开 https://mp.weixin.qq.com
2. 点击右上角「立即注册」
3. 选择「订阅号」
4. 用你的邮箱注册，按提示填写信息
5. 注册类型选「个人」
6. 注册完成后，登录公众号后台

> 如果你已经有公众号了，跳过这一步。

---

## 第二步：把代码上传到 GitHub

1. 打开 https://github.com ，登录你的账号（没有就注册一个）
2. 点击右上角的 `+` 号，选择 `New repository`
3. 仓库名填 `wechat-video-downloader`
4. 选择 `Public`（公开），点击 `Create repository`
5. 在你的电脑上打开终端（Terminal），执行以下命令：

```bash
cd wechat-video-downloader
git init
git add .
git commit -m "初始化项目"
git branch -M main
git remote add origin https://github.com/你的用户名/wechat-video-downloader.git
git push -u origin main
```

> 把「你的用户名」替换成你的 GitHub 用户名。

---

## 第三步：部署到 Vercel

1. 打开 https://vercel.com ，用 GitHub 账号登录
2. 点击 `Add New...` → `Project`
3. 在列表中找到 `wechat-video-downloader`，点击 `Import`
4. 在部署设置页面：
   - Framework Preset 选 `Other`
   - Root Directory 保持默认（不用改）
5. 展开 `Environment Variables`（环境变量），添加一个变量：
   - Name 填：`WECHAT_TOKEN`
   - Value 填：随便想一个密码，比如 `mytoken123abc`（记住这个值，后面要用）
6. 点击 `Deploy`
7. 等 1-2 分钟，部署完成后，Vercel 会给你一个网址，类似：
   `https://wechat-video-downloader-xxx.vercel.app`

> 记住这个网址，下一步要用。

---

## 第四步：配置公众号服务器

1. 登录微信公众号后台 https://mp.weixin.qq.com
2. 左侧菜单找到「设置与开发」→「基本配置」
3. 在「服务器配置」区域，点击「修改配置」
4. 填写以下信息：
   - **URL**：`https://你的vercel网址/api/wechat`
     - 例如：`https://wechat-video-downloader-xxx.vercel.app/api/wechat`
   - **Token**：填你在第三步设置的那个值，比如 `mytoken123abc`
   - **EncodingAESKey**：点击「随机生成」
   - **消息加解密方式**：选「明文模式」
5. 点击「提交」
   - 如果显示「提交成功」，说明配置正确
   - 如果显示「token 验证失败」，检查 URL 和 Token 是否填对了
6. 点击「启用」

---

## 第五步：测试

1. 用微信扫描公众号的二维码，关注你的公众号
2. 你应该会收到欢迎消息
3. 去视频号找一个视频，点击分享，选择你的公众号
4. 机器人会自动回复视频链接

---

## 常见问题

### Q: 提交配置时显示「token 验证失败」？
检查两个地方：
- Vercel 环境变量里的 `WECHAT_TOKEN` 值
- 公众号后台填的 Token 值
这两个必须完全一样。

### Q: 分享视频后没有回复？
- 确认公众号后台的服务器配置已经「启用」了
- 确认 URL 填的是 `https://xxx.vercel.app/api/wechat`（注意最后的 `/api/wechat`）

### Q: 回复说「未识别到视频号链接」？
视频号分享给公众号时，消息格式可能不包含直接链接。你可以试试：
1. 在视频号点分享 → 复制链接
2. 把复制的链接直接发送给公众号

### Q: 想开启历史记录功能？
在 Vercel 项目设置中添加 Vercel KV（免费额度），然后添加两个环境变量：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
具体操作：Vercel 项目页面 → Storage → Create Database → KV → 按提示操作

### Q: 以后怎么更新代码？
修改代码后，推送到 GitHub 就行：
```bash
git add .
git commit -m "更新"
git push
```
Vercel 会自动重新部署。
