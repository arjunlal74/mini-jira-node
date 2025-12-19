import queueNames from '../enums/queueNames';
import { BaseJob } from './BaseJob';

interface Payload {
  userId: number;
}

export class TestJob extends BaseJob<Payload> {
  static queue = queueNames.DEFAULT;

  static async handle(data: Payload) {
    console.log('📧 Sending email to userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', data.userId);
  }
}
