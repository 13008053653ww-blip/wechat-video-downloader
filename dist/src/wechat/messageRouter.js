"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeMessage = routeMessage;
const textHandler_1 = require("../handlers/textHandler");
const eventHandler_1 = require("../handlers/eventHandler");
const commandHandler_1 = require("../handlers/commandHandler");
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
async function routeMessage(message) {
    if (message.MsgType === 'event') {
        return (0, eventHandler_1.handleEvent)(message.Event ?? '');
    }
    if (message.MsgType === 'text') {
        const content = message.Content ?? '';
        if ((0, commandHandler_1.isCommand)(content)) {
            return (0, commandHandler_1.handleCommand)(content, message.FromUserName);
        }
        return (0, textHandler_1.handleTextMessage)(content, message.FromUserName);
    }
    // image, voice, video 等非文本类型
    return (0, textHandler_1.handleUnsupportedMessage)();
}
//# sourceMappingURL=messageRouter.js.map