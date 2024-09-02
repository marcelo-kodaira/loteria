import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  validateSync,
} from 'class-validator';

export type CreateUserInputConstructorProps = {
  name: string;
  email: string;
  password: string;
  created_at?: Date;
};

export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  created_at?: Date;

  constructor(props: CreateUserInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.created_at = props.created_at;
  }

  static validate(input: CreateUserInput) {
    return validateSync(input);
  }
}
