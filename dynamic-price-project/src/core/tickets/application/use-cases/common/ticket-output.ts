import { Ticket } from '../../../domain/ticket.aggregate';

export type TicketOutput = {
  ticketId: string;
  eventId: string;
  userId: string;
  purchaseDate: Date;
  price: number;
  status: string;
  created_at: Date;
};

export class TicketOutputMapper {
  static toOutput(entity: Ticket): TicketOutput {
    const {
      ticketId,
      eventId,
      userId,
      purchaseDate,
      price,
      status,
      created_at,
    } = entity.toJSON();

    return {
      ticketId,
      eventId,
      userId,
      purchaseDate,
      price,
      status,
      created_at,
    };
  }
}
