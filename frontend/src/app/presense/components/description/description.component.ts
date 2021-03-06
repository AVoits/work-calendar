import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TaskApiService } from '../../../core/services/task-api.service';
import { ContextStoreService } from '../../../core/store/context-store.service';
import { TasksStoreService } from '../../../core/store/tasks-store.service';
import { AgendaColors } from '../../../shared/const/agenda-colors.const';
import { AgendaColorsModel } from '../../../shared/models/agenda-colors.model';
import { Employee } from '../../../shared/models/employee.model';
import { TaskModel } from '../../../shared/models/tasks.models';
import { PrintHelperService } from '../../../shared/services/print-helper.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TaskMapperService } from '../../../shared/services/task-mapper.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  @Input() selectedUser: Employee;
  @Input() tasks: TaskModel[];

  @Output() onAddTask = new EventEmitter<TaskModel>();

  public form: FormGroup;
  public options: AgendaColorsModel[];
  private getCurrentDateSub = new Subscription();
  private getDayTypeSub = new Subscription();
  private getCommentSub = new Subscription();

  constructor(
    private snackbar: SnackbarService,
    private contextStoreService: ContextStoreService,
    private taskApiService: TaskApiService,
    private fb: FormBuilder,
    private taskMapperService: TaskMapperService,
    private printHelperService: PrintHelperService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initForm();
    this.getInfoFromStore();
    this.options = AgendaColors;
  }

  private initForm(): void {
    this.form = this.fb.group({
      dateStart: [null, Validators.required],
      dateEnd: [null],
      type: [null, Validators.required],
      comment: [null]
    });
  }

  public addTask(): void {
    if (this.form.invalid) {
      alert('Заполните форму');
      return;
    }
    const val = this.form.getRawValue();
    const taskFormVal: TaskModel = {
      type: val.type.id,
      dateStart: moment(val.dateStart),
      dateEnd: val.dateEnd ? moment(val.dateEnd) : moment(val.dateStart),
      employee: this.selectedUser.mailNickname,
      comment: val.comment,
      dtCreated: moment(),
      employeeCreated: this.contextStoreService.getCurrentUser().mailNickname
    };
    const mappedForm = this.taskMapperService.mapToSendingModel(taskFormVal);

    this.taskApiService.addTask(mappedForm).subscribe(() => {
      this.snackbar.showSuccessSnackBar('Событие добавлено');
      this.onAddTask.emit(taskFormVal);
    });

  }

  public printStatement(): void {
    const formValue = this.form.getRawValue();
    const originalTasks = this.tasks;
    let dateStart = formValue.dateStart;
    let dateEnd = formValue.dateEnd;

    const currentTask = originalTasks
      .filter(
        task =>
          task.employee === this.selectedUser.mailNickname &&
          moment(dateStart).isBetween(moment(task.dateStart), moment(task.dateEnd), null, '[]')
      )
      .sort((a, b) => (moment(a.dtCreated).isAfter(b.dtCreated) ? -1 : 1))[0];

    dateEnd = currentTask.dateEnd;
    dateStart = currentTask.dateStart;

    this.http.get('assets/html/print-vacation.html', { responseType: 'text' }).subscribe((html: string) => {
      this.printHelperService.printStatement(html, this.selectedUser.username, dateStart, dateEnd);
    });
  }

  public resetComment(): void {
    this.form.get('comment').setValue(null, { emitEvent: false });
  }

  private getInfoFromStore(): void {
    this.getCurrentDateSub.add(
      this.contextStoreService
        .getCurrentDate$()
        .pipe(filter(i => !!i))
        .subscribe(res => {
          this.form.get('dateStart').setValue(res.toDate(), { emitEvent: false });
          this.form.get('dateEnd').setValue(null, { emitEvent: false });
        })
    );

    this.getDayTypeSub.add(
      this.contextStoreService
        .getDayType$()
        .pipe(filter(i => !!i))
        .subscribe(res => {
          const agenda = AgendaColors.find(o => o.id === res);
          this.form.get('type').setValue(agenda, { emitEvent: false });
        })
    );

    this.getCommentSub.add(
      this.contextStoreService.getComment$().subscribe(res => {
        this.form.get('comment').setValue(res, { emitEvent: false });
      })
    );
  }
}
