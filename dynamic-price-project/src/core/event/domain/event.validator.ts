import { IsDate, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Event } from './event.aggregate';
import { Notification } from '../../shared/domain/validators/notification';

export class EventRules {
  @IsNotEmpty({ groups: ['title'] })
  @MaxLength(255, { groups: ['title'] })
  title: string;

  @IsOptional()
  @MaxLength(1000, { groups: ['description'] })
  description: string | null;

  @IsDate({ groups: ['date'] })
  date: Date;

  @IsNotEmpty({ groups: ['location'] })
  @MaxLength(255, { groups: ['location'] })
  location: string;

  constructor(entity: Event) {
    Object.assign(this, entity);
  }
}

export class EventValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Event,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['title', 'date', 'location'];
    return super.validate(notification, new EventRules(data), newFields);
  }
}

export class EventValidatorFactory {
  static create(): EventValidator {
    return new EventValidator();
  }
}

export default EventValidatorFactory;
