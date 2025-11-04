import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, BadRequestException } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
// Prisma types are handled in the service; controller uses DTOs
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('portafolio')
@Controller('portafolio')
export class PortafolioController {
  constructor(private readonly portafolioService: PortafolioService) {}

  @Post()
  create(@Body() data: CreatePortafolioDto) {
    return this.portafolioService.create(data);
  }

  @Get()
  findAll() {
    return this.portafolioService.findAll();
  }

  @Get(':codigo_hptu')
  findOne(@Param('codigo_hptu') codigo_hptu: string) {
    return this.portafolioService.findOne(codigo_hptu);
  }

  @Put(':codigo_hptu')
  update(
    @Param('codigo_hptu') codigo_hptu: string,
    @Body() data: UpdatePortafolioDto,
  ) {
    return this.portafolioService.update(codigo_hptu, data);
  }

  @Delete(':codigo_hptu')
  remove(@Param('codigo_hptu') codigo_hptu: string) {
    return this.portafolioService.remove(codigo_hptu);
  }

  @Get('grupo/:grupo_concepto')
  findByGrupoConcepto(@Param('grupo_concepto') grupo_concepto: string) {
    return this.portafolioService.findByGrupoConcepto(grupo_concepto);
  }

  @ApiOperation({ summary: 'Actualizar tarifa de un registro' })
  @ApiQuery({ name: 'mode', required: true, description: 'percentage | fixed | overwrite' })
  @ApiQuery({ name: 'value', required: true, description: 'numeric value (percentage without % sign)' })
  @Patch(':codigo_hptu/tarifa')
  updateTarifa(
    @Param('codigo_hptu') codigo_hptu: string,
    @Query('mode') mode?: string,
    @Query('value') value?: string,
  ) {
    /**
     * mode: percentage | fixed | overwrite
     * value: numeric value (for percentage use 10 for +10%)
     */
    
    const parsedMode = this.parseTarifaMode(mode);
    const numericValue = this.parseTarifaValue(value);
    return this.portafolioService.updateTarifa(codigo_hptu, parsedMode, numericValue);
  }

  @ApiOperation({ summary: 'Actualizar tarifa por grupo de concepto' })
  @ApiQuery({ name: 'mode', required: true, description: 'percentage | fixed | overwrite' })
  @ApiQuery({ name: 'value', required: true, description: 'numeric value (percentage without % sign)' })
  @Patch('grupo/:grupo_concepto/tarifa')
  updateTarifaByGrupo(
    @Param('grupo_concepto') grupo_concepto: string,
    @Query('mode') mode?: string,
    @Query('value') value?: string,
  ) {
    
    const parsedMode = this.parseTarifaMode(mode);
    const numericValue = this.parseTarifaValue(value);
    return this.portafolioService.bulkUpdateTarifaByGrupo(grupo_concepto, parsedMode, numericValue);
  }

  private parseTarifaMode(mode?: string): 'percentage' | 'fixed' | 'overwrite' {
    if (mode === 'percentage' || mode === 'fixed' || mode === 'overwrite') {
      return mode;
    }
    throw new BadRequestException('Modo inválido. Usa: percentage | fixed | overwrite');
  }

  private parseTarifaValue(value?: string): number {
    if (value === undefined || value === null || value.trim() === '') {
      throw new BadRequestException('El valor es obligatorio');
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      throw new BadRequestException('El valor debe ser numérico');
    }

    return numericValue;
  }
}
 