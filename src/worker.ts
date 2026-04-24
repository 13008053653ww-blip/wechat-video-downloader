/**
 * Cloudflare Workers 入口
 * 处理微信公众号的所有回调请求
 */

import { parseXml, buildTextReply } from './wechat/xmlParser';
import { routeMessage } from './wechat/messageRouter';

/**
 * 超时时间（毫秒）
 * 微信被动回复要求 5 秒内响应，留 0.5 秒余量
 */
const TIMEOUT_MS = 4500;

export interface Env {
  WECHAT_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // GET 请求：Token 验证（公众号接入）
      if (request.method === 'GET') {
        const url = new URL(request.url);
        const echostr = url.searchParams.get('echostr') ?? 'ok';
        return new Response(echostr, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // POST 请求：消息处理
      if (request.method === 'POST') {
        const xmlBody = await request.text();
        const message = parseXml(xmlBody);

        // 使用 Promise.race 实现 4.5 秒超时
        const replyText = await Promise.race<string>([
          Promise.resolve(routeMessage(message)),
          new Promise<string>((resolve) =>
            setTimeout(() => resolve('解析超时，请稍后重试'), TIMEOUT_MS),
          ),
        ]);

        // 微信要求：不需要回复时返回 "success"
        if (!replyText) {
          return new Response('success', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
          });
        }

        const xmlReply = buildTextReply(
          message.ToUserName,
          message.FromUserName,
          replyText,
        );

        return new Response(xmlReply, {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        });
      }

      // 其他 HTTP 方法：返回 405
      return new Response('Method Not Allowed', { status: 405 });
    } catch {
      // 顶层异常捕获，确保始终返回友好提示
      return new Response('系统繁忙，请稍后重试', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
};
