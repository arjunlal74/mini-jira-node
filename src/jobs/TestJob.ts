import { BaseJob } from './BaseJob';


export class TestJob extends BaseJob<Payload> {
  static queue = 'default';

  static async handle(data: Payload) {
    console.log('📧 Sending email to userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', data.userId);
  }
}
