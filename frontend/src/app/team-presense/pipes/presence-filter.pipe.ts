import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { PresenceModel } from '../../shared/models/presence.page.model';
import { PresenceFiltersFormModel } from '../models/presence-filters-form.model';

@Pipe({
  name: 'presenceFilter'
})
export class PresenceFilterPipe implements PipeTransform {
  transform(value: PresenceModel[], filter: PresenceFiltersFormModel, date: Moment): PresenceModel[] {
    if (!value) {
      return [];
    }

    if (!filter) {
      return value;
    }

    let res: PresenceModel[] = [...value];

    if (filter.name) {
      res = res.filter(
        i => i.employee.username && i.employee.username.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.location) {
      res = res.filter(
        i => i.employee.location && i.employee.location.toLowerCase() === filter.location.toLocaleLowerCase()
      );
    }

    if (filter.jobPosition) {
      res = res.filter(i => i.employee.jobPosition && i.employee.jobPosition.name === filter.jobPosition);
    }

    if (filter.subdivision) {
      res = res.filter(i => i.employee.subdivision && i.employee.subdivision.name === filter.subdivision);
    }

    if (filter.project) {
      const monthStart = date.clone().startOf('month');
      const monthEnd = date.clone().endOf('month');

      res = res.filter(i => {
        if (!i.employee.projects) {
          return false;
        }

        const selectedProjects = i.employee.projects.filter(p => p.project === filter.project);
        if (!selectedProjects.length) {
          return false;
        }

        return selectedProjects.some(p => {
          if (p.dateStart && p.dateEnd) {
            return (
              moment(p.dateStart).isBetween(monthStart, monthEnd) || moment(p.dateEnd).isBetween(monthStart, monthEnd)
            );
          }

          if (p.dateStart) {
            return monthEnd.isSameOrAfter(p.dateStart);
          }

          if (p.dateEnd) {
            return monthStart.isSameOrBefore(p.dateEnd);
          }

          return true;
        });
      });
    }

    return res;
  }
}
