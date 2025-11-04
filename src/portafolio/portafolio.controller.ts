import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, BadRequestException } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('portafolio')
@Controller('portafolio')
export class PortafolioController {
  constructor(private readonly portafolioService: PortafolioService) {}

  @Post()
  create(@Body() data: Prisma.PortafolioCreateArgs['data']) {
    return this.portafolioService.create(data);
  }

  @Get()
  findAll() {
    return this.portafolioService.findAll();
  }

  @Get(':codigoHPTU')
  findOne(@Param('codigoHPTU') codigoHPTU: string) {
    return this.portafolioService.findOne(codigoHPTU);
  }

  @Put(':codigoHPTU')
  update(
    @Param('codigoHPTU') codigoHPTU: string,
    @Body() data: Prisma.PortafolioUpdateArgs['data'],
  ) {
    return this.portafolioService.update(codigoHPTU, data);
  }

  @Delete(':codigoHPTU')
  remove(@Param('codigoHPTU') codigoHPTU: string) {
    return this.portafolioService.remove(codigoHPTU);
  }

  @Get('grupo/:grupoConcepto')
  findByGrupoConcepto(@Param('grupoConcepto') grupoConcepto: string) {
    return this.portafolioService.findByGrupoConcepto(grupoConcepto);
  }

  @ApiOperation({ summary: 'Actualizar tarifa de un registro' })
  @ApiQuery({ name: 'mode', required: true, description: 'percentage | fixed | overwrite' })
  @ApiQuery({ name: 'value', required: true, description: 'numeric value (percentage without % sign)' })
  @Patch(':codigoHPTU/tarifa')
  updateTarifa(
    @Param('codigoHPTU') codigoHPTU: string,
    @Query('mode') mode?: string,
    @Query('value') value?: string,
  ) {
    /**
     * mode: percentage | fixed | overwrite
     * value: numeric value (for percentage use 10 for +10%)
     */
    
    const parsedMode = this.parseTarifaMode(mode);
    const numericValue = this.parseTarifaValue(value);
    return this.portafolioService.updateTarifa(codigoHPTU, parsedMode, numericValue);
  }

  @ApiOperation({ summary: 'Actualizar tarifa por grupo de concepto' })
  @ApiQuery({ name: 'mode', required: true, description: 'percentage | fixed | overwrite' })
  @ApiQuery({ name: 'value', required: true, description: 'numeric value (percentage without % sign)' })
  @Patch('grupo/:grupoConcepto/tarifa')
  updateTarifaByGrupo(
    @Param('grupoConcepto') grupoConcepto: string,
    @Query('mode') mode?: string,
    @Query('value') value?: string,
  ) {
    
    const parsedMode = this.parseTarifaMode(mode);
    const numericValue = this.parseTarifaValue(value);
    return this.portafolioService.bulkUpdateTarifaByGrupo(grupoConcepto, parsedMode, numericValue);
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
