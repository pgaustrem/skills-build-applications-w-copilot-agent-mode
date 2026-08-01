import crypto from 'node:crypto';
const JWT_SECRET = process.env.JWT_SECRET || 'octofit-dev-secret';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 365 * 10;
function toBase64Url(value) {
    return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromBase64Url(value) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, 'base64').toString('utf8');
}
export function signToken(payload) {
    const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = toBase64Url(JSON.stringify(payload));
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
    return `${header}.${body}.${signature}`;
}
export function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }
    const [header, body, signature] = parts;
    const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) === false) {
        return null;
    }
    try {
        const payload = JSON.parse(fromBase64Url(body));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload;
    }
    catch {
        return null;
    }
}
export function createTokenForUser(user) {
    return signToken({
        sub: String(user._id),
        email: user.email,
        provider: 'oauth2',
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    });
}
