import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';

@Injectable()
export class PortafolioService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePortafolioDto) {
    // Convert tarifa_2025_bo (number) to BigInt if provided since schema uses BigInt
    const payload: any = { ...data };
    if (payload.tarifa_2025_bo !== undefined && payload.tarifa_2025_bo !== null && payload.tarifa_2025_bo !== '') {
      payload.tarifa_2025_bo = BigInt(Math.round(Number(payload.tarifa_2025_bo)));
    }

    const created = await this.prisma.portafolio.create({ data: payload as any });
    return this.normalizeRecord(created);
  }

  async findAll() {
    const rows = await this.prisma.portafolio.findMany();
    return rows.map((r) => this.normalizeRecord(r));
  }

  async findOne(codigo_hptu: string) {
    const record = await this.prisma.portafolio.findUnique({
      where: { codigo_hptu: codigo_hptu },
    });

    if (!record) {
      throw new NotFoundException(`Registro con código ${codigo_hptu} no encontrado`);
    }

    return this.normalizeRecord(record);
  }

  async update(codigo_hptu: string, data: UpdatePortafolioDto) {
    try {
      const payload: any = { ...data };
      if (payload.tarifa_2025_bo !== undefined && payload.tarifa_2025_bo !== null && payload.tarifa_2025_bo !== '') {
        payload.tarifa_2025_bo = BigInt(Math.round(Number(payload.tarifa_2025_bo)));
      }

      const updated = await this.prisma.portafolio.update({
        where: { codigo_hptu: codigo_hptu },
        data: payload as any,
      });

      return this.normalizeRecord(updated);
    } catch (error) {
      this.handleMutationError(error, codigo_hptu);
    }
  }

  async remove(codigo_hptu: string) {
    try {
      const deleted = await this.prisma.portafolio.delete({
        where: { codigo_hptu: codigo_hptu },
      });

      return this.normalizeRecord(deleted);
    } catch (error) {
      this.handleMutationError(error, codigo_hptu);
    }
  }

  async findByGrupoConcepto(grupo_concepto: string) {
    const rows = await this.prisma.portafolio.findMany({
      where: { grupo_concepto: grupo_concepto },
    });

    return rows.map((r) => this.normalizeRecord(r));
  }

  async updateTarifa(
    codigo_hptu: string,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ) {
    const record = await this.prisma.portafolio.findUnique({
      where: { codigo_hptu: codigo_hptu },
      select: { tarifa_2025_bo: true },
    });

    if (!record) throw new NotFoundException(`Registro con código ${codigo_hptu} no encontrado`);

    const newTarifa = this.calculateNewTarifa(record.tarifa_2025_bo, mode, value);

    const updated = await this.prisma.portafolio.update({
      where: { codigo_hptu: codigo_hptu },
      data: { tarifa_2025_bo: newTarifa },
    });

    return this.normalizeRecord(updated);
  }

  async bulkUpdateTarifaByGrupo(
    grupo_concepto: string,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ) {
    const records = await this.prisma.portafolio.findMany({
      where: { grupo_concepto: grupo_concepto },
      select: { codigo_hptu: true, tarifa_2025_bo: true },
    });

    if (!records.length) {
      throw new NotFoundException(`No se encontraron registros para el grupo ${grupo_concepto}`);
    }

    const updates = records.map((r) => {
      const newTarifa = this.calculateNewTarifa(r.tarifa_2025_bo, mode, value);

      return this.prisma.portafolio.update({
        where: { codigo_hptu: r.codigo_hptu },
        data: { tarifa_2025_bo: newTarifa },
      });
    });

    const results = await this.prisma.$transaction(updates);
    return results.map((r) => this.normalizeRecord(r));
  }

  private calculateNewTarifa(
    current: number | bigint | Prisma.Decimal | null,
    mode: 'percentage' | 'fixed' | 'overwrite',
    value: number,
  ): bigint | null {
    if (!Number.isFinite(value)) {
      throw new BadRequestException('El valor debe ser numérico');
    }

    const currentValue = current == null ? 0 : Number(current);
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

    // Store as BigInt in DB (rounded to nearest integer). If you need cents, consider storing cents explicitly.
    return BigInt(Math.round(newValue));
  }

  private handleMutationError(error: unknown, codigoHPTU: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`Registro con código ${codigoHPTU} no encontrado`);
    }

    throw error;
  }

  // Convert DB types that aren't JSON-serializable (BigInt) into JSON-friendly values.
  // Currently converts `tarifa_2025_bo` BigInt -> number (or null).
  private normalizeRecord<T extends Record<string, any> | null>(rec: T): T {
    if (!rec) return rec;
    const out: any = { ...rec };
    if ('tarifa_2025_bo' in out) {
      const v = out.tarifa_2025_bo;
      if (typeof v === 'bigint') out.tarifa_2025_bo = Number(v);
      else if (v === null) out.tarifa_2025_bo = null;
    }
    return out;
  }
}
