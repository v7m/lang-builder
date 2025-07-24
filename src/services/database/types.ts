import { Document } from 'mongoose';
import { WordEntry } from '../../types/wordEntry';

// MongoDB document interface
export type WordEntryDocument = WordEntry & Document & {
  createdAt: Date;
  updatedAt: Date;
};
