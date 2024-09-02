import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { User, UserId } from '../../../domain/user.aggregate';
import { UserFilter, IUserRepository } from '../../../domain/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<User, UserId, UserFilter>
  implements IUserRepository
{
  sortableFields: string[] = ['name', 'email', 'created_at'];

  protected async applyFilter(
    items: User[],
    filter: UserFilter | null,
  ): Promise<User[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      const matchesName = filter.name
        ? i.name.toLowerCase().includes(filter.name.toLowerCase())
        : true;
      const matchesEmail = filter.email
        ? i.email.toLowerCase().includes(filter.email.toLowerCase())
        : true;
      return matchesName && matchesEmail;
    });
  }

  protected applySort(
    items: User[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): User[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
    return user || null;
  }

  async findByName(name: string): Promise<User[]> {
    const users = this.items.filter(
      (user) => user.name.toLowerCase() === name.toLowerCase(),
    );
    return users;
  }

  getEntity(): new (...args: any[]) => User {
    return User;
  }
}
