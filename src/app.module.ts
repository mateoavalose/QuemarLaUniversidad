import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PortafolioModule } from './portafolio/portafolio.module';

@Module({
  imports: [PrismaModule, PortafolioModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
