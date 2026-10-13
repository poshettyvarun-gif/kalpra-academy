import 'server-only';
import { resolve } from 'node:path';

export const allowedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
]);

export function getUploadRoot() {
  return resolve(process.cwd(), process.env.UPLOAD_DIR || 'var/uploads');
}
