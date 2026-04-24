import type { ParseResult } from '../types/index';
/**
 * 格式化成功解析的回复
 */
export declare function formatParseResult(result: ParseResult): string;
/**
 * 处理文本消息，返回回复文本内容（纯文本，不是 XML）
 * - 包含视频号链接：解析并格式化回复，同时保存历史记录
 * - 不包含链接：回复使用说明
 */
export declare function handleTextMessage(content: string, openId: string): Promise<string>;
/**
 * 处理非文本消息，返回提示文本
 */
export declare function handleUnsupportedMessage(): string;
//# sourceMappingURL=textHandler.d.ts.map