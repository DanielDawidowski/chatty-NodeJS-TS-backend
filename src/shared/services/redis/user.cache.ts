import { ServerError } from './../../globals/helpers/error-handler';
import Logger from 'bunyan';
import { config } from '@root/config';
import { IUserDocument } from './../../../features/user/interfaces/user.interface';
import { BaseCache } from '@service/redis/base.cache';

const log: Logger = config.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }
  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;
    const firstList = {
      _id: `${_id}`,
      uId: `${uId}`,
      username: `${username}`,
      email: `${email}`,
      avatarColor: `${avatarColor}`,
      createdAt: `${createdAt}`,
      postsCount: `${postsCount}`
    };
    const secondList = {
      blocked: JSON.stringify(blocked),
      blockedBy: JSON.stringify(blockedBy),
      profilePicture: JSON.stringify(profilePicture),
      followersCount: JSON.stringify(followersCount),
      followingCount: JSON.stringify(followingCount),
      notifications: JSON.stringify(notifications),
      social: JSON.stringify(social)
    };
    const thirdList = {
      work: `${work}`,
      location: `${location}`,
      school: `${school}`,
      quote: `${quote}`,
      bgImageVersion: `${bgImageVersion}`,
      bgImageId: `${bgImageId}`
    };
    const dataToSave = { ...firstList, ...secondList, ...thirdList };

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      for (const [itemKey, value] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${value}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try again.');
    }
  }
}
