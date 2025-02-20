import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.dto';
import { SignUpInput, SignInInput } from './dto/auth.input';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(@Args('data') data: SignUpInput): Promise<User> {
    return this.authService.signUp(data.name, data.email, data.password);
  }

  @Mutation(() => AuthResponse)
  async signIn(@Args('data') data: SignInInput): Promise<AuthResponse> {
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }

  // ✅ Protected Route - Get Current User
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@Context() context: { req: { user: User } }): User {
    return context.req.user;
  }
}
