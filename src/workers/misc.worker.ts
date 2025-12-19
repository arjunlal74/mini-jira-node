import { Worker, Job } from 'bullmq';
import { redisConnection } from '../queues/connection';
import queueNames from '../enums/queueNames';
import { JobClassStatic } from '../jobs/BaseJob';

// Job registry for type-safe job resolution
const jobRegistry: Record<string, JobClassStatic> = {};

// Dynamically import and register jobs
async function loadJob(jobName: string): Promise<JobClassStatic | null> {
  if (jobRegistry[jobName]) {
    return jobRegistry[jobName];
  }

  try {
    const jobModule = await import(`../jobs/${jobName}`);
    const JobClass = jobModule.default || jobModule[jobName];
    
    if (JobClass && typeof JobClass.handle === 'function') {
      jobRegistry[jobName] = JobClass;
      return JobClass;
    }
  } catch (error) {
    console.error(`❌ Failed to load job: ${jobName}`, error);
  }

  return null;
}

const worker = new Worker(
  queueNames.MISC,
  async (job: Job) => {
    console.log('🔄 Misc worker picked job:', job.name, job.data);
    
    const JobClass = await loadJob(job.name);
    
    if (!JobClass) {
      throw new Error(`Job class not found: ${job.name}`);
    }

    if (typeof JobClass.handle !== 'function') {
      throw new Error(`Job ${job.name} does not have a handle method`);
    }

    // Use jobName from the class if available, otherwise fall back to job.name
    const expectedJobName = (JobClass as any).jobName || job.name;
    if (expectedJobName !== job.name) {
      console.warn(`⚠️ Job name mismatch: expected ${expectedJobName}, got ${job.name}`);
    }

    await JobClass.handle(job.data);
  },
  { 
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

console.log('🔵 Misc worker running...');
