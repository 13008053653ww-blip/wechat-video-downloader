/**
 * 微信消息类型
 * 微信服务器推送的 XML 消息解析后的结构
 */
export interface WechatMessage {
    /** 公众号的微信号 */
    ToUserName: string;
    /** 发送者的 OpenID */
    FromUserName: string;
    /** 消息创建时间戳 */
    CreateTime: number;
    /** 消息类型：text, image, voice, video, event 等 */
    MsgType: 'text' | 'image' | 'voice' | 'video' | 'event';
    /** 文本消息内容 */
    Content?: string;
    /** 事件类型：subscribe, unsubscribe */
    Event?: string;
    /** 事件 Key */
    EventKey?: string;
    /** 消息 ID */
    MsgId?: string;
}
/**
 * 链接解析结果
 */
export interface ParseResult {
    /** 是否解析成功 */
    success: boolean;
    /** 提取到的视频页面链接 */
    videoUrl?: string;
    /** 视频标题（如能获取） */
    title?: string;
    /** 错误提示 */
    errorMessage?: string;
}
/**
 * 历史记录（Vercel KV 存储）
 */
export interface HistoryRecord {
    /** 视频链接 */
    videoUrl: string;
    /** 视频标题 */
    title?: string;
    /** 创建时间，ISO 8601 格式 */
    createdAt: string;
}
/**
 * 环境变量配置
 */
export interface EnvConfig {
    /** 公众号 Token（必填） */
    WECHAT_TOKEN: string;
    /** Vercel KV URL（可选） */
    KV_REST_API_URL?: string;
    /** Vercel KV Token（可选） */
    KV_REST_API_TOKEN?: string;
}
//# sourceMappingURL=index.d.ts.map