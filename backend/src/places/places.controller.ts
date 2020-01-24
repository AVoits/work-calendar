import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlacesService } from './services/places.service';
import { PlacesModel } from './models/places.model';

@ApiBearerAuth()
@ApiUseTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  async getPlaces(@Res() res) {
    const places = await this.placesService.getPlaces();
    return res.status(HttpStatus.OK).json(places);
  }

  @Post()
  async addPlace(@Res() res, @Body() place: PlacesModel) {
    const newPlace = await this.placesService.addPlace(place);
    return res.status(HttpStatus.OK).json(newPlace);
  }

}
