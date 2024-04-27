import { Component, Injectable, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingCtrl: LoadingController) {}
  async openLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner:'crescent',
      });

    loading.present();
  }
  async closeLoading() {
    const loading = await this.loadingCtrl.getTop();
    if (loading) {
      loading.dismiss();
    }
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
