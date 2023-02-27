import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DB_URL!)
      .then(() => {
        log.info('Successfully connected to database.');
        redisConnection.connnect();
      })
      .catch((error) => {
        log.error('Error connecting to database', error);
        return process.exit(1);
      });
  };
  mongoose.set('strictQuery', true);
  connect();
  mongoose.connection.on('disconnected', connect);
};
