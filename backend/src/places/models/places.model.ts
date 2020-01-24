import { ApiModelProperty } from '@nestjs/swagger';

export class PlacesModel {
  @ApiModelProperty()
  user: string;
  @ApiModelProperty()
  floor: string;
  @ApiModelProperty()
  place: number;
}
