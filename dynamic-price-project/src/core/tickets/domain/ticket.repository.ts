import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Ticket, TicketId } from './ticket.aggregate';

export type TicketFilter = string;

export class TicketSearchParams extends SearchParams<TicketFilter> {}

export class TicketSearchResult extends SearchResult<Ticket> {}

export interface ITicketRepository
  extends ISearchableRepository<
    Ticket,
    TicketId,
    TicketFilter,
    TicketSearchParams,
    TicketSearchResult
  > {
  findByUserId(userId: string): Promise<Ticket[]>;
}
