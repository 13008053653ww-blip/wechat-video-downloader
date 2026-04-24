import { describe, it, expect } from 'vitest';
import { handleEvent } from './eventHandler';

describe('handleEvent', () => {
  it('subscribe 事件返回欢迎语', () => {
    const reply = handleEvent('subscribe');
    expect(reply).toContain('欢迎关注');
    expect(reply).toContain('视频号链接提取助手');
    expect(reply).toContain('发送"帮助"查看更多信息');
  });

  it('subscribe 欢迎语包含使用步骤', () => {
    const reply = handleEvent('subscribe');
    expect(reply).toContain('在视频号看到喜欢的视频');
    expect(reply).toContain('点击分享，选择发送给我');
    expect(reply).toContain('我会自动提取视频链接回复给你');
  });

  it('unsubscribe 事件返回空字符串', () => {
    const reply = handleEvent('unsubscribe');
    expect(reply).toBe('');
  });

  it('其他事件返回空字符串', () => {
    expect(handleEvent('CLICK')).toBe('');
    expect(handleEvent('VIEW')).toBe('');
    expect(handleEvent('LOCATION')).toBe('');
  });
});
