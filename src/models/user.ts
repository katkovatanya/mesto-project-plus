import { model, Schema } from "mongoose";
import validator from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
    },
  },
});

export default model<IUser>("user", userSchema);
