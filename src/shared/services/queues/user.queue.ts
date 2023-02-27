import { userWorker } from '@worker/user.worker';
import { BaseQueue } from '@service/queues/base.queue';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    // this.processJob('addUserToDb', 5, userWorker.addUserData);
  }

  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
