import { Component, Input, OnInit } from '@angular/core';
import { AlertButton, ModalController } from '@ionic/angular';
import { ServerDto } from 'src/Types/interfaces/Server.dto';
import { DataService } from '../services/data-service.service';
import { UserDto } from 'src/Types/interfaces/User.dto';
import { GroupDto } from 'src/Types/interfaces/Group.dto';

@Component({
  selector: 'app-initializing-server',
  templateUrl: './initializing-server.component.html',
  styleUrls: ['./initializing-server.component.scss'],
})
export class InitializingServerComponent implements OnInit {
  @Input() isGroup: boolean = false;
  @Input() server: ServerDto = {
    ssh_host: '38.180.86.210',
    ssh_user: 'root',
    ssh_passphrase: 'sss1378s',
  };
  @Input() group: GroupDto = { id: '', name: '', isInit: false };
  @Input() groups: GroupDto[] = [];
  constructor(
    private backendService: DataService,
    private modalController: ModalController
  ) {}
  showAlert: boolean = false;
  actionButtonName: string = '';
  alert: Alert = {
    isOpen: false,
    header: '',
    subHeader: '',
    message: '',
    buttons: [],
  };
  ngOnInit() {
    this.actionButtonName = this.isGroup
      ? this.group.id && this.group.id.length
        ? 'Edit group'
        : 'Add group'
      : 'Add server';
    this.server = { ...this.server };
    this.group = { ...this.group };
    if (!this.server.group?.id.length && this.groups.length > 0) {
      this.groups.forEach((group) => {if(group.isInit)this.server.group = group});
    }
  }
  fileToBuffer(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const reader = new FileReader();
    const maxSize = 1024;
    const allowedTypes = ['.pk', '.pubk', '.ppk', '.ppubk'];
    const removeFile = () => {
      fileInput.value = '';
    };
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        this.setAlert(
          true,
          'Error',
          'File is too large.',
          'File is too large.',
          [
            {
              text: 'OK',
              handler: () => {
                this.alert.isOpen = false;
              },
            },
          ]
        );
        removeFile();
        return false;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type.');
        this.setAlert(
          true,
          'Invalid file type',
          'Invalid file type',
          'Invalid file type',
          [
            {
              text: 'OK',
              handler: () => {
                this.alert.isOpen = false;
              },
            },
          ]
        );
        removeFile();
        return false;
      }
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        this.server.ssh_privatekey = buffer;
        return true;
      };

      reader.onerror = (error) => {
        this.setAlert(
          true,
          'Error reading file:',
          'Error reading file:',
          'Error reading file:',
          [
            {
              text: 'OK',
              handler: () => {
                this.alert.isOpen = false;
              },
            },
          ]
        );
        removeFile();
        return false;
      };
    }
    this.setAlert(
      true,
      'Error reading file:',
      'Error reading file:',
      'Error reading file:',
      [
        {
          text: 'OK',
          handler: () => {
            this.alert.isOpen = false;
          },
        },
      ]
    );
    removeFile();
    return false;
  }
  setAlert(
    isOpen: boolean,
    header?: string,
    subHeader?: string,
    message?: string,
    buttons?: AlertButton[]
  ) {
    this.alert = {
      isOpen: isOpen,
      header: header || '',
      subHeader: subHeader || '',
      message: message || '',
      buttons: buttons || [],
    };
  }
  changeGroup(event: any) {
    this.server.group = this.groups.find(
      (group) => group.id == event.detail.value
    );
  }
  async saveGroup() {
    let outData: UserDto;

    if (this.group.name && this.group.name.length < 2) {
      this.setAlert(
        true,
        'Error',
        'group name is short',
        'name must be more than 3 characters',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else if (this.group.name && this.group.name.length > 15) {
      this.setAlert(
        true,
        'Error',
        'group name is too long',
        'name must be more than less than 15 characters',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else {
      outData = await this.backendService.postData(
        !this.group.id.length ? 'addgroup' : 'editgroup',
        this.group
      );

      await this.modalController.dismiss(outData, 'save');
    }
  }
  async saveServer() {
    let outData: UserDto;

    if (
      this.server.name === undefined ||
      this.server.name === '' ||
      this.server.name.length < 2
    ) {
      this.setAlert(
        true,
        'Error',
        'Server name is short',
        'name must be more than 3 characters',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else if (this.server.name != undefined && this.server.name.length > 15) {
      this.setAlert(
        true,
        'Error',
        'Server name is too long',
        'name must be more than less than 15 characters',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else if (
      this.server.ssh_user == undefined ||
      this.server.ssh_user === ''
    ) {
      this.setAlert(
        true,
        'Error',
        'Server user essential',
        'user is essential',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else if (this.server.ssh_port == undefined || !this.server.ssh_port) {
      this.setAlert(
        true,
        'Error',
        'Server port essential',
        'port is essential',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else if (
      this.server.ssh_passphrase === '' &&
      this.server.ssh_privatekey == undefined
    ) {
      this.setAlert(
        true,
        'Error',
        'at least one of the private key or passphrase is needed',
        'insert private key or passphrase',
        [
          {
            text: 'OK',
            handler: () => {
              this.alert.isOpen = false;
            },
          },
        ]
      );
      return;
    } else {
      outData = await this.backendService.postData('addServer', this.server);
      console.log(outData);

      await this.modalController.dismiss(outData, 'save');
    }
  }
}
type Alert = {
  isOpen: boolean;
  header: string;
  subHeader: string;
  message: string;
  buttons: AlertButton[];
};
