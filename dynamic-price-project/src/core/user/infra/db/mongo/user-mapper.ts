import { LoadEntityError } from '../../../../shared/domain/validators/validation.error';
import { User, UserId } from '../../../domain/user.aggregate';
import { UserModel } from './user.model';

export class UserModelMapper {
  static toModel(entity: User): Partial<UserModel> {
    return {
      _id: entity.userId.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      created_at: entity.created_at,
    };
  }

  static toEntity(model: UserModel): User {
    const user = new User({
      userId: new UserId(model.id.toString()),
      name: model.name,
      email: model.email,
      password: model.password,
      created_at: model.created_at,
    });

    user.validate();
    if (user.notification && user.notification.hasErrors()) {
      throw new LoadEntityError(user.notification.toJSON());
    }
    return user;
  }
}
