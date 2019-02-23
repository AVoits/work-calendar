import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from 'src/app/models/tasks.models';
import { DayType } from 'src/app/shared/const/day-type.const';
import { TasksStoreService } from 'src/app/store/tasks-store.service';

@Component({
  selector: 'app-description-table',
  templateUrl: './description-table.component.html',
  styleUrls: ['./description-table.component.scss']
})
export class DescriptionTableComponent implements OnInit {
  tasks$: Observable<TaskModel[]>;
  displayedColumns: string[];
  constructor(private tasksStoreService: TasksStoreService) {}

  ngOnInit() {
    this.displayedColumns = ['date', 'type'];
    this.tasks$ = this.tasksStoreService.getTasks$();
  }

  public getTitle(id: number): string {
    return DayType[id];
  }
}
