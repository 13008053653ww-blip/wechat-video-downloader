import { ParseResult } from '../types/index';

/**
 * 视频号链接的域名模式
 * - channels.weixin.qq.com：视频号标准链接
 * - 包含 finder 关键词的微信域名链接
 */
const VIDEO_CHANNEL_PATTERNS = [
  /channels\.weixin\.qq\.com/i,
  /weixin\.qq\.com\/.*finder/i,
];

/**
 * 用于从文本中提取 URL 的正则
 * 匹配 http:// 或 https:// 开头的链接
 */
const URL_REGEX = /https?:\/\/[^\s<>"')\]，。！？、；：）】}]+/gi;

/**
 * 判断 URL 是否为视频号链接
 * 匹配 channels.weixin.qq.com 域名，或包含 finder 关键词的微信域名链接
 */
export function isVideoChannelUrl(url: string): boolean {
  return VIDEO_CHANNEL_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * 从文本中用正则提取第一个视频号链接
 * 用户可能粘贴整段分享文字，需要从中提取 URL
 * 如果文本中有多个链接，返回第一个视频号链接
 * 没有找到视频号链接时返回 null
 */
export function extractVideoUrl(text: string): string | null {
  const urls = text.match(URL_REGEX);
  if (!urls) {
    return null;
  }

  for (const url of urls) {
    if (isVideoChannelUrl(url)) {
      return url;
    }
  }

  return null;
}

/**
 * 综合解析函数
 * - 空输入或纯空白返回错误提示
 * - 找到视频号链接返回 success + videoUrl
 * - 未找到链接返回错误提示
 */
export function parseVideoLink(text: string): ParseResult {
  if (!text || !text.trim()) {
    return {
      success: false,
      errorMessage: '请把视频号的视频分享给我，我会帮你提取视频链接 😊',
    };
  }

  const videoUrl = extractVideoUrl(text);

  if (videoUrl) {
    return {
      success: true,
      videoUrl,
    };
  }

  return {
    success: false,
    errorMessage: '未识别到视频号链接，请直接分享视频号视频给我，或发送包含视频号链接的文本',
  };
}
