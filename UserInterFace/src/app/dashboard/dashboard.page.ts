import { Component, inject, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ServerDto } from 'src/Types/interfaces/Server.dto';
import { DialogComponent } from '../dialog/dialog.component';
import { InitializingServerComponent } from '../initializing-server/initializing-server.component';
import { DataService } from '../services/data-service.service';
import { GroupDto } from 'src/Types/interfaces/Group.dto';
import { UserDto } from 'src/Types/interfaces/User.dto';
import { LoadingService } from '../services/loading-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public userData!: UserDto;
  groupLoading: boolean = false;
  constructor(
    private modalController: ModalController,
    private backendService: DataService,
    public loadingService: LoadingService,
    private alertController: AlertController
  ) {}
  async ngOnInit() {
    this.groupLoading = true;
    this.userData = await this.backendService.getData('getServers');
    this.groupLoading = false;
  }
  async showDialogForGroup(group?: GroupDto) {
    if (!group) {
      group = { id: '', name: '', isInit: false };
    }
    const modal = await this.modalController.create({
      component: DialogComponent,
      componentProps: {
        component: InitializingServerComponent,
        componentInputs: { isGroup: true, group: group },
      },
    });
    await modal.present();
    modal.onDidDismiss().then((data) => {
      this.userData = data.data;
    });
  }
  async showDialogForServer(server?: ServerDto, groups?: GroupDto[]) {
    const modal = await this.modalController.create({
      component: DialogComponent,
      componentProps: {
        component: InitializingServerComponent,
        componentInputs: { isGroup: false, server: server, groups: groups },
      },
    });
    await modal.present();
  }
  async showDialogForServerWithKnownGroup(group: GroupDto, groups: GroupDto[]) {
    let server: ServerDto = { Group: group };
    const modal = await this.modalController.create({
      component: DialogComponent,
      componentProps: {
        component: InitializingServerComponent,
        componentInputs: { isGroup: false, server: server, groups: groups },
      },
    });

    await modal.present();
  }
  async showAlertForDelete(group: GroupDto) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to delete this group?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteGroup(group);
          },
          role: 'Yes',
        },
        { text: 'No', role: 'No' },
      ],
    });
    await alert.present();
  }
  async deleteGroup(group: GroupDto) {
    if (group.isInit) {
      const alert = await this.alertController.create({
        header: 'single servers cannot be deleted',
        message: 'single servers cannot be deleted.',
        buttons: ['Ok'],
      });

      await alert.present();
    }
    this.userData = await this.backendService.deleteData(
      'deleteGroup/' + group.id
    );
    console.log(this.userData);
  }
}
