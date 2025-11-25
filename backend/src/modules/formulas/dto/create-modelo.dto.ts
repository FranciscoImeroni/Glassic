import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateModeloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @IsString()
  @IsOptional()
  hpf1?: string;

  @IsString()
  @IsOptional()
  hpf2?: string;

  @IsString()
  @IsOptional()
  hpue?: string;

  @IsString()
  @IsOptional()
  bpf1?: string;

  @IsString()
  @IsOptional()
  bpf2?: string;

  @IsString()
  @IsOptional()
  bpf3?: string;

  @IsString()
  @IsOptional()
  bpf4?: string;

  @IsString()
  @IsOptional()
  bpu1?: string;

  @IsString()
  @IsOptional()
  bp2?: string;

  @IsString()
  @IsOptional()
  debi?: string;

  @IsString()
  @IsOptional()
  htir?: string;

  @IsString()
  @IsOptional()
  ckit?: string;

  @IsString()
  @IsOptional()
  hkit?: string;
}