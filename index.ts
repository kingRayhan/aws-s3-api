import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import stream from "stream";

import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { s3Client } from "./utils/s3";
const app = express();

dotenv.config({
  path: ".env",
});

// const storage = multer.diskStorage({ destination: __dirname + "/uploads" });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.json({
    message: "App is running",
  });
});

app.post("/", upload.single("file"), async (req, res) => {
  try {
    const command = new PutObjectCommand({
      Body: req?.file?.buffer,
      Key: req.file?.originalname,
      Bucket: "kingrayhan-private",
    });

    const s3 = await s3Client.send(command);
    return res.json({
      s3,
    });
  } catch (error: any) {
    return res.status(403).json({
      message: error?.message,
    });
  }
});

app.get("/file/sign/:key", upload.single("file"), async (req, res) => {
  // Reference: https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  try {
    const signed = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "kingrayhan-private",
        Key: req.params.key,
      }),
      { expiresIn: 10 }
    );

    return res.json({
      url: signed,
    });
  } catch (error: any) {
    return res.status(403).json({
      message: error?.message,
    });
  }
});

app.get("/file/:key", upload.single("file"), async (req, res) => {
  try {
    const response = new GetObjectCommand({
      Bucket: "kingrayhan-private",
      Key: req.params.key,
    });
    const command = await s3Client.send(response);
  } catch (error: any) {
    return res.status(403).json({
      message: error?.message,
    });
  }
});

app.listen(3000, () => {
  console.log("App Is running: localhost:3000");
});
