import { IsString, IsNotEmpty, IsInt, IsOptional, MaxLength, IsArray, IsBoolean } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  linea: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serie: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  modelo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  varVi: string; // Ej: "VAN0,ALT1"

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  codIvi: string; // Ej: "1001.1002"

  @IsInt()
  espVidrio: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  imagen?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  esquema?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  plano?: string;

  // Cloudinary IDs
  @IsString()
  @IsOptional()
  @MaxLength(200)
  imagenCloudinaryId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  esquemaCloudinaryId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  planoCloudinaryId?: string;

  @IsBoolean()
  @IsOptional()
  datosCompletos?: boolean;

  @IsArray()
  @IsOptional()
  variableIds?: string[]; // IDs de variables relacionadas

  @IsArray()
  @IsOptional()
  instruccionIds?: string[]; // IDs de instrucciones relacionadas
}
