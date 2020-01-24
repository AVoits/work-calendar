import { Document } from 'mongoose';

export interface PlacesEntity extends Document {
  user: string;
  floorNumber: string;
  placeNumber: number;
}
