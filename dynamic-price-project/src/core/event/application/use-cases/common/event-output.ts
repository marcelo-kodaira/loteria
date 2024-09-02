import { Event } from '../../../domain/event.aggregate';

export type EventOutput = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
  created_at: Date;
};

export class EventOutputMapper {
  static toOutput(entity: Event): EventOutput {
    return {
      id: entity.event_id.id,
      title: entity.title,
      description: entity.description,
      date: entity.date,
      location: entity.location,
      price: entity.price,
      totalAvailableTickets: entity.totalAvailableTickets,
      created_at: entity.created_at,
    };
  }
}
