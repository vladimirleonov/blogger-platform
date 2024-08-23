import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

// const isValidISOString = (value: string) => {
//   const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
//   return isoRegex.test(value)
// }

@Schema()
class EmailConfirmation {
  @Prop({
    type: String,
    maxlength: 40,
    required: true,
  })
  confirmationCode: string;

  @Prop({
    type: String,
    // validate: {
    //   validator: isValidISOString,
    //   message: 'expirationDate must be a valid ISO string',
    // },
    required: true,
  })
  expirationDate: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  isConfirmed: boolean;
}

@Schema()
class PasswordRecovery {
  @Prop({
    type: String,
    maxlength: 40,
  })
  recoveryCode: string;

  @Prop({
    type: Date,
    // validate: {
    //     validator: isValidISOString,
    //     message: "expirationDate must be a valid ISO string",
    // }
  })
  expirationDate: Date;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

@Schema()
export class User {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    match: /^[a-zA-Z0-9_-]*$/,
    required: true,
  })
  login: string;

  @Prop({
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    required: true,
  })
  email: string;

  @Prop({
    type: Date,
    // validate: {
    //   validator: isValidISOString,
    //   message: "createdAt must be a valid ISO string",
    // },
    required: true,
  })
  createdAt: Date;
  // createdAt: string;

  @Prop({
    type: EmailConfirmationSchema,
    required: true,
  })
  emailConfirmation: EmailConfirmation;

  @Prop({
    type: PasswordRecoverySchema,
  })
  passwordRecovery: PasswordRecovery;
}

//Types
export type UserDocument = HydratedDocument<User>;
export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;
export type UserModelType = Model<User>;

export const UserSchema = SchemaFactory.createForClass(User);
