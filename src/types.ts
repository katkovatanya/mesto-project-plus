import { Request } from 'express';

export interface UserRequest extends Request {
  user?: {
    _id: string;
  };
}

export type UserData = { name: string, about: string } | { avatar: string };

export interface UpdateUserData {
  name?: string;
  about?: string;
  avatar?: string;
}