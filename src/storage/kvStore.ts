/**
 * Vercel KV 存储封装
 * 使用 fetch 直接调用 Vercel KV REST API，不依赖 @vercel/kv 包
 * KV 未配置时所有操作静默降级
 */

import type { HistoryRecord } from '../types/index';

/** 每个用户最多保存的历史记录条数 */
const MAX_HISTORY = 50;

/** 默认查询条数 */
const DEFAULT_LIMIT = 5;

/**
 * 检查 KV 环境变量是否配置
 * 两个环境变量都配置了才返回 true
 */
export function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * 从 KV 获取指定 key 的值
 */
async function kvGet<T>(key: string): Promise<T | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return (data.result ?? null) as T | null;
}

/**
 * 向 KV 设置指定 key 的值
 */
async function kvSet<T>(key: string, value: T): Promise<void> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
}


/**
 * 添加历史记录到 KV 存储
 * - key 格式: history:{openId}
 * - 新记录插入到数组头部
 * - 超过 50 条时删除最早的（数组末尾的）
 * - KV 不可用时静默返回
 */
export async function addHistory(
  openId: string,
  record: HistoryRecord,
): Promise<void> {
  if (!isKvAvailable()) return;

  try {
    const key = `history:${openId}`;
    const existing = await kvGet<HistoryRecord[]>(key);
    const records = existing ?? [];

    // 新记录插入头部
    records.unshift(record);

    // 超过上限时截断
    if (records.length > MAX_HISTORY) {
      records.length = MAX_HISTORY;
    }

    await kvSet(key, records);
  } catch {
    // KV 操作失败时静默降级
  }
}

/**
 * 查询用户历史记录，默认返回最近 5 条
 * KV 不可用时返回空数组
 */
export async function getHistory(
  openId: string,
  limit: number = DEFAULT_LIMIT,
): Promise<HistoryRecord[]> {
  if (!isKvAvailable()) return [];

  try {
    const key = `history:${openId}`;
    const records = await kvGet<HistoryRecord[]>(key);
    if (!records) return [];
    return records.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * 格式化历史记录为回复文本
 * - 每条记录显示序号、标题（如有）和链接
 * - 空记录返回"暂无解析记录"
 */
export function formatHistoryReply(records: HistoryRecord[]): string {
  if (!records || records.length === 0) {
    return '暂无解析记录';
  }

  const lines = records.map((r, i) => {
    const num = `${i + 1}.`;
    if (r.title) {
      return `${num} ${r.title}\n   ${r.videoUrl}`;
    }
    return `${num} ${r.videoUrl}`;
  });

  return `📋 最近的解析记录：\n\n${lines.join('\n\n')}`;
}
