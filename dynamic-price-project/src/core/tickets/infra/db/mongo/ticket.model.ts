import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EventSchema,
  IEventDocument,
} from '../../../../event/infra/db/mongo/event-model';
import {
  UserSchema,
  IUserDocument,
} from '../../../../user/infra/db/mongo/user.model';

@Schema()
export class TicketModel extends Document {
  @Prop({ required: true, type: EventSchema })
  event: IEventDocument;

  @Prop({ required: true, type: UserSchema })
  user: IUserDocument;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, default: Date.now })
  created_at: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);
