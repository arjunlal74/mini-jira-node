import { Worker } from 'bullmq';
import { redisConnection } from '../queues/connection';
import queueNames from '../enums/queueNames';

new Worker(
  queueNames.MISC,
  async (job) => {
    const JobClass = require(`../jobs/${job.name}`).default;
    await JobClass.handle(job.data);
  },
  { connection: redisConnection }
);

console.log('🔵 Misc worker running...');
