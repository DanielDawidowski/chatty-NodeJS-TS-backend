import { authWorker } from '@worker/auth.worker';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from '@service/queues/base.queue';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserToDb', 5, authWorker.addAuthUserToDb);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
