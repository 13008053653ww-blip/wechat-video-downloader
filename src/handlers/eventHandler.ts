/**
 * 欢迎语文本（subscribe 事件回复）
 */
const WELCOME_MESSAGE = `👋 欢迎关注！

我是视频号链接提取助手，使用方法很简单：

1️⃣ 在视频号看到喜欢的视频
2️⃣ 点击分享，选择发送给我
3️⃣ 我会自动提取视频链接回复给你

发送"帮助"查看更多信息`;

/**
 * 处理事件消息，返回回复文本内容（纯文本，不是 XML）
 * - subscribe：回复欢迎语和使用说明
 * - unsubscribe：不回复（返回空字符串）
 * - 其他事件：返回空字符串
 */
export function handleEvent(event: string): string {
  if (event === 'subscribe') {
    return WELCOME_MESSAGE;
  }

  return '';
}
