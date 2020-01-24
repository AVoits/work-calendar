import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeePlace } from '../../office/places/places.component';

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  constructor(private http: HttpClient) {
  }
  public getPlaces(): Observable<EmployeePlace[]> {
    return this.http.get<EmployeePlace[]>(`${environment.baseUrl}/places`);
  }

  public addPlace(place: EmployeePlace): Observable<EmployeePlace> {
    return this.http.post<EmployeePlace>(`${environment.baseUrl}/places`, place);
  }
}
