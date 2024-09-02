import { Chance } from 'chance';
import { User, UserId } from '@core/user/domain/user.aggregate';
import { Event, EventId } from '@core/event/domain/event.aggregate';
import { Ticket, TicketId } from '@core/tickets/domain/ticket.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class TicketFakeBuilder<TBuild = any> {
  private _ticketId: PropOrFactory<TicketId> | undefined = undefined;
  private _event: PropOrFactory<Event> = () =>
    new Event({
      event_id: new EventId(),
      title: 'Event title',
      description: 'Event description',
      date: new Date(),
      location: 'Event location',
      price: 100,
      totalAvailableTickets: 100,
      created_at: new Date(),
    });
  private _user: PropOrFactory<User> = () =>
    new User({
      userId: new UserId(),
      name: 'testing',
      email: '123@mail.com',
      password: '123',
      created_at: new Date(),
    });
  private _purchaseDate: PropOrFactory<Date> = () => new Date();
  private _price: PropOrFactory<number> = (_index) => 100 + _index;
  private _status: PropOrFactory<string> = () => 'active';

  private countObjs: number;
  private chance: Chance.Chance;

  static aTicket() {
    return new TicketFakeBuilder<Ticket>();
  }

  static theTickets(countObjs: number) {
    return new TicketFakeBuilder<Ticket[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withTicketId(valueOrFactory: PropOrFactory<TicketId>) {
    this._ticketId = valueOrFactory;
    return this;
  }

  withEvent(valueOrFactory: PropOrFactory<Event>) {
    this._event = valueOrFactory;
    return this;
  }

  withUser(valueOrFactory: PropOrFactory<User>) {
    this._user = valueOrFactory;
    return this;
  }

  withPurchaseDate(valueOrFactory: PropOrFactory<Date>) {
    this._purchaseDate = valueOrFactory;
    return this;
  }

  withPrice(valueOrFactory: PropOrFactory<number>) {
    this._price = valueOrFactory;
    return this;
  }

  withStatus(valueOrFactory: PropOrFactory<string>) {
    this._status = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const tickets = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const ticket = new Ticket({
          ticketId: this.callFactory(this._ticketId, index),
          event: this.callFactory(this._event, index),
          user: this.callFactory(this._user, index),
          purchaseDate: this.callFactory(this._purchaseDate, index),
          price: this.callFactory(this._price, index),
          status: this.callFactory(this._status, index),
        });
        ticket.validate();
        return ticket;
      });
    return this.countObjs === 1 ? (tickets[0] as any) : tickets;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
