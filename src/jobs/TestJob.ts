import queueNames from '../enums/queueNames';
import { BaseJob } from './BaseJob';

interface Payload {
  userId: number;
}

export class TestJob extends BaseJob<Payload> {
  static queue = queueNames.DEFAULT;
  static jobName = 'TestJob';

  static async handle(data: Payload): Promise<void> {
    console.log('📧 Sending email to userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', data.userId);
  }
}

// Export as default for worker compatibility
export default TestJob;
