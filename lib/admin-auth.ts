export const adminCookieName = 'kalpra_admin';
const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

function hexToBytes(hex: string) {
  if (!/^[a-f0-9]+$/i.test(hex) || hex.length % 2) return new Uint8Array();
  return Uint8Array.from(hex.match(/.{2}/g) || [], (byte) =>
    Number.parseInt(byte, 16),
  );
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUsername || !passwordHash) return false;
  const [scheme, iterationsRaw, saltHex, expectedHex] =
    passwordHash.split(':');
  const iterations = Number(iterationsRaw);
  if (scheme !== 'pbkdf2' || !iterations || !saltHex || !expectedHex) {
    return false;
  }
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derived = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: hexToBytes(saltHex),
        iterations,
      },
      key,
      256,
    ),
  );
  return (
    username === adminUsername &&
    constantTimeEqual(derived, hexToBytes(expectedHex))
  );
}

async function sign(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Admin session secret is unavailable.');
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return bytesToHex(
    new Uint8Array(
      await crypto.subtle.sign('HMAC', key, encoder.encode(payload)),
    ),
  );
}

export async function createAdminToken(username: string) {
  const payload = `${username}.${Date.now() + 8 * 60 * 60 * 1000}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const pieces = token.split('.');
  if (pieces.length !== 3) return false;
  const [username, expiresRaw, signature] = pieces;
  const expires = Number(expiresRaw);
  const expected = await sign(`${username}.${expiresRaw}`);
  return (
    username === process.env.ADMIN_USERNAME &&
    expires > Date.now() &&
    constantTimeEqual(hexToBytes(signature), hexToBytes(expected))
  );
}

export function readCookie(request: Request, name: string) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export async function isAdminRequest(request: Request) {
  try {
    return await verifyAdminToken(readCookie(request, adminCookieName));
  } catch {
    return false;
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}
