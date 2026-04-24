/**
 * Vercel KV 存储封装
 * 使用 fetch 直接调用 Vercel KV REST API，不依赖 @vercel/kv 包
 * KV 未配置时所有操作静默降级
 */
import type { HistoryRecord } from '../types/index';
/**
 * 检查 KV 环境变量是否配置
 * 两个环境变量都配置了才返回 true
 */
export declare function isKvAvailable(): boolean;
/**
 * 添加历史记录到 KV 存储
 * - key 格式: history:{openId}
 * - 新记录插入到数组头部
 * - 超过 50 条时删除最早的（数组末尾的）
 * - KV 不可用时静默返回
 */
export declare function addHistory(openId: string, record: HistoryRecord): Promise<void>;
/**
 * 查询用户历史记录，默认返回最近 5 条
 * KV 不可用时返回空数组
 */
export declare function getHistory(openId: string, limit?: number): Promise<HistoryRecord[]>;
/**
 * 格式化历史记录为回复文本
 * - 每条记录显示序号、标题（如有）和链接
 * - 空记录返回"暂无解析记录"
 */
export declare function formatHistoryReply(records: HistoryRecord[]): string;
//# sourceMappingURL=kvStore.d.ts.map