import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface UserRequest extends Request {
  user?: {
    _id: string| ObjectId;
  };
}

export type UserData = { name: string; about: string } | { avatar: string };

export interface UpdateUserData {
  name?: string;
  about?: string;
  avatar?: string;
}

export type UserReturnType =
  | string
  | JwtPayload
  | { _id: string | ObjectId }
  | null;

export interface ExtendedError extends Error {
  statusCode?: number;
}
