import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@core/user/domain/user.aggregate';
import { IUserRepository } from '@core/user/domain/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: IUserRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.validatePassword(user, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, name: user.name };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    return user.validatePassword(password);
  }
}
