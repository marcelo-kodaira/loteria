import { User } from '@core/user/domain/user.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { TicketValidatorFactory } from './ticket.validator';
import { Event } from '@core/event/domain/event.aggregate';

export type TicketConstructorProps = {
  ticketId?: TicketId;
  event: Event;
  user: User;
  purchaseDate?: Date;
  price: number;
  status: string;
  created_at?: Date;
};

export type TicketCreateCommand = {
  event: Event;
  user: User;
  price: number;
  status: string;
};

export class TicketId extends Uuid {}

export class Ticket extends AggregateRoot {
  ticketId: TicketId;
  event: Event;
  user: User;
  purchaseDate: Date;
  price: number;
  status: string;
  created_at: Date;

  constructor(props: TicketConstructorProps) {
    super();
    this.ticketId = props.ticketId ?? new TicketId();
    this.event = props.event;
    this.user = props.user;
    this.purchaseDate = props.purchaseDate ?? new Date();
    this.price = props.price;
    this.status = props.status;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.ticketId;
  }

  static create(props: TicketCreateCommand): Ticket {
    const ticket = new Ticket({ ...props, created_at: new Date() });
    ticket.validate();
    return ticket;
  }

  updateStatus(newStatus: string): void {
    this.status = newStatus;
    this.validate(['status']);
  }

  validate(fields?: string[]) {
    const validator = TicketValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      ticketId: this.ticketId.id,
      eventId: this.event.entity_id.id,
      userId: this.user.entity_id.id,
      purchaseDate: this.purchaseDate,
      price: this.price,
      status: this.status,
      created_at: this.created_at,
    };
  }
}
