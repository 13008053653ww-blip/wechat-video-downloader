"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatParseResult = formatParseResult;
exports.handleTextMessage = handleTextMessage;
exports.handleUnsupportedMessage = handleUnsupportedMessage;
const linkParser_1 = require("../parser/linkParser");
const kvStore_1 = require("../storage/kvStore");
/**
 * 使用说明文本
 */
const USAGE_GUIDE = '请把视频号的视频分享给我，我会帮你提取视频链接 😊';
/**
 * 格式化成功解析的回复
 */
function formatParseResult(result) {
    const lines = [
        '🎬 视频链接提取成功！',
        '',
        '📥 视频链接：',
        result.videoUrl,
        '',
        '复制上面的链接，在浏览器中打开即可观看或下载',
        '',
        '⚠️ 链接可能有时效性，请尽快使用',
    ];
    return lines.join('\n');
}
/**
 * 处理文本消息，返回回复文本内容（纯文本，不是 XML）
 * - 包含视频号链接：解析并格式化回复，同时保存历史记录
 * - 不包含链接：回复使用说明
 */
async function handleTextMessage(content, openId) {
    const result = (0, linkParser_1.parseVideoLink)(content);
    if (result.success) {
        // 保存历史记录，失败时静默忽略，不影响回复
        try {
            const record = {
                videoUrl: result.videoUrl,
                title: result.title,
                createdAt: new Date().toISOString(),
            };
            await (0, kvStore_1.addHistory)(openId, record);
        }
        catch {
            // KV 写入失败时静默忽略
        }
        return formatParseResult(result);
    }
    return result.errorMessage ?? USAGE_GUIDE;
}
/**
 * 处理非文本消息，返回提示文本
 */
function handleUnsupportedMessage() {
    return '暂时只支持文本消息哦，请把视频号视频的链接发给我';
}
//# sourceMappingURL=textHandler.js.map