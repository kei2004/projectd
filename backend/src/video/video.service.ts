// src/video/video.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid'; // ファイル名重複防止用

@Injectable()
export class VideoService {
  private s3Client: S3Client;
  private bucketName = process.env.R2_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  // アップロード用の署名付きURLを発行する
  async generatePresignedUrl(fileName: string, fileType: string) {
    // ファイル名が被らないようにUUIDを先頭につける
    const uniqueFileName = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // 署名付きURLを発行（有効期限: 60秒）
    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });

    return {
      uploadUrl,       // フロントエンドがここにPUTする
      key: uniqueFileName, // 後でDBに保存するファイル名
    };
  }
}