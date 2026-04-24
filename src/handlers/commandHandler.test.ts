import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isCommand, handleCommand } from './commandHandler';

// Mock kvStore module
vi.mock('../storage/kvStore', () => ({
  isKvAvailable: vi.fn(() => false),
  getHistory: vi.fn(async () => []),
  formatHistoryReply: vi.fn(() => '暂无解析记录'),
}));

import { isKvAvailable, getHistory, formatHistoryReply } from '../storage/kvStore';

const mockIsKvAvailable = vi.mocked(isKvAvailable);
const mockGetHistory = vi.mocked(getHistory);
const mockFormatHistoryReply = vi.mocked(formatHistoryReply);

const TEST_OPEN_ID = 'test_open_id_123';

describe('isCommand', () => {
  it('识别帮助命令关键词', () => {
    expect(isCommand('帮助')).toBe(true);
    expect(isCommand('help')).toBe(true);
    expect(isCommand('使用说明')).toBe(true);
  });

  it('识别历史记录命令关键词', () => {
    expect(isCommand('历史')).toBe(true);
    expect(isCommand('历史记录')).toBe(true);
  });

  it('不区分大小写', () => {
    expect(isCommand('Help')).toBe(true);
    expect(isCommand('HELP')).toBe(true);
    expect(isCommand('hElP')).toBe(true);
  });

  it('去除前后空格后匹配', () => {
    expect(isCommand('  帮助  ')).toBe(true);
    expect(isCommand(' help ')).toBe(true);
    expect(isCommand('\t历史\n')).toBe(true);
  });

  it('非命令文本返回 false', () => {
    expect(isCommand('你好')).toBe(false);
    expect(isCommand('https://channels.weixin.qq.com/xxx')).toBe(false);
    expect(isCommand('')).toBe(false);
    expect(isCommand('帮助我')).toBe(false);
    expect(isCommand('查看历史')).toBe(false);
  });
});

describe('handleCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsKvAvailable.mockReturnValue(false);
  });

  it('帮助命令回复使用说明', async () => {
    const reply = await handleCommand('帮助', TEST_OPEN_ID);
    expect(reply).toContain('📖 使用说明');
    expect(reply).toContain('视频号链接提取助手');
    expect(reply).toContain('使用方法');
  });

  it('帮助回复包含免责声明', async () => {
    const reply = await handleCommand('help', TEST_OPEN_ID);
    expect(reply).toContain('免责声明');
    expect(reply).toContain('仅供个人学习使用');
    expect(reply).toContain('请尊重原创作者版权');
  });

  it('帮助回复包含使用步骤', async () => {
    const reply = await handleCommand('使用说明', TEST_OPEN_ID);
    expect(reply).toContain('在视频号看到喜欢的视频');
    expect(reply).toContain('点击分享，选择发送给我');
    expect(reply).toContain('我会自动提取视频链接回复给你');
  });

  it('帮助回复提到可以直接发送链接', async () => {
    const reply = await handleCommand('帮助', TEST_OPEN_ID);
    expect(reply).toContain('也可以直接发送包含视频号链接的文本给我');
  });

  it('历史命令 - KV 不可用时回复功能未开启', async () => {
    mockIsKvAvailable.mockReturnValue(false);
    expect(await handleCommand('历史', TEST_OPEN_ID)).toBe('历史记录功能未开启');
    expect(await handleCommand('历史记录', TEST_OPEN_ID)).toBe('历史记录功能未开启');
  });

  it('历史命令 - KV 可用时调用 getHistory 和 formatHistoryReply', async () => {
    mockIsKvAvailable.mockReturnValue(true);
    const fakeRecords = [
      { videoUrl: 'https://channels.weixin.qq.com/v1', title: '测试视频', createdAt: '2024-01-01T00:00:00Z' },
    ];
    mockGetHistory.mockResolvedValue(fakeRecords);
    mockFormatHistoryReply.mockReturnValue('📋 最近的解析记录：\n\n1. 测试视频\n   https://channels.weixin.qq.com/v1');

    const reply = await handleCommand('历史', TEST_OPEN_ID);

    expect(mockGetHistory).toHaveBeenCalledWith(TEST_OPEN_ID);
    expect(mockFormatHistoryReply).toHaveBeenCalledWith(fakeRecords);
    expect(reply).toContain('测试视频');
  });

  it('历史命令 - KV 可用但无记录时回复暂无记录', async () => {
    mockIsKvAvailable.mockReturnValue(true);
    mockGetHistory.mockResolvedValue([]);
    mockFormatHistoryReply.mockReturnValue('暂无解析记录');

    const reply = await handleCommand('历史记录', TEST_OPEN_ID);
    expect(reply).toBe('暂无解析记录');
  });

  it('命令不区分大小写', async () => {
    expect(await handleCommand('HELP', TEST_OPEN_ID)).toContain('使用说明');
    expect(await handleCommand('Help', TEST_OPEN_ID)).toContain('使用说明');
  });

  it('命令去除前后空格', async () => {
    mockIsKvAvailable.mockReturnValue(false);
    expect(await handleCommand('  帮助  ', TEST_OPEN_ID)).toContain('使用说明');
    expect(await handleCommand(' 历史 ', TEST_OPEN_ID)).toBe('历史记录功能未开启');
  });

  it('非命令文本返回空字符串', async () => {
    expect(await handleCommand('你好', TEST_OPEN_ID)).toBe('');
    expect(await handleCommand('', TEST_OPEN_ID)).toBe('');
  });
});
