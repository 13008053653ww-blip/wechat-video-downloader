import { describe, it, expect } from 'vitest';
import { isVideoChannelUrl, extractVideoUrl, parseVideoLink } from './linkParser';

describe('isVideoChannelUrl', () => {
  it('应识别标准 channels.weixin.qq.com 链接', () => {
    expect(isVideoChannelUrl('https://channels.weixin.qq.com/web/pages/feed/abcdef123')).toBe(true);
  });

  it('应识别包含 finder 关键词的微信域名链接', () => {
    expect(isVideoChannelUrl('https://weixin.qq.com/sph/finder?id=abc123')).toBe(true);
  });

  it('应拒绝非视频号链接', () => {
    expect(isVideoChannelUrl('https://www.baidu.com')).toBe(false);
    expect(isVideoChannelUrl('https://mp.weixin.qq.com/s/article123')).toBe(false);
  });

  it('应拒绝空字符串', () => {
    expect(isVideoChannelUrl('')).toBe(false);
  });
});

describe('extractVideoUrl', () => {
  it('应从纯链接文本中提取视频号链接', () => {
    const url = 'https://channels.weixin.qq.com/web/pages/feed/abcdef123';
    expect(extractVideoUrl(url)).toBe(url);
  });

  it('应从长文本中提取视频号链接', () => {
    const text = '我发现了一个好视频，快来看看 https://channels.weixin.qq.com/web/pages/feed/abc 真的很不错';
    expect(extractVideoUrl(text)).toBe('https://channels.weixin.qq.com/web/pages/feed/abc');
  });

  it('多链接场景应返回第一个视频号链接', () => {
    const text = '看看这个 https://www.baidu.com 还有这个 https://channels.weixin.qq.com/video/aaa 和 https://channels.weixin.qq.com/video/bbb';
    expect(extractVideoUrl(text)).toBe('https://channels.weixin.qq.com/video/aaa');
  });

  it('无视频号链接时返回 null', () => {
    expect(extractVideoUrl('这是一段普通文本，没有链接')).toBeNull();
    expect(extractVideoUrl('https://www.google.com 只有普通链接')).toBeNull();
  });

  it('空文本返回 null', () => {
    expect(extractVideoUrl('')).toBeNull();
  });
});

describe('parseVideoLink', () => {
  it('空输入返回错误提示', () => {
    const result = parseVideoLink('');
    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('请把视频号的视频分享给我');
  });

  it('纯空白输入返回错误提示', () => {
    const result = parseVideoLink('   \n\t  ');
    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('请把视频号的视频分享给我');
  });

  it('包含视频号链接时返回成功', () => {
    const result = parseVideoLink('https://channels.weixin.qq.com/web/pages/feed/abc123');
    expect(result.success).toBe(true);
    expect(result.videoUrl).toBe('https://channels.weixin.qq.com/web/pages/feed/abc123');
  });

  it('不包含视频号链接时返回未识别提示', () => {
    const result = parseVideoLink('这是一段普通文本');
    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('未识别到视频号链接');
  });

  it('从分享文本中提取链接', () => {
    const shareText = '我在视频号发现了一个好视频，推荐给你 https://channels.weixin.qq.com/web/pages/feed/xyz789 快来看看吧！';
    const result = parseVideoLink(shareText);
    expect(result.success).toBe(true);
    expect(result.videoUrl).toBe('https://channels.weixin.qq.com/web/pages/feed/xyz789');
  });
});
