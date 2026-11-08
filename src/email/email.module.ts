import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VerificacaoEmailService } from './verificacao-email.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [VerificacaoEmailService],
  exports: [VerificacaoEmailService],
})
export class EmailModule {}