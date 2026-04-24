import type { WechatMessage } from '../types/index';
/**
 * 路由消息到对应处理器，返回回复文本（纯文本，不是 XML）
 * 如果返回空字符串，表示不需要回复
 *
 * 路由规则：
 * 1. MsgType === 'event' → handleEvent
 * 2. MsgType === 'text' 且是命令 → handleCommand
 * 3. MsgType === 'text' 且不是命令 → handleTextMessage
 * 4. 其他类型（image/voice/video） → handleUnsupportedMessage
 */
export declare function routeMessage(message: WechatMessage): Promise<string>;
//# sourceMappingURL=messageRouter.d.ts.map