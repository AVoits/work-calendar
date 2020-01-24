import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlacesEntity } from '../../entity/entities/places.entity.model';
import { PlacesModel } from '../models/places.model';

@Injectable()
export class PlacesService {
  constructor(@InjectModel('Places') private readonly placeModel: Model<PlacesEntity>) {}

  async getPlaces(): Promise<PlacesEntity[]> {
    return await this.placeModel.find().exec();
  }

  async addPlace(place: PlacesModel): Promise<PlacesEntity> {
    const newPlace = await this.placeModel.create(place);
    return newPlace.save();
  }
}
