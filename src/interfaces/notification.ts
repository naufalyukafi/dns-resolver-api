import { PaginateModel } from '@models/plugins/paginate.plugin';
import { Document, Model } from 'mongoose';

interface INotification {
  userId: string;
  type: string;
  title: string;
  message: string;
  jobId: string;
  candidateId: string;
  jobApplicationId: string;
  isRead: boolean;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument>, PaginateModel {}
