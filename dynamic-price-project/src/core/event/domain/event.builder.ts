import { Chance } from 'chance';
import { Event, EventId } from './event.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class EventFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _event_id: PropOrFactory<EventId> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _title: PropOrFactory<string> = (_index) =>
    this.chance.sentence({ words: 3 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _date: PropOrFactory<Date> = (_index) =>
    this.chance.date({ year: new Date().getFullYear() }) as Date;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _location: PropOrFactory<string> = (_index) => this.chance.city();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _price: PropOrFactory<number> = (_index) =>
    this.chance.floating({ min: 10, max: 100 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _totalAvailableTickets: PropOrFactory<number> = (_index) =>
    this.chance.integer({ min: 50, max: 500 });
  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static anEvent() {
    return new EventFakeBuilder<Event>();
  }

  static theEvents(countObjs: number) {
    return new EventFakeBuilder<Event[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withEventId(valueOrFactory: PropOrFactory<EventId>) {
    this._event_id = valueOrFactory;
    return this;
  }

  withTitle(valueOrFactory: PropOrFactory<string>) {
    this._title = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
    return this;
  }

  withDate(valueOrFactory: PropOrFactory<Date>) {
    this._date = valueOrFactory;
    return this;
  }

  withLocation(valueOrFactory: PropOrFactory<string>) {
    this._location = valueOrFactory;
    return this;
  }

  withPrice(valueOrFactory: PropOrFactory<number>) {
    this._price = valueOrFactory;
    return this;
  }

  withTotalAvailableTickets(valueOrFactory: PropOrFactory<number>) {
    this._totalAvailableTickets = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const events = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const event = new Event({
        event_id: !this._event_id
          ? undefined
          : this.callFactory(this._event_id, index),
        title: this.callFactory(this._title, index),
        description: this.callFactory(this._description, index),
        date: this.callFactory(this._date, index),
        location: this.callFactory(this._location, index),
        price: this.callFactory(this._price, index),
        totalAvailableTickets: this.callFactory(
          this._totalAvailableTickets,
          index,
        ),
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });
      event.validate();
      return event;
    });
    return this.countObjs === 1 ? (events[0] as any) : events;
  }

  get event_id() {
    return this.getValue('event_id');
  }

  get title() {
    return this.getValue('title');
  }

  get description() {
    return this.getValue('description');
  }

  get date() {
    return this.getValue('date');
  }

  get location() {
    return this.getValue('location');
  }

  get price() {
    return this.getValue('price');
  }

  get totalAvailableTickets() {
    return this.getValue('totalAvailableTickets');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['event_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
