import { Event, EventId } from '@core/event/domain/event.aggregate';
import { LoadEntityError } from '../../../../shared/domain/validators/validation.error';
import {
  Ticket as TicketEntity,
  TicketId,
} from '../../../domain/ticket.aggregate';

import { TicketModel } from './ticket.model';
import { User, UserId } from '@core/user/domain/user.aggregate';

export class TicketModelMapper {
  static toModel(entity: TicketEntity): Partial<TicketModel> {
    return {
      _id: entity.ticketId.id,
      event: {
        event_id: entity.event.event_id.id,
        title: entity.event.title,
        description: entity.event.description,
        date: entity.event.date,
        location: entity.event.location,
        price: entity.event.price,
        totalAvailableTickets: entity.event.totalAvailableTickets,
        created_at: entity.event.created_at,
      } as any,
      user: {
        user_id: entity.user.user_id.id,
        name: entity.user.name,
        email: entity.user.email,
        created_at: entity.user.created_at,
      },
      purchaseDate: entity.purchaseDate,
      price: entity.price,
      status: entity.status,
      created_at: entity.created_at,
    } as any;
  }

  static toEntity(model: TicketModel): TicketEntity {
    const event = new Event({
      event_id: new EventId(model.event.event_id.toString()),
      title: model.event.title,
      description: model.event.description,
      date: model.event.date,
      location: model.event.location,
      price: model.event.price,
      totalAvailableTickets: model.event.totalAvailableTickets,
      created_at: model.event.created_at,
    });

    const user = new User({
      user_id: new UserId(model.user.user_id.toString()),
      name: model.user.name,
      email: model.user.email,
      password: '123',
      created_at: model.user.created_at,
    });

    const ticket = new TicketEntity({
      ticketId: new TicketId(model.id.toString()),
      event: event,
      user: user,
      purchaseDate: model.purchaseDate,
      price: model.price,
      status: model.status,
      created_at: model.created_at,
    });

    ticket.validate();
    if (ticket.notification && ticket.notification.hasErrors()) {
      throw new LoadEntityError(ticket.notification.toJSON());
    }
    return ticket;
  }
}
