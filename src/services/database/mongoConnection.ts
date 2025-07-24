import mongoose from 'mongoose';
import { logger } from '../logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lang-builder';

class MongoConnection {
  private static instance: MongoConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(MONGODB_URI);
      this.isConnected = true;
      logger.success('✅ MongoDB connected successfully');
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info('MongoDB already disconnected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.success('✅ MongoDB disconnected successfully');
    } catch (error) {
      logger.error('❌ MongoDB disconnection failed:', error);
      throw error;
    }
  }

  getConnection(): typeof mongoose {
    return mongoose;
  }

  isConnectedToDb(): boolean {
    return this.isConnected;
  }
}

export const mongoConnection = MongoConnection.getInstance();
