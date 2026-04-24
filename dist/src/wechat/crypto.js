"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = verifySignature;
const crypto_1 = require("crypto");
/**
 * 验证微信公众号消息签名
 *
 * 将 token、timestamp、nonce 按字典序排序后拼接，做 SHA1 加密，
 * 与微信传来的 signature 比较，一致则验证通过。
 */
function verifySignature(params) {
    const { signature, timestamp, nonce, token } = params;
    const str = [token, timestamp, nonce].sort().join('');
    const hash = (0, crypto_1.createHash)('sha1').update(str).digest('hex');
    return hash === signature;
}
//# sourceMappingURL=crypto.js.map