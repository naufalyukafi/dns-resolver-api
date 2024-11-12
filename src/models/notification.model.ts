import mongoose from 'mongoose';

import { notificationTypes } from '@config/constants';
import { INotificationDocument, INotificationModel } from '@interfaces/notification';
import paginate from '@models/plugins/paginate.plugin';
import toJSON from '@models/plugins/toJSON.plugin';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: notificationTypes,
    },
    logo: {
      type: String,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
    },
    jobApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model<INotificationDocument, INotificationModel>('Notification', notificationSchema);

export default Notification;
