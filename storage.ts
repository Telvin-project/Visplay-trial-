import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
let client: S3Client | null = null;
export function s3Client() {
  if (!process.env.S3_ENDPOINT || !process.env.S3_BUCKET || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) throw new Error('Object storage is not configured.');
  if (!client) client = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'auto', forcePathStyle: true, credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } });
  return client;
}
export async function signedReadUrl(key: string, expiresIn = 300) {
  return getSignedUrl(s3Client(), new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }), { expiresIn });
}
