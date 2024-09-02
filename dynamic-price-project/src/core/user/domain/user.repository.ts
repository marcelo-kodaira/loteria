import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { User, UserId } from './user.aggregate';

export type UserFilter = {
  email?: string;
  name?: string;
};

export class UserSearchParams extends SearchParams<UserFilter> {}

export class UserSearchResult extends SearchResult<User> {}

export interface IUserRepository
  extends ISearchableRepository<
    User,
    UserId,
    UserFilter,
    UserSearchParams,
    UserSearchResult
  > {
  findByEmail(email: string): Promise<User | null>;
  findByName(name: string): Promise<User[]>;
}
