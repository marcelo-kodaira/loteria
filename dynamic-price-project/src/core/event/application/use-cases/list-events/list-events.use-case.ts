import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import {
  IEventRepository,
  EventSearchParams,
  EventSearchResult,
} from '../../../domain/event.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ListEventsInput } from './list-events.input';
import { EventOutput, EventOutputMapper } from '../common/event-output';

export class ListEventsUseCase
  implements IUseCase<ListEventsInput, ListEventsOutput>
{
  private readonly logger = new Logger(ListEventsUseCase.name);

  constructor(
    private eventRepo: IEventRepository,
    private redisService: any,
  ) {}

  async execute(input: ListEventsInput): Promise<ListEventsOutput> {
    const params = EventSearchParams.create(input);
    const searchResult = await this.eventRepo.search(params);
    return this.toOutput(searchResult);
  }

  private async toOutput(
    searchResult: EventSearchResult,
  ): Promise<ListEventsOutput> {
    const items = await Promise.all(
      searchResult.items.map(async (event) => {
        try {
          let price = await this.getEventPriceFromCache(event.entity_id.id);

          if (!price) {
            price = await this.fetchPriceFromFallbackApi(event.entity_id.id);
            await this.cacheEventPrice(event.entity_id.id, price);
          }

          event.updatePrice(parseFloat(price));
        } catch (error) {
          this.logger.error(
            `Failed to retrieve price for event ${event.entity_id.id}`,
            error.stack,
          );
          throw new Error(
            `Failed to retrieve price for event ${event.entity_id.id}`,
          );
        }

        return EventOutputMapper.toOutput(event);
      }),
    );

    return PaginationOutputMapper.toOutput(items, searchResult);
  }

  private async getEventPriceFromCache(
    eventId: string,
  ): Promise<string | null> {
    try {
      const price = await this.redisService.get(`event-price-${eventId}`);
      if (price) {
        this.logger.log(
          `Price for event ${eventId} retrieved from Redis: ${price}`,
        );
      } else {
        this.logger.log(`Price for event ${eventId} not found in Redis`);
      }
      return price;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve price from Redis for event ${eventId}`,
        error.stack,
      );
      return null;
    }
  }

  private async fetchPriceFromFallbackApi(eventId: string): Promise<string> {
    try {
      this.logger.log(`Fetching price for event ${eventId} from fallback API`);
      const response = await axios.get(
        `https://api.external-service.com/events/${eventId}/price`,
      );
      const price = response.data.price;
      this.logger.log(
        `Price for event ${eventId} retrieved from fallback API: ${price}`,
      );
      return price.toString();
    } catch (error) {
      this.logger.error(
        `Failed to fetch price from fallback API for event ${eventId}`,
        error.stack,
      );
      throw new Error(
        `Failed to fetch price from fallback API for event ${eventId}`,
      );
    }
  }

  private async cacheEventPrice(eventId: string, price: string): Promise<void> {
    try {
      await this.redisService.set(`event-price-${eventId}`, price, 'EX', 3600);
      this.logger.log(`Price for event ${eventId} cached in Redis: ${price}`);
    } catch (error) {
      this.logger.error(
        `Failed to cache price in Redis for event ${eventId}`,
        error.stack,
      );
    }
  }
}

export type ListEventsOutput = PaginationOutput<EventOutput>;
