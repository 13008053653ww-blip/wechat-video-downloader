import type { WechatMessage } from '../types/index';
/**
 * 解析微信推送的 XML 消息为 WechatMessage 对象
 */
export declare function parseXml(xmlString: string): WechatMessage;
/**
 * 构建微信文本回复 XML
 *
 * @param from 回复消息的发送方（公众号微信号）
 * @param to   回复消息的接收方（用户 OpenID）
 * @param content 回复的文本内容
 */
export declare function buildTextReply(from: string, to: string, content: string): string;
//# sourceMappingURL=xmlParser.d.ts.map