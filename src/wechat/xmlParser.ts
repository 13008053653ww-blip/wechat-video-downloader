import { XMLParser } from 'fast-xml-parser';
import type { WechatMessage } from '../types/index';

const parser = new XMLParser({
  // 不忽略 CDATA 标签内容，直接提取为文本值
  processEntities: false,
  trimValues: true,
});

/**
 * 解析微信推送的 XML 消息为 WechatMessage 对象
 */
export function parseXml(xmlString: string): WechatMessage {
  const parsed = parser.parse(xmlString);
  const msg = parsed.xml;
  return {
    ToUserName: String(msg.ToUserName),
    FromUserName: String(msg.FromUserName),
    CreateTime: Number(msg.CreateTime),
    MsgType: String(msg.MsgType) as WechatMessage['MsgType'],
    Content: msg.Content != null ? String(msg.Content) : undefined,
    Event: msg.Event != null ? String(msg.Event) : undefined,
    EventKey: msg.EventKey != null ? String(msg.EventKey) : undefined,
    MsgId: msg.MsgId != null ? String(msg.MsgId) : undefined,
  };
}

/**
 * 构建微信文本回复 XML
 *
 * @param from 回复消息的发送方（公众号微信号）
 * @param to   回复消息的接收方（用户 OpenID）
 * @param content 回复的文本内容
 */
export function buildTextReply(from: string, to: string, content: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `<xml>
  <ToUserName><![CDATA[${to}]]></ToUserName>
  <FromUserName><![CDATA[${from}]]></FromUserName>
  <CreateTime>${timestamp}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
</xml>`;
}
