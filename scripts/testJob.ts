import dotenv from 'dotenv';
import path from 'path';

// MUST completely override the redis host BEFORE importing jobs because connection gets evaluated.
// Since we are running the test script directy on the windows host, we can't use 'redis' (the docker container name).
// We override it with 127.0.0.1, meaning it will talk directly to the exposed redis container on localhost:6379 
process.env.REDIS_HOST = '127.0.0.1';
process.env.REDIS_PORT = '6379'; 

// Now that process.env is overridden, import the queues/jobs
import TestJob from '../src/jobs/TestJob';

// Load normal env variables as fallback
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runTest = async () => {
  console.log('🚀 Starting Job Dispatch Test...');
  try {
    const payload = { userId: Math.floor(Math.random() * 1000) };
    
    console.log(`📦 Creating new TestJob with Payload:`, payload);

    // This pushes the job to the Redis default queue
    const job = await TestJob.dispatch(payload);

    console.log('✅ Job successfully dispatched!');
    console.log(`🆔 Job ID: ${job.id}`);
    console.log(`📋 Queue Name: ${job.queueName}`);
    
    console.log('\n⏳ Check your "worker:default" terminal tab to see if it picked up this job!');
    
    // Give it a second strictly to display logs, then forcefully exit so the script finishes
    setTimeout(() => {
      console.log('Exiting script...');
      process.exit(0);
    }, 1500);

  } catch (error) {
    console.error('❌ Failed to dispatch job:', error);
    process.exit(1);
  }
};

runTest();
