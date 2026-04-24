import { ParseResult } from '../types/index';
/**
 * 判断 URL 是否为视频号链接
 * 匹配 channels.weixin.qq.com 域名，或包含 finder 关键词的微信域名链接
 */
export declare function isVideoChannelUrl(url: string): boolean;
/**
 * 从文本中用正则提取第一个视频号链接
 * 用户可能粘贴整段分享文字，需要从中提取 URL
 * 如果文本中有多个链接，返回第一个视频号链接
 * 没有找到视频号链接时返回 null
 */
export declare function extractVideoUrl(text: string): string | null;
/**
 * 综合解析函数
 * - 空输入或纯空白返回错误提示
 * - 找到视频号链接返回 success + videoUrl
 * - 未找到链接返回错误提示
 */
export declare function parseVideoLink(text: string): ParseResult;
//# sourceMappingURL=linkParser.d.ts.map