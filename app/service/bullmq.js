/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2025-06-02 22:35:19
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2025-06-10 22:33:44
 * @FilePath: \Mini_program_backend\app\service\bullmq.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// app/service/bullmq.js
const { Service } = require("egg");
const { Queue, Worker } = require("bullmq");

class BullMQService extends Service {
  constructor(ctx) {
    super(ctx);
    this.init();
  }

  init() {
    const { app } = this;

    // 防止重复初始化
    if (app.bullmq) return;

    // 创建 Redis 连接配置
    // const connection = {
    //   host: "127.0.0.1",
    //   port: 6379,
    //   password: "",
    //   db: 0,
    // };

    // 修改后（使用配置中心数据）
    const connection = {
      host: app.config.redis.clients.default.host,
      port: app.config.redis.clients.default.port,
      password: app.config.redis.clients.default.password || "",
      db: app.config.redis.clients.default.db || 0,
      retryStrategy: times => Math.min(times * 100, 3000),
    };

    // 创建队列
    app.bullmq = {
      queues: {},
      workers: {},
      connection,
    };
  }

  // 获取或创建队列
  getQueue(queueName) {
    const { app } = this;

    if (!app.bullmq.queues[queueName]) {
      app.bullmq.queues[queueName] = new Queue(queueName, {
        connection: app.bullmq.connection,
      });
    }

    return app.bullmq.queues[queueName];
  }

  // 添加延迟任务
  async addDelayJob(queueName, jobName, data, delaySeconds) {
    const queue = this.getQueue(queueName);

    return queue.add(jobName, data, {
      delay: delaySeconds * 1000, // 转换为毫秒
      attempts: 3, // 增加重试次数
      backoff: {
        // 增加退避策略
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: 5,
    });
  }

  // 创建工作处理器
  createWorker(queueName, processor) {
    const { app } = this;

    if (app.bullmq.workers[queueName]) {
      return app.bullmq.workers[queueName];
    }

    const worker = new Worker(queueName, processor, {
      connection: app.bullmq.connection,
      concurrency: 5,
      limiter: {
        // 增加限流
        max: 100,
        duration: 1000,
      },
    });

    worker.on("failed", (job, err) => {
      app.logger.error(`Job ${job.id} failed:`, err);
    });

    worker.on("completed", job => {
      this.app.logger.info(`任务完成: ${job.name} (${job.id})`);
      this.app.metrics.increment("jobs.completed");
    });

    app.bullmq.workers[queueName] = worker;
    return worker;
  }
}

module.exports = BullMQService;
