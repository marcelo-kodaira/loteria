import { IsDate, IsEnum, IsNumber, Min } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { Ticket } from './ticket.aggregate';

export enum TicketStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Used = 'used',
}

export class TicketRules {
  @IsEnum(TicketStatus, {
    message: 'Status must be a valid TicketStatus enum value',
  })
  status: TicketStatus;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsDate({ message: 'Purchase date must be a valid date' })
  purchaseDate: Date;

  constructor(entity: Ticket) {
    Object.assign(this, entity);
  }
}

export class TicketValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Ticket,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length
      ? fields
      : ['status', 'price', 'purchaseDate'];
    return super.validate(notification, new TicketRules(data), newFields);
  }
}

export class TicketValidatorFactory {
  static create() {
    return new TicketValidator();
  }
}
