import { S3Client } from "@aws-sdk/client-s3";
import { config } from "@/lib/constants";

/**
 * S3クライアントを生成し返す。シングルトンとか知らん。
 * 
 * @returns S3Client
 */
export function generateS3Client() {
  return new S3Client({
    region:   config.s3.region!,
    endpoint: config.s3.endpoint!,
    credentials: {
      accessKeyId:     config.s3.credentials.accessKeyId!,
      secretAccessKey: config.s3.credentials.secretAccessKey!,
    },
  });
}
