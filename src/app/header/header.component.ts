import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContextStoreService } from '../store/context-store.service';
import { AppRoutingModule } from './../app-routing.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<string>;

  constructor(private router: Router, private contextStoreService: ContextStoreService) {}

  ngOnInit() {
    this.currentUser$ = this.contextStoreService.getCurrentUser();
  }

  onSwipe(evt) {
    const toRight = Math.abs(evt.deltaX) > 40 && evt.deltaX > 0;
    const increment = toRight === true ? -1 : 1;

    const nextRoute = AppRoutingModule.getNext(this.router, increment);
    this.router.navigate([nextRoute]);
  }
}
