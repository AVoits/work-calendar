import { Component, OnInit } from '@angular/core';
import { LocationEnum } from '../../models/location.enum';
import { locationsDictionary } from '../../const/locations-dictionary.const';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-time-zones',
  templateUrl: './time-zones.component.html',
  styleUrls: ['./time-zones.component.scss']
})
export class TimeZonesComponent implements OnInit {
  public location = locationsDictionary;

  public locationTimeZone = {
    [LocationEnum.kemerovo]: moment.tz('Asia/Krasnoyarsk').format('HH:mm:ss'),
    [LocationEnum.krasnodar]: moment.tz('Europe/Moscow').format('HH:mm:ss'),
    [LocationEnum.moscow]: moment.tz('Europe/Moscow').format('HH:mm:ss'),
    [LocationEnum.samara]: moment.tz('Europe/Samara').format('HH:mm:ss'),
    [LocationEnum.saratov]: moment.tz('Europe/Saratov').format('HH:mm:ss'),
    [LocationEnum.tyumen]: moment.tz('Europe/Moscow').format('HH:mm:ss')
  };

  constructor() {
  }

  ngOnInit() {
  }

}
