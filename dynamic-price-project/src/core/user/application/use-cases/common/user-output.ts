import { User } from '../../../domain/user.aggregate';

export type UserOutput = {
  userId: string;
  name: string;
  email: string;
  created_at: Date;
};

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    const { userId, name, email, created_at } = entity.toJSON();

    return {
      userId: userId,
      name,
      email,
      created_at,
    };
  }
}
