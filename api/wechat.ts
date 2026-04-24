import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifySignature } from '../src/wechat/crypto';
import { parseXml, buildTextReply } from '../src/wechat/xmlParser';
import { routeMessage } from '../src/wechat/messageRouter';

/**
 * 超时时间（毫秒）
 * 微信被动回复要求 5 秒内响应，留 0.5 秒余量
 */
const TIMEOUT_MS = 4500;

/**
 * 从请求中获取原始 XML 字符串
 * Vercel 对非 JSON content-type 可能返回 string、Buffer 或已解析对象
 */
function getRawBody(req: VercelRequest): string {
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf-8');
  }
  // fallback: 如果 body 是其他类型，尝试转为字符串
  return String(req.body ?? '');
}

/**
 * Vercel Serverless Function 入口
 * 处理微信公众号的所有回调请求
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    // GET 请求：Token 验证（公众号接入）
    if (req.method === 'GET') {
      const { signature, timestamp, nonce, echostr } = req.query;

      const token = process.env.WECHAT_TOKEN ?? '';

      const valid = verifySignature({
        signature: String(signature ?? ''),
        timestamp: String(timestamp ?? ''),
        nonce: String(nonce ?? ''),
        token,
      });

      if (valid) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(String(echostr ?? ''));
        return;
      }

      res.status(403).send('Forbidden');
      return;
    }

    // POST 请求：消息处理
    if (req.method === 'POST') {
      const xmlBody = getRawBody(req);
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
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send('success');
        return;
      }

      const xmlReply = buildTextReply(
        message.ToUserName,
        message.FromUserName,
        replyText,
      );

      res.setHeader('Content-Type', 'text/xml');
      res.status(200).send(xmlReply);
      return;
    }

    // 其他 HTTP 方法：返回 405
    res.status(405).send('Method Not Allowed');
  } catch {
    // 顶层异常捕获，确保始终返回友好提示
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('系统繁忙，请稍后重试');
  }
}
