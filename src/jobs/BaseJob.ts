import { Queue, JobsOptions } from "bullmq";
import { redisConnection } from "../queues/connection";
import queueNames from "../enums/queueNames";

// Interface for job class static properties
export interface JobClassStatic<TData = any> {
  queue: string;
  jobName: string;
  handle(data: TData): Promise<void> | void;
  getQueue(queueName: string): Queue;
}

export abstract class BaseJob<TData> {
  static queue: string = queueNames.DEFAULT;
  static jobName: string = "";

  protected static getQueue(queueName: string): Queue {
    return new Queue(queueName, {
      connection: redisConnection,
    });
  }

  static async dispatch<T>(
    this: JobClassStatic<T>,
    data: T,
    options?: JobsOptions
  ) {
    const queue = this.getQueue(this.queue);
    return queue.add(this.jobName, data, options);
  }

  static async dispatchMisc<T>(
    this: JobClassStatic<T>,
    data: T,
    options?: JobsOptions
  ) {
    const queue = this.getQueue(queueNames.MISC);
    return queue.add(this.jobName, data, options);
  }
}
