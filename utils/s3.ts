import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_ACCESS_SECRET as string,
  },
  region: "ap-southeast-1",
});
