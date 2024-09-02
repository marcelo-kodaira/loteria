import { Event, EventId } from './event.aggregate';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';

export type EventFilter = {
  title?: string;
  location?: string;
  dateRange?: { start: Date; end: Date };
};

export class EventSearchParams extends SearchParams<EventFilter> {
  private constructor(props: SearchParamsConstructorProps<EventFilter> = {}) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<EventFilter>, 'filter'> & {
      filter?: {
        title?: string;
        location?: string;
        dateRange?: { start: Date; end: Date };
      };
    } = {},
  ) {
    return new EventSearchParams({
      ...props,
      filter: props.filter ? { ...props.filter } : undefined,
    });
  }

  get filter(): EventFilter | null {
    return this._filter;
  }

  protected set filter(value: EventFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value?.title && { title: `${_value.title}` }),
      ...(_value?.location && { location: `${_value.location}` }),
      ...(_value?.dateRange && { dateRange: _value.dateRange }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class EventSearchResult extends SearchResult<Event> {}

export interface IEventRepository
  extends ISearchableRepository<
    Event,
    EventId,
    EventFilter,
    EventSearchParams,
    EventSearchResult
  > {}
