export interface IUser {
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  name?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
  photo?: string;
}
