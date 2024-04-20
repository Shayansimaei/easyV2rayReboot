import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServerDto } from 'src/Types/interfaces/Server.dto';
import { DialogComponent } from '../dialog/dialog.component';
import { InitializingServerComponent } from '../initializing-server/initializing-server.component';
import { DataService } from '../services/data-service.service';
import { GroupDto } from 'src/Types/interfaces/Group.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public groups:GroupDto[]=[];
  constructor(private modalController: ModalController,private backendService:DataService) {}
  async ngOnInit() {
    this.groups=await this.backendService.getData("getServers");
    console.log(this.groups);
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
