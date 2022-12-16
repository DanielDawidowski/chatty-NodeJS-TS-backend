import mongoose from "mongoose";
import { config } from "./config";
import Logger from "bunyan";

const log: Logger = config.createLogger("setupDatabase");

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DB_URL!)
      .then(() => {
        log.info("Successfully connected to database.");
      })
      .catch((error) => {
        log.error("Error connecting to database", error);
        return process.exit(1);
      });
  };
  mongoose.set("strictQuery", true);
  connect();
  mongoose.connection.on("disconnected", connect);
};
