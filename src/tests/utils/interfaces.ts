import { PaginateModel } from '@models/plugins/paginate.plugin';
import { Document, Model, Types } from 'mongoose';

interface ITask {
  name: String;
  project: Types.ObjectId;
}

export interface ITaskDocument extends ITask, Document {}
export interface ITaskModel extends Model<ITaskDocument>, PaginateModel {}

interface IProject {
  name: String;
}

export interface IProjectDocument extends IProject, Document {}
export interface IProjectModel extends Model<IProjectDocument>, PaginateModel {}
