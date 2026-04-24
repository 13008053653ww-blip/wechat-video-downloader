/**
 * 命令处理器
 * 处理用户发送的关键词命令（帮助、历史记录等）
 */
/**
 * 判断文本是否为命令关键词
 * 去除前后空格后，不区分大小写匹配
 */
export declare function isCommand(text: string): boolean;
/**
 * 处理命令，返回回复文本
 * - "帮助"/"help"/"使用说明" → 回复使用说明和免责声明
 * - "历史"/"历史记录" → 查询 KV 并格式化回复，KV 不可用时回复"历史记录功能未开启"
 */
export declare function handleCommand(text: string, openId: string): Promise<string>;
//# sourceMappingURL=commandHandler.d.ts.map