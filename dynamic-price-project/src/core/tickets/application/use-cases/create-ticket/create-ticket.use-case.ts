import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Ticket } from '../../../domain/ticket.aggregate';
import { ITicketRepository } from '../../../domain/ticket.repository';
import { TicketOutput, TicketOutputMapper } from '../common/ticket-output';

import { CreateTicketInput } from './create-ticket.input';

export class CreateTicketUseCase
  implements IUseCase<CreateTicketInput, CreateTicketOutput>
{
  constructor(private readonly ticketRepo: ITicketRepository) {}

  async execute(input: CreateTicketInput): Promise<CreateTicketOutput> {
    const entity = Ticket.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.ticketRepo.insert(entity);

    return TicketOutputMapper.toOutput(entity);
  }
}

export type CreateTicketOutput = TicketOutput;
