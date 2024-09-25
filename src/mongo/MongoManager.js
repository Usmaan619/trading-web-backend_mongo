import mongoose from "mongoose";

class MongoManager {
  constructor() {}

  getMongoUrl() {
    return process.env.MONGO_URI;
  }

  connect() {
    mongoose.set("strictQuery", false);
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useUnifiedTopology', true);
    // mongoose.set('useNewUrlParser', true);
    return mongoose.connect(this.getMongoUrl());
  }
}

export { MongoManager };
