import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EmployeeApiService } from '../../../core/services/employee-api.service';
import { ContextStoreService } from '../../../core/store/context-store.service';
import { Employee } from '../../../shared/models/employee.model';
import { TaskModel } from '../../../shared/models/tasks.models';
import { HolidaysModel } from '../../../shared/models/holidays.model';
import { HolidaysApiService } from '../../../core/services/holidays-api.service';
import { TaskApiService } from '../../../core/services/task-api.service';
import { TaskMapperService } from '../../../shared/services/task-mapper.service';

@Component({
  selector: 'app-presence',
  templateUrl: './presence-page.component.html',
  styleUrls: ['./presence-page.component.scss']
})
export class PresencePageComponent implements OnInit, OnDestroy {
  public selectedUser: Employee;
  public holidays$: Observable<HolidaysModel[]>;
  private getCurrentUserSub = new Subscription();
  public tasks$ = new BehaviorSubject<TaskModel[]>([]);

  constructor(
    private route: ActivatedRoute,
    private contextStoreService: ContextStoreService,
    private tasksApi: TaskApiService,
    private tasksMapper: TaskMapperService,
    private employeeApiService: EmployeeApiService,
    private holidaysService: HolidaysApiService
  ) {
  }

  ngOnInit() {
    this.checkRoute();
    this.holidays$ = this.holidaysService.getAllHolidays();
  }

  ngOnDestroy() {
    this.getCurrentUserSub.unsubscribe();
  }

  public onAddTask(e: TaskModel) {
    this.tasks$.next([...this.tasks$.value, e]);
  }

  private checkRoute(): void {
    this.getCurrentUserSub.add(
      this.route.params.pipe(
        switchMap(params => this.getUserByIdOrCurrent(params.id)),
        tap((res) => this.selectedUser = res),
        switchMap((res) => this.tasksApi.loadAllTasksByEmployee(res.mailNickname)),
        map(task => this.tasksMapper.mapToTaskModel(task))
      ).subscribe(tasks => this.tasks$.next(tasks))
    );
  }

  private getUserByIdOrCurrent(id?: string): Observable<Employee> {
    if (id) {
      return this.employeeApiService.searchUserByLogin(id);
    }

    return this.contextStoreService.getCurrentUser$().pipe(filter((u) => !!u));
  }
}
