import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$ = new BehaviorSubject<boolean>(false);

  setLoading(isLoading: boolean) {
    this.loading$.next(isLoading);
  }
}
//  @Component({
//   selector: 'load',
//    template: `>


//  `,
//    styles: ``,
//  })
// export class loadElement implements OnInit {
// ngOnInit(): void {
//      throw new Error('Method not implemented.');
//    }
//  }