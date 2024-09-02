import { Ticket, TicketId } from '@core/tickets/domain/ticket.aggregate';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import {
  ITicketRepository,
  TicketFilter,
} from '@core/tickets/domain/ticket.repository';

export class TicketInMemoryRepository
  extends InMemorySearchableRepository<Ticket, TicketId>
  implements ITicketRepository
{
  sortableFields: string[] = ['price', 'status', 'created_at'];

  protected async applyFilter(
    items: Ticket[],
    filter: TicketFilter | null,
  ): Promise<Ticket[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.status.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected applySort(
    items: Ticket[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Ticket[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    return this.items.filter((ticket) => ticket.user.entity_id.id === userId);
  }

  getEntity(): new (...args: any[]) => Ticket {
    return Ticket;
  }
}
