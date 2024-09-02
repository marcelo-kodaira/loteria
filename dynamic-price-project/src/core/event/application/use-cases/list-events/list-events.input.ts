import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  Min,
  validateSync,
} from 'class-validator';

export type ListEventsInputConstructorProps = {
  title?: string;
  dateFrom?: Date;
  dateTo?: Date;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: 'asc' | 'desc';
};

export class ListEventsInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @IsDate()
  dateTo?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  perPage?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  sortDir?: 'asc' | 'desc';

  constructor(props: ListEventsInputConstructorProps) {
    if (!props) return;
    this.title = props.title;
    this.dateFrom = props.dateFrom;
    this.dateTo = props.dateTo;
    this.location = props.location;
    this.priceMin = props.priceMin;
    this.priceMax = props.priceMax;
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
  }

  static validate(input: ListEventsInput) {
    return validateSync(input);
  }
}
