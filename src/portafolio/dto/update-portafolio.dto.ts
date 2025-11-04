import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePortafolioDto } from './create-portafolio.dto';

export class UpdatePortafolioDto extends PartialType(OmitType(CreatePortafolioDto, ['codigo_hptu'] as const)) {}
