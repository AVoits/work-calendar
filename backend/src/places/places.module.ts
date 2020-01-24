import { Module } from '@nestjs/common';
import { EntityModule } from '../entity/entity.module';
import { PlacesController } from './places.controller';
import { PlacesService } from './services/places.service';

@Module({
  imports: [EntityModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {
}
