import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { EventValidatorFactory } from './event.validator';

export type EventConstructorProps = {
  event_id?: EventId;
  title: string;
  description: string | null;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
  created_at?: Date;
};

export type EventCreateCommand = {
  title: string;
  description: string | null;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
};

export class EventId extends Uuid {}

export class Event extends AggregateRoot {
  event_id: EventId;
  title: string;
  description: string | null;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
  created_at: Date;

  constructor(props: EventConstructorProps) {
    super();
    this.event_id = props.event_id ?? new EventId();
    this.title = props.title;
    this.description = props.description ?? null;
    this.date = props.date;
    this.location = props.location;
    this.price = props.price;
    this.totalAvailableTickets = props.totalAvailableTickets;
    this.created_at = props.created_at ?? new Date();
    this.validate();
  }

  static create(props: EventCreateCommand): Event {
    const event = new Event({
      ...props,
      created_at: new Date(),
    });
    event.validate();
    return event;
  }

  updatePrice(newPrice: number): void {
    this.price = newPrice;
    this.validate(['price']);
  }

  validate(fields?: string[]): void {
    const validator = EventValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  get entity_id(): EventId {
    return this.event_id;
  }

  toJSON() {
    return {
      event_id: this.event_id.id,
      title: this.title,
      description: this.description,
      date: this.date,
      location: this.location,
      price: this.price,
      totalAvailableTickets: this.totalAvailableTickets,
      created_at: this.created_at,
    };
  }
}
