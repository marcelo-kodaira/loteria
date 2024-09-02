import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { UserValidatorFactory } from './user.validator';

export type UserConstructorProps = {
  userId?: UserId;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
};

export class UserId extends Uuid {}

export class User extends AggregateRoot {
  userId: UserId;
  name: string;
  email: string;
  password: string;
  created_at: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.userId = props.userId ?? new UserId();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.userId;
  }

  static create(props: {
    name: string;
    email: string;
    password: string;
  }): User {
    const user = new User({
      ...props,
      created_at: new Date(),
    });
    user.validate();
    return user;
  }

  validate(fields?: string[]) {
    const validator = UserValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      userId: this.userId.id,
      name: this.name,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
    };
  }
}
