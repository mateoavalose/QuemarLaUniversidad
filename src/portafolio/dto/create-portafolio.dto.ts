import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePortafolioDto {
	@ApiProperty({ description: 'Código único HPTU', example: 'ABC-123' })
	@IsString()
	codigo_hptu!: string;

	@ApiPropertyOptional({ description: 'Grupo de concepto' })
	@IsOptional()
	@IsString()
	grupo_concepto?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del grupo de concepto' })
	@IsOptional()
	@IsString()
	descripcion_grupo_concepto?: string | null;

	@ApiPropertyOptional({ description: 'Concepto HPTU' })
	@IsOptional()
	@IsString()
	concepto_hptu?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del concepto' })
	@IsOptional()
	@IsString()
	descripcion_concepto?: string | null;

	@ApiPropertyOptional({ description: 'Código de reemplazo 2025' })
	@IsOptional()
	@IsString()
	codigo_reemplazo_cambios_ano_2025?: string | null;

	@ApiPropertyOptional({ description: 'Descripción HPTU' })
	@IsOptional()
	@IsString()
	descripcion_hptu?: string | null;

	@ApiPropertyOptional({ description: 'Tarifa 2025 (BO)', type: Number })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	tarifa_2025_bo?: number | null;

	@ApiPropertyOptional({ description: 'Grupo quirúrgico' })
	@IsOptional()
	@IsString()
	grupo_quirurgico?: string | null;

	@ApiPropertyOptional({ description: 'Código de conversión externo' })
	@IsOptional()
	@IsString()
	codigo_conversion_externo?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del manual externo' })
	@IsOptional()
	@IsString()
	descripcion_manual_externo?: string | null;

	@ApiPropertyOptional({ description: 'Código CUPS asociado' })
	@IsOptional()
	@IsString()
	codigo_cups_asociado?: string | null;

	@ApiPropertyOptional({ description: 'PBS / NO PBS' })
	@IsOptional()
	@IsString()
	pbs_no_pbs?: string | null;

	@ApiPropertyOptional({ description: 'Aseguradora', example: 'BO' })
	@IsOptional()
	@IsString()
	aseguradora?: string | null;

	@ApiPropertyOptional({ description: 'Código REPS (resolución 3100 de 2019)' })
	@IsOptional()
	@IsString()
	codigo_reps_resolucion_3100_2019?: string | null;

	@ApiPropertyOptional({ description: 'Observación a terceros' })
	@IsOptional()
	@IsString()
	observacion_a_terceros?: string | null;

	@ApiPropertyOptional({ description: 'Incluye' })
	@IsOptional()
	@IsString()
	incluye?: string | null;

	@ApiPropertyOptional({ description: 'Excluye' })
	@IsOptional()
	@IsString()
	excluye?: string | null;

	@ApiPropertyOptional({ description: 'Observaciones generales' })
	@IsOptional()
	@IsString()
	observaciones_generales?: string | null;
}
