"use strict";
/**
 * 命令处理器
 * 处理用户发送的关键词命令（帮助、历史记录等）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCommand = isCommand;
exports.handleCommand = handleCommand;
const kvStore_1 = require("../storage/kvStore");
/**
 * 帮助命令关键词（不区分大小写匹配）
 */
const HELP_KEYWORDS = ['帮助', 'help', '使用说明'];
/**
 * 历史记录命令关键词
 */
const HISTORY_KEYWORDS = ['历史', '历史记录'];
/**
 * 帮助回复文本
 */
const HELP_REPLY = `📖 使用说明

我是视频号链接提取助手，帮你提取视频号视频的链接。

使用方法：
1️⃣ 在视频号看到喜欢的视频
2️⃣ 点击分享，选择发送给我
3️⃣ 我会自动提取视频链接回复给你

也可以直接发送包含视频号链接的文本给我。

⚠️ 免责声明：本工具仅供个人学习使用，请尊重原创作者版权。`;
/**
 * 历史记录功能未开启时的回复
 */
const HISTORY_UNAVAILABLE_REPLY = '历史记录功能未开启';
/**
 * 判断文本是否为命令关键词
 * 去除前后空格后，不区分大小写匹配
 */
function isCommand(text) {
    const normalized = text.trim().toLowerCase();
    return (HELP_KEYWORDS.some((kw) => kw.toLowerCase() === normalized) ||
        HISTORY_KEYWORDS.some((kw) => kw.toLowerCase() === normalized));
}
/**
 * 处理命令，返回回复文本
 * - "帮助"/"help"/"使用说明" → 回复使用说明和免责声明
 * - "历史"/"历史记录" → 查询 KV 并格式化回复，KV 不可用时回复"历史记录功能未开启"
 */
async function handleCommand(text, openId) {
    const normalized = text.trim().toLowerCase();
    if (HELP_KEYWORDS.some((kw) => kw.toLowerCase() === normalized)) {
        return HELP_REPLY;
    }
    if (HISTORY_KEYWORDS.some((kw) => kw.toLowerCase() === normalized)) {
        if (!(0, kvStore_1.isKvAvailable)()) {
            return HISTORY_UNAVAILABLE_REPLY;
        }
        const records = await (0, kvStore_1.getHistory)(openId);
        return (0, kvStore_1.formatHistoryReply)(records);
    }
    return '';
}
//# sourceMappingURL=commandHandler.js.map