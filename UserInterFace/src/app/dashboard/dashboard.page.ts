import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ServerDto } from 'src/Types/interfaces/Server.dto';
import { DialogComponent } from '../dialog/dialog.component';
import { InitializingServerComponent } from '../initializing-server/initializing-server.component';
import { DataService } from '../services/data-service.service';
import { GroupDto } from 'src/Types/interfaces/Group.dto';
import { UserDto } from 'src/Types/interfaces/User.dto';
import { LoadingService } from '../services/loading-service.service';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit,OnDestroy {
  public userData!: UserDto|null;
  groupLoading: boolean = false;
  constructor(
    private modalController: ModalController,
    private backendService: DataService,
    public loadingService: LoadingService,
    private alertController: AlertController,
    private auth:AuthorizationService
  ) {}
  ngOnDestroy(): void {
    console.log('destroyed');
  }
  async ngOnInit() {
    this.auth.getEvent().subscribe(data => {
      if(data=="signOut"){
        this.userData = null;
      }
      else if(data=="ChangeUser")
        this.getData();
    });
  }
  async getData(){
    this.userData = await this.backendService.getData('getServers');
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
      if(data.role === 'save')	
      this.userData = data.data;
    });
  }
  async showDialogForServer(server?: ServerDto) {
    const modal = await this.modalController.create({
      component: DialogComponent,
      componentProps: {
        component: InitializingServerComponent,
        componentInputs: { isGroup: false, server:  {SSH_host:"38.180.86.210",SSH_port:22,SSH_user:"root",SSH_passphrase:"sss1378s"}, groups: this.userData?.groups },
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
