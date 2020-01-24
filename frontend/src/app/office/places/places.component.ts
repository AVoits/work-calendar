import { Component, OnInit } from '@angular/core';
import { Employee } from '../../shared/models/employee.model';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContextStoreService } from '../../core/store/context-store.service';
import { EmployeeApiService } from '../../core/services/employee-api.service';
import { EmployeeStoreService } from '../../core/store/employee-store.service';
import { ActivatedRoute } from '@angular/router';
import { PlacesApiService } from '../../core/services/places-api.service';
import { HolidaysModel } from '../../shared/models/holidays.model';

export type Floors = 'first' | 'second';

export interface EmployeePlace {
  user: string;
  floorNumber: Floors;
  placeNumber: number;
}

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  public selectedUser: Employee;
  private login: string;
  public isAdmin$: Observable<boolean>;
  private getCurrentUserSub = new Subscription();
  private searchUserByLoginSub = new Subscription();

  public places: EmployeePlace[];
  public users: Employee[];

  public placesFirst = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  constructor(
    private contextStoreService: ContextStoreService,
    private employeeApiService: EmployeeApiService,
    private employeeStoreService: EmployeeStoreService,
    private route: ActivatedRoute,
    private placeService: PlacesApiService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.isAdmin$ = this.contextStoreService.isCurrentUserAdmin$();
  }


  private getUserFromApi() {
    this.searchUserByLoginSub.add(
      this.employeeApiService.searchUserByLogin(this.login).subscribe((user: Employee) => {
        this.setSelectedUser(user);
        this.loadPlaces();
        this.loadUsers();
      })
    );
  }

  private getUserFromStore() {
    this.getCurrentUserSub.add(
      this.contextStoreService
        .getCurrentUser$()
        .pipe(filter(user => !!user))
        .subscribe(user => {
          this.setSelectedUser(user);
          this.login = user.mailNickname;
          this.loadPlaces();
          this.loadUsers();
        })
    );
  }

  private getUserInfo(): void {
    this.login = this.route.snapshot.params.id;
    if (!this.login) {
      this.getUserFromStore();
    } else {
      this.getUserFromApi();
    }
  }

  private setSelectedUser(user: Employee): void {
    this.selectedUser = user;
  }

  public loadPlaces() {
    this.getCurrentUserSub.add(
      this.placeService.getPlaces().subscribe(res => {
        this.places = res;
      })
    );
  }

  public loadUsers() {
    this.getCurrentUserSub.add(
      this.employeeApiService.loadAllEmployees().subscribe(res => {
        this.users = res;
      })
    );
  }

  public isPlaceOff(place: number, floor: Floors): boolean {
    if (this.places) {
      return this.places.some(item => item.placeNumber === place && item.floorNumber === floor);
    }
  }

  public getUserName(place: number, floor: Floors): string {
    if (this.places && this.users) {
      const user = this.places.find(item => {
        return item.placeNumber === place && item.floorNumber === floor;
      });

      if (!user) {
        return 'Free!';
      }
      const employee = this.users.find(item => item._id.toString() === user.user.toString());
      return employee.username;
    }
  }


  public takePlace(myPlace: number, floor: Floors) {
    const place: EmployeePlace = {
      user: this.selectedUser._id,
      floorNumber: floor,
      placeNumber: myPlace
    };

    this.placeService.addPlace(place).subscribe(res => this.loadPlaces());
  }
}
