import { describe, it, expect } from 'vitest';
import { parseXml, buildTextReply } from './xmlParser';

describe('parseXml', () => {
  it('should parse a standard WeChat text message', () => {
    const xml = `<xml>
      <ToUserName><![CDATA[gh_test123]]></ToUserName>
      <FromUserName><![CDATA[oUser123]]></FromUserName>
      <CreateTime>1348831860</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[hello world]]></Content>
      <MsgId>1234567890123456</MsgId>
    </xml>`;

    const msg = parseXml(xml);
    expect(msg.ToUserName).toBe('gh_test123');
    expect(msg.FromUserName).toBe('oUser123');
    expect(msg.CreateTime).toBe(1348831860);
    expect(msg.MsgType).toBe('text');
    expect(msg.Content).toBe('hello world');
    expect(msg.MsgId).toBe('1234567890123456');
  });

  it('should parse a subscribe event message', () => {
    const xml = `<xml>
      <ToUserName><![CDATA[gh_test123]]></ToUserName>
      <FromUserName><![CDATA[oUser123]]></FromUserName>
      <CreateTime>1348831860</CreateTime>
      <MsgType><![CDATA[event]]></MsgType>
      <Event><![CDATA[subscribe]]></Event>
    </xml>`;

    const msg = parseXml(xml);
    expect(msg.MsgType).toBe('event');
    expect(msg.Event).toBe('subscribe');
    expect(msg.Content).toBeUndefined();
  });

  it('should handle CDATA content correctly', () => {
    const xml = `<xml>
      <ToUserName><![CDATA[gh_abc]]></ToUserName>
      <FromUserName><![CDATA[oXYZ]]></FromUserName>
      <CreateTime>1700000000</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[https://channels.weixin.qq.com/some/path]]></Content>
      <MsgId>9999</MsgId>
    </xml>`;

    const msg = parseXml(xml);
    expect(msg.Content).toBe('https://channels.weixin.qq.com/some/path');
  });
});

describe('buildTextReply', () => {
  it('should build a valid WeChat XML reply', () => {
    const xml = buildTextReply('gh_from', 'oUser_to', '你好');

    expect(xml).toContain('<ToUserName><![CDATA[oUser_to]]></ToUserName>');
    expect(xml).toContain('<FromUserName><![CDATA[gh_from]]></FromUserName>');
    expect(xml).toContain('<MsgType><![CDATA[text]]></MsgType>');
    expect(xml).toContain('<Content><![CDATA[你好]]></Content>');
    expect(xml).toContain('<CreateTime>');
  });

  it('should produce XML that can be parsed back', () => {
    const from = 'gh_official';
    const to = 'oUserOpenID';
    const content = '视频链接：https://example.com/video';

    const xml = buildTextReply(from, to, content);
    const msg = parseXml(xml);

    expect(msg.ToUserName).toBe(to);
    expect(msg.FromUserName).toBe(from);
    expect(msg.MsgType).toBe('text');
    expect(msg.Content).toBe(content);
  });
});
