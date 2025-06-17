/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-02-02 19:15:52
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-17 10:47:03
 * @FilePath: \Mini_program_backend\app\service\cos.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// app/service/cos.js
const Service = require("egg").Service;
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class CosService extends Service {
  constructor(ctx) {
    super(ctx);
    const { SecretId, SecretKey, Bucket, Region } = this.config.cos;
    this.cos = new COS({
      SecretId,
      SecretKey,
    });
    this.Bucket = Bucket;
    this.Region = Region;
  }

  /**
   * 分块上传方法
   * @param {Buffer} fileBuffer 文件的 Buffer 数据
   * @param {String} key 文件在 COS 中的存储路径
   * @param {Number} partSize 每个分块的大小（默认 5MB）
   * @returns {Promise<String>} 返回上传完成后的文件 URL
   */
  async multipartUpload(fileBuffer, key, partSize = 5 * 1024 * 1024) {
    // 添加验证，确保 fileBuffer 是有效的 Buffer
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid fileBuffer: expects a Buffer instance");
    }

    const totalSize = fileBuffer.length;
    const parts = Math.ceil(totalSize / partSize); // 计算分块数量
    const uploadId = await this.initMultipartUpload(key); // 初始化分块上传
    const promises = [];

    for (let i = 0; i < parts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, totalSize);
      const chunk = fileBuffer.slice(start, end);

      promises.push(this.uploadPart(key, uploadId, i + 1, chunk));
    }

    const etags = await Promise.all(promises); // 等待所有分块上传完成
    const partsInfo = etags
      .map((etag, index) => ({
        ETag: etag,
        PartNumber: index + 1,
      }))
      .sort((a, b) => a.PartNumber - b.PartNumber);

    // 打印调试信息
    console.log("PartsInfo:", partsInfo);

    if (!Array.isArray(partsInfo) || partsInfo.length === 0) {
      throw new Error("No parts uploaded. Aborting multipart upload.");
    }

    return await this.completeMultipartUpload(key, uploadId, partsInfo);
  }

  /**
   * 初始化分块上传
   * @param {String} key 文件在 COS 中的存储路径
   * @returns {Promise<String>} 返回 UploadId
   */
  async initMultipartUpload(key) {
    return new Promise((resolve, reject) => {
      this.cos.multipartInit(
        {
          Bucket: this.Bucket,
          Region: this.Region, // 添加 Region 参数
          Key: key,
        },
        (err, data) => {
          if (err) {
            reject(new Error(`初始化分块上传失败: ${err.message}`));
          } else {
            resolve(data.UploadId);
          }
        }
      );
    });
  }

  /**
   * 上传分块
   * @param {String} key 文件在 COS 中的存储路径
   * @param {String} uploadId 初始化分块上传时返回的 UploadId
   * @param {Number} partNumber 分块序号
   * @param {Buffer} chunk 分块内容
   * @returns {Promise<String>} 返回分块的 ETag
   */
  async uploadPart(key, uploadId, partNumber, chunk) {
    return new Promise((resolve, reject) => {
      this.cos.multipartUpload(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: chunk,
        },
        (err, data) => {
          if (err) {
            reject(new Error(`分块上传失败: ${err.message}`));
          } else {
            resolve(data.ETag);
          }
        }
      );
    });
  }

  /**
   * 完成分块上传
   * @param {String} key 文件在 COS 中的存储路径
   * @param {String} uploadId 初始化分块上传时返回的 UploadId
   * @param {Array} partsInfo 分块信息数组，包含 ETag 和 PartNumber
   * @returns {Promise<String>} 返回上传完成后的文件 URL
   */
  async completeMultipartUpload(key, uploadId, partsInfo) {
    // 修改后（正确示例）
    const formattedParts = partsInfo.map(part => ({
      PartNumber: part.PartNumber, // 注意大小写！
      ETag: part.ETag, // 添加双引号
    }));

    return new Promise((resolve, reject) => {
      this.cos.multipartComplete(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Key: key,
          UploadId: uploadId,
          Parts: formattedParts, // 使用修正后的数组
        },
        (err, data) => {
          if (err) {
            console.error("Complete multipart upload error details:", {
              Bucket: this.Bucket,
              Region: this.Region,
              Key: key,
              UploadId: uploadId,
              Parts: formattedParts,
            });
            reject(new Error(`完成分块上传失败: ${err.message}`));
          } else {
            const video = `https://${data.Location}`;
            resolve(video);
          }
        }
      );
    });
  }

  // 获取 COS 中的文件内容
  async getFileContent(key) {
    return new Promise((resolve, reject) => {
      this.cos.getObject(
        {
          Bucket: this.Bucket,
          Key: key,
        },
        (err, data) => {
          if (err) {
            reject(new Error(`下载文件失败: ${err.message}`));
          } else {
            // COS 返回的文件 URL
            resolve(data.Body);
          }
        }
      );
    });
  }

  // 获取 COS 中的文件下载 URL
  async getDownloadUrl(key) {
    try {
      const data = this.cos.getObjectUrl({
        Bucket: this.Bucket,
        Key: key,
      });
      return data.Url; // 返回下载 URL
    } catch (err) {
      this.ctx.logger.error("Failed to get download URL from COS:", err);
      throw err;
    }
  }

  /**
   * 上传文件到 COS
   * @param {Buffer} fileBuffer 文件的 buffer 数据
   * @param {String} fileName 文件名（包括路径）
   * @param {String} bucket COS 存储桶名
   * @param {String} region COS 存储区域
   * @param {String} contentType 文件类型
   * @returns {Promise<String>} 返回上传文件的 URL
   */
  async uploadFile(fileBuffer, fileName, bucket, region) {
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: bucket || this.Bucket, // 存储桶名称
          Region: region || this.Region, // 存储区域
          Key: fileName, // 文件名
          Body: fileBuffer, // 文件内容
          // ContentType: contentType, // 文件类型
        },
        (err, data) => {
          if (err) {
            reject(new Error(`上传文件失败: ${err.message}`));
          } else {
            // COS 返回的文件 URL
            const imageUrl = `https://${data.Location}`;
            resolve(imageUrl);
          }
        }
      );
    });
  }

  async getBufferMD5(buffer) {
    return crypto.createHash("md5").update(buffer).digest("hex");
  }

  /**
   * 批量上传多张图片
   * @param {Array} files 图片文件数组（Buffer 或文件路径）
   * @param {String} prefix 存储路径前缀
   * @returns {Promise<Array>} 返回所有上传后的图片 URL 数组
   */
  async uploadMultipleFiles(files, prefix, bucket, region) {
    const uploadPromises = files.map((file, index) => {
      const fileBuffer = fs.readFileSync(file); // 如果文件是路径，读取文件内容
      const key = `${prefix}/${path.basename(file)}`; // 构造存储路径
      return this.uploadFile(fileBuffer, key, bucket, region);
    });

    return Promise.all(uploadPromises);
  }

  // 计算文件的 MD5 值
  async getFileMD5(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("md5");
      const stream = fs.createReadStream(filePath);

      stream.on("data", chunk => {
        hash.update(chunk);
      });

      stream.on("end", () => {
        const md5 = hash.digest("hex");
        resolve(md5);
      });

      stream.on("error", err => {
        reject(err);
      });
    });
  }

  // 检查文件是否已经存在
  async fileExists(md5) {
    const { Avatar } = this.ctx.model;
    const existingFile = await Avatar.getAvatarByMD5({ md5 });
    return existingFile;
  }

  // 上传头像到 COS
  async uploadAvatar(avatarMD5, filePath) {
    const { Avatar } = this.ctx.model;
    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        throw new Error("文件路径无效，文件不存在");
      }
      const fileName = path.basename(filePath); // 获取文件名

      // 检查文件是否已经存在
      const existingFile = await this.fileExists(avatarMD5);
      if (existingFile) {
        // 如果文件已存在，直接返回永久 URL
        return {
          avatarMD5: existingFile.md5,
          avatarUrl: existingFile.avatarUrl,
        };
      }

      const md5 = await this.getFileMD5(filePath); // 获取文件的 MD5 值
      console.log("md5:", md5);

      const key = `WXavatar/${md5}-${fileName}`; // COS 文件存储路径，防止重名

      return new Promise((resolve, reject) => {
        this.cos.putObject(
          {
            Bucket: this.Bucket,
            Region: this.Region,
            Key: key,
            Body: fs.createReadStream(filePath),
          },
          async (err, data) => {
            if (err) {
              console.error("上传到 COS 失败:", err);
              reject(new Error("上传到 COS 失败，请稍后重试"));
              return;
            }

            try {
              const avatarUrl = `https://${this.Bucket}.cos.${this.Region}.myqcloud.com/${key}`;

              // 存储文件信息到数据库
              await Avatar.saveNew({ md5, avatarUrl });

              resolve({ avatarMD5: md5, avatarUrl });
            } catch (dbError) {
              console.error("数据库存储失败:", dbError);
              reject(new Error("上传成功，但保存信息失败，请联系管理员"));
            }
          }
        );
      });
    } catch (error) {
      console.error("uploadAvatar 处理文件时出错:", error);
      throw new Error("上传头像时发生错误：" + error.message);
    }
  }
}

module.exports = CosService;
