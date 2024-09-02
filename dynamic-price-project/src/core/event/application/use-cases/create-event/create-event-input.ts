import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
  Min,
  IsPositive,
  validateSync,
} from 'class-validator';

export type CreateEventInputConstructorProps = {
  title: string;
  description?: string | null;
  date: Date;
  location: string;
  price: number;
  totalAvailableTickets: number;
  created_at?: Date;
};

export class CreateEventInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(1)
  totalAvailableTickets: number;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  constructor(props: CreateEventInputConstructorProps) {
    if (!props) return;
    this.title = props.title;
    this.description = props.description;
    this.date = props.date;
    this.location = props.location;
    this.price = props.price;
    this.totalAvailableTickets = props.totalAvailableTickets;
    this.created_at = props.created_at;
  }

  static validate(input: CreateEventInput) {
    return validateSync(input);
  }
}
