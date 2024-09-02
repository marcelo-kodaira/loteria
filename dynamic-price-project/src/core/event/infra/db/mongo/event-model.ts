import { Schema, model, Document } from 'mongoose';

export interface IEventDocument extends Document {
  event_id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
  created_at: Date;
}

const EventModel = new Schema<IEventDocument>({
  event_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  totalAvailableTickets: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export const EventSchema = model<IEventDocument>('Event', EventModel);
