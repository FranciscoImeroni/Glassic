import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { CreateValorFijoDto } from './dto/create-configuracion.dto';
import { UpdateValorFijoDto } from './dto/update-configuracion.dto';
import { CreateKitDto } from './dto/create-kit.dto';
import { UpdateKitDto } from './dto/update-kit.dto';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  // VALORES FIJOS ENDPOINTS
  @Post('valores-fijos')
  createValorFijo(@Body() createValorFijoDto: CreateValorFijoDto) {
    return this.configuracionService.createValorFijo(createValorFijoDto);
  }

  @Get('valores-fijos')
  findAllValoresFijos(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.configuracionService.findValoresFijosPaginated(pageNum, limitNum);
    }
    return this.configuracionService.findAllValoresFijos();
  }

  @Get('valores-fijos/:id')
  findOneValorFijo(@Param('id') id: string) {
    return this.configuracionService.findOneValorFijo(id);
  }

  @Patch('valores-fijos/:id')
  updateValorFijo(@Param('id') id: string, @Body() updateValorFijoDto: UpdateValorFijoDto) {
    return this.configuracionService.updateValorFijo(id, updateValorFijoDto);
  }

  @Delete('valores-fijos/:id')
  removeValorFijo(@Param('id') id: string) {
    return this.configuracionService.removeValorFijo(id);
  }

  // KITS ENDPOINTS
  @Post('kits')
  createKit(@Body() createKitDto: CreateKitDto) {
    return this.configuracionService.createKit(createKitDto);
  }

  @Get('kits')
  findAllKits(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.configuracionService.findKitsPaginated(pageNum, limitNum);
    }
    return this.configuracionService.findAllKits();
  }

  @Get('kits/:id')
  findOneKit(@Param('id') id: string) {
    return this.configuracionService.findOneKit(id);
  }

  @Patch('kits/:id')
  updateKit(@Param('id') id: string, @Body() updateKitDto: UpdateKitDto) {
    return this.configuracionService.updateKit(id, updateKitDto);
  }

  @Delete('kits/:id')
  removeKit(@Param('id') id: string) {
    return this.configuracionService.removeKit(id);
  }
}
