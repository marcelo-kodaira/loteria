import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketModel } from './ticket.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Ticket } from '../../../domain/ticket.aggregate';
import { TicketModelMapper } from './ticket-model-mapper';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectModel(TicketModel.name) private ticketModel: Model<TicketModel>,
  ) {}

  async create(ticket: Ticket): Promise<void> {
    const ticketData = TicketModelMapper.toModel(ticket);
    const newTicket = new this.ticketModel(ticketData);
    await newTicket.save();
  }

  async bulkCreate(tickets: Ticket[]): Promise<void> {
    const ticketsData = tickets.map(TicketModelMapper.toModel);
    await this.ticketModel.insertMany(ticketsData);
  }

  async update(ticket: Ticket): Promise<void> {
    const ticketData = TicketModelMapper.toModel(ticket);
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(ticket.ticketId.id, ticketData, { new: true })
      .exec();
    if (!updatedTicket) {
      throw new NotFoundError(ticket.ticketId.id, 'Ticket');
    }
  }

  async delete(ticketId: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(ticketId).exec();
    if (!result) {
      throw new NotFoundError(ticketId, 'Ticket');
    }
  }

  async findById(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId).exec();
    if (!ticket) {
      throw new NotFoundError(ticketId, 'Ticket');
    }
    return TicketModelMapper.toEntity(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.ticketModel.find().exec();
    return tickets.map(TicketModelMapper.toEntity);
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const tickets = await this.ticketModel
      .find({ user: userId })
      .populate('eventId')
      .populate('userId')
      .exec();
    return tickets.map(TicketModelMapper.toEntity);
  }

  async search(searchParams: any): Promise<{ items: Ticket[]; total: number }> {
    const { filter, sort, sortDir, page, perPage } = searchParams;
    const query = {};

    if (filter) {
      query['status'] = { $regex: new RegExp(filter, 'i') };
    }

    const sortOptions = {};
    if (sort && sortDir) {
      sortOptions[sort] = sortDir === 'asc' ? 1 : -1;
    }

    const tickets = await this.ticketModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const count = await this.ticketModel.countDocuments(query).exec();

    return {
      items: tickets.map(TicketModelMapper.toEntity),
      total: count,
    };
  }
}
