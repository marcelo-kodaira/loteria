import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { User } from '../../../domain/user.aggregate';
import { IUserRepository } from '../../../domain/user.repository';
import { CreateUserInput } from './user-input';
import { UserOutput, UserOutputMapper } from '../common/user-output';

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const entity = User.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.userRepo.insert(entity);

    return UserOutputMapper.toOutput(entity);
  }
}

export type CreateUserOutput = UserOutput;
