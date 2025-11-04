import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePortafolioDto {
	@ApiProperty({ description: 'Código único HPTU', example: 'ABC-123' })
	@IsString()
	codigoHPTU!: string;

	@ApiPropertyOptional({ description: 'Grupo de concepto' })
	@IsOptional()
	@IsString()
	grupoConcepto?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del grupo de concepto' })
	@IsOptional()
	@IsString()
	descripcionGrupoConcepto?: string | null;

	@ApiPropertyOptional({ description: 'Concepto HPTU' })
	@IsOptional()
	@IsString()
	conceptoHPTU?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del concepto' })
	@IsOptional()
	@IsString()
	descripcionConcepto?: string | null;

	@ApiPropertyOptional({ description: 'Código de reemplazo 2025' })
	@IsOptional()
	@IsString()
	codigoReemplazo2025?: string | null;

	@ApiPropertyOptional({ description: 'Descripción HPTU' })
	@IsOptional()
	@IsString()
	descripcionHPTU?: string | null;

	@ApiPropertyOptional({ description: 'Tarifa 2025 (BO)', type: Number })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	tarifa2025BO?: number | null;

	@ApiPropertyOptional({ description: 'Grupo quirúrgico' })
	@IsOptional()
	@IsString()
	grupoQuirurgico?: string | null;

	@ApiPropertyOptional({ description: 'Código de conversión externo' })
	@IsOptional()
	@IsString()
	codigoConversionExterno?: string | null;

	@ApiPropertyOptional({ description: 'Descripción del manual externo' })
	@IsOptional()
	@IsString()
	descripcionManualExterno?: string | null;

	@ApiPropertyOptional({ description: 'Código CUPS asociado' })
	@IsOptional()
	@IsString()
	codigoCupsAsociado?: string | null;

	@ApiPropertyOptional({ description: 'PBS / NO PBS' })
	@IsOptional()
	@IsString()
	pbsNoPbs?: string | null;

	@ApiPropertyOptional({ description: 'Aseguradora', example: 'BO' })
	@IsOptional()
	@IsString()
	aseguradora?: string | null;

	@ApiPropertyOptional({ description: 'Código REPS (resolución 3100 de 2019)' })
	@IsOptional()
	@IsString()
	codigoReps3100?: string | null;

	@ApiPropertyOptional({ description: 'Observación a terceros' })
	@IsOptional()
	@IsString()
	observacionATerceros?: string | null;

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
	observacionesGenerales?: string | null;
}
