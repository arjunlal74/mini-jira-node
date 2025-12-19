import { Queue, JobsOptions } from "bullmq";
import { redisConnection } from "../queues/connection";
import queueNames from "../enums/queueNames";

export abstract class BaseJob<T> {
  static queue = queueNames.DEFAULT;

  static getQueue(queueName: string) {
    return new Queue(queueName, {
      connection: redisConnection,
    });
  }

  static async dispatch<T>(
    this: { queue: string; name: string },
    data: T,
    options?: JobsOptions
  ) {
    const queue = this.getQueue(this.queue);
    return queue.add(this.name, data, options);
  }

  static async dispatchMisc<T>(
    this: { name: string },
    data: T,
    options?: JobsOptions
  ) {
    const queue = this.getQueue(queueNames.MISC);
    return queue.add(this.name, data, options);
  }
}
