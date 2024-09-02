import { EventId } from '../event.aggregate';
import { Event } from '../event.aggregate';

describe('Event Unit Tests', () => {
  beforeEach(() => {
    Event.prototype.validate = jest
      .fn()
      .mockImplementation(Event.prototype.validate);
  });

  test('constructor of event', () => {
    let event = new Event({
      title: 'Test Event',
      description: 'A description of the event',
      date: new Date(),
      location: 'Test Location',
      price: 50,
      totalAvailableTickets: 100,
    });

    expect(event.event_id).toBeInstanceOf(EventId);
    expect(event.title).toBe('Test Event');
    expect(event.description).toBe('A description of the event');
    expect(event.date).toBeInstanceOf(Date);
    expect(event.location).toBe('Test Location');
    expect(event.price).toBe(50);
    expect(event.totalAvailableTickets).toBe(100);
    expect(event.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    event = new Event({
      title: 'Test Event',
      description: 'Another description',
      date: new Date(),
      location: 'Another Location',
      price: 75,
      totalAvailableTickets: 200,
      created_at,
    });

    expect(event.event_id).toBeInstanceOf(EventId);
    expect(event.title).toBe('Test Event');
    expect(event.description).toBe('Another description');
    expect(event.date).toBeInstanceOf(Date);
    expect(event.location).toBe('Another Location');
    expect(event.price).toBe(75);
    expect(event.totalAvailableTickets).toBe(200);
    expect(event.created_at).toBe(created_at);
  });

  describe('event_id field', () => {
    const arrange = [
      {
        title: 'Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
      },
      {
        title: 'Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
        id: null,
      },
      {
        title: 'Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
        id: undefined,
      },
      {
        title: 'Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
        id: new EventId(),
      },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const event = new Event(item);
      expect(event.event_id).toBeInstanceOf(EventId);
    });
  });

  describe('create command', () => {
    test('should create an event', () => {
      const event = Event.create({
        title: 'Test Event',
        description: 'A description of the event',
        date: new Date(),
        location: 'Test Location',
        price: 50,
        totalAvailableTickets: 100,
      });

      expect(event.event_id).toBeInstanceOf(EventId);
      expect(event.title).toBe('Test Event');
      expect(event.description).toBe('A description of the event');
      expect(event.date).toBeInstanceOf(Date);
      expect(event.location).toBe('Test Location');
      expect(event.price).toBe(50);
      expect(event.totalAvailableTickets).toBe(100);
      expect(event.created_at).toBeInstanceOf(Date);
      expect(Event.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  test('should change title', () => {
    const event = Event.create({
      title: 'Original Title',
      description: 'Description',
      date: new Date(),
      location: 'Location',
      price: 50,
      totalAvailableTickets: 100,
    });
    event.changeTitle('New Title');
    expect(event.title).toBe('New Title');
    expect(Event.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should change description', () => {
    const event = Event.create({
      title: 'Test Event',
      description: 'Original Description',
      date: new Date(),
      location: 'Location',
      price: 50,
      totalAvailableTickets: 100,
    });
    event.changeDescription('New Description');
    expect(event.description).toBe('New Description');
    expect(Event.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should change date', () => {
    const event = Event.create({
      title: 'Test Event',
      description: 'Description',
      date: new Date(),
      location: 'Location',
      price: 50,
      totalAvailableTickets: 100,
    });
    const newDate = new Date();
    event.changeDate(newDate);
    expect(event.date).toBe(newDate);
    expect(Event.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should change location', () => {
    const event = Event.create({
      title: 'Test Event',
      description: 'Description',
      date: new Date(),
      location: 'Original Location',
      price: 50,
      totalAvailableTickets: 100,
    });
    event.changeLocation('New Location');
    expect(event.location).toBe('New Location');
    expect(Event.prototype.validate).toHaveBeenCalledTimes(2);
  });
});

describe('Event Validator', () => {
  describe('create command', () => {
    test('should invalidate event with too long title', () => {
      const event = Event.create({
        title: 't'.repeat(256),
        description: 'Description',
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
      } as any);
      expect(event.notification.hasErrors()).toBe(true);
      expect(event.notification).notificationContainsErrorMessages([
        {
          title: ['title must be shorter than or equal to 255 characters'],
        },
      ]);
    });

    test('should invalidate event with too long description', () => {
      const event = Event.create({
        title: 'Test Event',
        description: 'd'.repeat(1001),
        date: new Date(),
        location: 'Location',
        price: 50,
        totalAvailableTickets: 100,
      } as any);
      expect(event.notification.hasErrors()).toBe(true);
      expect(event.notification).notificationContainsErrorMessages([
        {
          description: [
            'description must be shorter than or equal to 1000 characters',
          ],
        },
      ]);
    });
  });
});
