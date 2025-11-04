import { Module } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { PortafolioController } from './portafolio.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PortafolioController],
  providers: [PortafolioService, PrismaService],
})
export class PortafolioModule {}
