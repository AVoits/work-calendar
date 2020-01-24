import { Schema } from 'mongoose';

export const PlacesSchema = new Schema({
  user: String,
  floorNumber: String,
  placeNumber: Number,
});
