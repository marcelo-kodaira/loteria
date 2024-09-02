import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { User } from './user.aggregate';

export class UserRules {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100, { message: 'Password must be at least 6 characters long' })
  password: string;

  constructor(entity: User) {
    Object.assign(this, entity);
  }
}

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: User, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name', 'email', 'password'];
    return super.validate(notification, new UserRules(data), newFields);
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
