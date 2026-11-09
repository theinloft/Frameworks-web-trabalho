import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto, ReenviarVerificacaoDto, VerificarEmailDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { GoogleLoginDto } from './dto/google-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.senha);
  }

  @Post('verificar-email')
verificarEmail(@Body() body: VerificarEmailDto) {
  return this.authService.verificarEmail(body.token);
}

@Post('reenviar-verificacao')
@Throttle({ default: { ttl: 60000, limit: 3 } })
reenviar(@Body() body: ReenviarVerificacaoDto) {
  return this.authService.reenviarVerificacao(body.email);
}

@ApiOperation({ summary: 'Login com Google' })
@Post('google')
@Throttle({ default: { ttl: 60000, limit: 10 } })
google(@Body() body: GoogleLoginDto) {
  return this.authService.loginGoogle(body.credential);
}
}
