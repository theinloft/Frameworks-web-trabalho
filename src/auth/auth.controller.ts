import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.senha);
  }
}
