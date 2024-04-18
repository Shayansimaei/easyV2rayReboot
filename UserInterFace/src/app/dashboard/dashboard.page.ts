import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServerDto } from 'src/Types/interfaces/Server.dto';
import { DialogComponent } from '../dialog/dialog.component';
import { InitializingServerComponent } from '../initializing-server/initializing-server.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public servers:ServerDto[]=[
    {Name:"simple",Servers:[]},{Name:"group1",Servers:[{Name:"server 1"},{Name:"server 2"}]},{Name:"group2",Servers:[{Name:"server 1"},{Name:"server 2"}]}
  ];
  constructor(private modalController: ModalController) {}
  ngOnInit() {
  }
  async showDialog(isGroup: boolean, server?: ServerDto) {
    const modal = await this.modalController.create({
      component: DialogComponent,
      componentProps: {
        component: InitializingServerComponent,
        componentInputs: { isGroup: isGroup, server: {Name:"empty"} },
      },
    });
  
    await modal.present();
  }
}
