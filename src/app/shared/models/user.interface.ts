import { IPlan } from './plan.interface';

export interface IUser {
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  plan: IPlan;
  name?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
  photo?: string;
}
