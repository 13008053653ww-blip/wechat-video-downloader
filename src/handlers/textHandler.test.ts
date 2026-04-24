import { describe, it, expect, vi } from 'vitest';
import {
  handleTextMessage,
  handleUnsupportedMessage,
  formatParseResult,
} from './textHandler';
import type { ParseResult } from '../types/index';

// mock addHistory，避免测试中真正调用 KV
vi.mock('../storage/kvStore', () => ({
  addHistory: vi.fn().mockResolvedValue(undefined),
}));

describe('handleTextMessage', () => {
  const openId = 'test_open_id';

  it('包含视频号链接时返回格式化的视频链接回复', async () => {
    const reply = await handleTextMessage(
      '看看这个视频 https://channels.weixin.qq.com/abc123',
      openId,
    );
    expect(reply).toContain('视频链接提取成功');
    expect(reply).toContain('https://channels.weixin.qq.com/abc123');
  });

  it('不包含链接时返回未识别提示', async () => {
    const reply = await handleTextMessage('你好', openId);
    expect(reply).toContain('未识别到视频号链接');
  });

  it('空文本返回使用说明', async () => {
    const reply = await handleTextMessage('', openId);
    expect(reply).toContain('请把视频号的视频分享给我');
  });

  it('包含非视频号链接时返回未识别提示', async () => {
    const reply = await handleTextMessage('https://www.baidu.com', openId);
    expect(reply).toContain('未识别到视频号链接');
  });

  it('解析成功时调用 addHistory 保存记录', async () => {
    const { addHistory } = await import('../storage/kvStore');
    vi.mocked(addHistory).mockClear();

    await handleTextMessage(
      'https://channels.weixin.qq.com/video123',
      openId,
    );

    expect(addHistory).toHaveBeenCalledOnce();
    expect(addHistory).toHaveBeenCalledWith(
      openId,
      expect.objectContaining({
        videoUrl: 'https://channels.weixin.qq.com/video123',
        createdAt: expect.any(String),
      }),
    );
  });

  it('addHistory 失败时不影响回复', async () => {
    const { addHistory } = await import('../storage/kvStore');
    vi.mocked(addHistory).mockRejectedValueOnce(new Error('KV error'));

    const reply = await handleTextMessage(
      'https://channels.weixin.qq.com/video456',
      openId,
    );

    expect(reply).toContain('视频链接提取成功');
  });
});

describe('handleUnsupportedMessage', () => {
  it('返回暂时只支持文本消息的提示', () => {
    const reply = handleUnsupportedMessage();
    expect(reply).toContain('暂时只支持文本消息');
  });
});

describe('formatParseResult', () => {
  it('成功结果包含视频链接', () => {
    const result: ParseResult = {
      success: true,
      videoUrl: 'https://channels.weixin.qq.com/video/xyz',
    };
    const reply = formatParseResult(result);
    expect(reply).toContain('https://channels.weixin.qq.com/video/xyz');
    expect(reply).toContain('视频链接提取成功');
    expect(reply).toContain('链接可能有时效性');
  });
});
