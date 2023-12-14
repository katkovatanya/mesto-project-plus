import { model, Schema } from 'mongoose';
import {
  urlValidationOptions,
  emailValidationOptions,
} from '../utils/validators';
import {
  DEFAULT_USER_NAME,
  DEFAULT_ABOUT_VALUE,
  DEFAULT_AVATAR_LINK,
} from '../utils/constants';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: DEFAULT_USER_NAME,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: DEFAULT_ABOUT_VALUE,
    },
    avatar: {
      type: String,
      validate: urlValidationOptions,
      default: DEFAULT_AVATAR_LINK,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: emailValidationOptions,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

export default model<IUser>('user', userSchema);
