// Upload one photo from the admin straight to Cloudinary (signed by our API), then register it.
// Large photos are resized in the browser first: Cloudinary's Free plan accepts at most 10 MB / 25 MP,
// and the website never needs more than 3000 px on the long edge.
import { media } from '../services/adminApi';

export const MAX_EDGE = 3000;
const MAX_BYTES = 10 * 1024 * 1024;
const RESIZE_ABOVE_BYTES = 9.5 * 1024 * 1024;
const MAX_PIXELS = 25_000_000;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];

export class UploadError extends Error {}

const toBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new UploadError('Could not resize this image'))), type, quality));

// Returns {file, resized, width, height}
export const prepareImage = async (file) => {
  const heic = /\.hei[cf]$/i.test(file.name);
  if (!ACCEPTED.includes(file.type) && !heic) {
    throw new UploadError('Only JPG, PNG, WebP, AVIF or HEIC images can be uploaded');
  }
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // This browser can't decode it (e.g. HEIC outside Safari): send as-is if Cloudinary will accept it
    if (file.size <= MAX_BYTES) return { file, resized: false };
    throw new UploadError('This photo is larger than 10 MB and can’t be resized here. Please export it as JPEG and try again.');
  }
  const { width, height } = bitmap;
  const longEdge = Math.max(width, height);
  const needsResize = longEdge > MAX_EDGE || file.size > RESIZE_ABOVE_BYTES || width * height > MAX_PIXELS;
  if (!needsResize) {
    bitmap.close?.();
    return { file, resized: false, width, height };
  }
  const scale = Math.min(1, MAX_EDGE / longEdge);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  let blob = await toBlob(canvas, 'image/jpeg', 0.9);
  if (blob.size > MAX_BYTES) blob = await toBlob(canvas, 'image/jpeg', 0.8);
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return { file: new File([blob], name, { type: 'image/jpeg' }), resized: true, width: canvas.width, height: canvas.height };
};

const postWithProgress = (url, form, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let body = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON error page
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body);
      else reject(new UploadError(body?.error?.message || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new UploadError('Network error while uploading. Check your connection and retry.'));
    xhr.send(form);
  });

// Full flow for one file. onProgress(0..1); onStage('preparing' | 'uploading' | 'saving')
export const uploadImage = async (original, { folder = 'misc', altText, onProgress, onStage } = {}) => {
  onStage?.('preparing');
  const { file, resized } = await prepareImage(original);
  const signed = await media.sign(folder);
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', signed.timestamp);
  form.append('signature', signed.signature);
  form.append('folder', signed.folder);
  form.append('upload_preset', signed.uploadPreset);
  onStage?.('uploading');
  const result = await postWithProgress(signed.uploadUrl, form, onProgress);
  onStage?.('saving');
  const record = await media.registerCloudinary({
    publicId: result.public_id,
    version: result.version,
    signature: result.signature,
    originalFilename: original.name,
    altText,
  });
  return { record, resized };
};
