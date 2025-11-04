import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortafolioService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PortafolioCreateArgs['data']) {
    return this.prisma.portafolio.create({ data });
  }

  findAll() {
    return this.prisma.portafolio.findMany();
  }

  async findOne(codigoHPTU: string) {
    const record = await this.prisma.portafolio.findUnique({
      where: { codigoHPTU },
    });

    if (!record) {
      throw new NotFoundException(`Registro con código ${codigoHPTU} no encontrado`);
    }

    return record;
  }

  async update(codigoHPTU: string, data: Prisma.PortafolioUpdateArgs['data']) {
    try {
      return await this.prisma.portafolio.update({
        where: { codigoHPTU },
        data,
      });
    } catch (error) {
      this.handleMutationError(error, codigoHPTU);
    }
  }

  async remove(codigoHPTU: string) {
    try {
      return await this.prisma.portafolio.delete({
        where: { codigoHPTU },
      });
    } catch (error) {
      this.handleMutationError(error, codigoHPTU);
    }
  }

  async findByGrupoConcepto(grupoConcepto: string) {
    return this.prisma.portafolio.findMany({
      where: { grupoConcepto },
      select: {
        grupoConcepto: true,
        descripcionGrupoConcepto: true,
      },
    });
  }

  async updateTarifa(
    codigoHPTU: string,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ) {
    const record = await this.prisma.portafolio.findUnique({
      where: { codigoHPTU },
      select: { tarifa2025BO: true },
    });

    if (!record) throw new NotFoundException(`Registro con código ${codigoHPTU} no encontrado`);

    const newTarifa = this.calculateNewTarifa(record.tarifa2025BO, mode, value);

    return this.prisma.portafolio.update({
      where: { codigoHPTU },
      data: { tarifa2025BO: newTarifa },
    });
  }

  async bulkUpdateTarifaByGrupo(
    grupoConcepto: string,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ) {
    const records = await this.prisma.portafolio.findMany({
      where: { grupoConcepto },
      select: { codigoHPTU: true, tarifa2025BO: true },
    });

    if (!records.length) {
      throw new NotFoundException(`No se encontraron registros para el grupo ${grupoConcepto}`);
    }

    const updates = records.map((r) => {
      const newTarifa = this.calculateNewTarifa(r.tarifa2025BO, mode, value);

      return this.prisma.portafolio.update({
        where: { codigoHPTU: r.codigoHPTU },
        data: { tarifa2025BO: newTarifa },
      });
    });

    return this.prisma.$transaction(updates);
  }

  private calculateNewTarifa(
    current: Prisma.Decimal | null,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException('El valor debe ser numérico');
    }

    const currentValue = current ? Number(current) : 0;
    let newValue = currentValue;

    switch (mode) {
      case 'percentage':
        newValue = currentValue * (1 + value / 100);
        break;
      case 'fixed':
        newValue = currentValue + value;
        break;
      case 'overwrite':
        newValue = value;
        break;
      default:
        throw new BadRequestException('Modo inválido. Usa: percentage | fixed | overwrite');
    }

    return new Prisma.Decimal(newValue.toFixed(2));
  }

  private handleMutationError(error: unknown, codigoHPTU: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`Registro con código ${codigoHPTU} no encontrado`);
    }

    throw error;
  }
}
