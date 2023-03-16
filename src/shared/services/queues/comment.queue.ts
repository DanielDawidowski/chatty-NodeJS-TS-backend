import { ICommentJob } from '@comment/interfaces/comment.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { commentWorker } from '@worker/comment.worker';

class CommentQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addCommentToDB', 5, commentWorker.addCommentToDB);
  }

  public addAuthUserJob(name: string, data: ICommentJob): void {
    this.addJob(name, data);
  }
}

export const commentQueue: CommentQueue = new CommentQueue();
