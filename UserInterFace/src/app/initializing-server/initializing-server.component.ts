import { Component, Input, OnInit } from '@angular/core';
import { AlertButton } from '@ionic/angular';
import { GroupDto } from 'src/Types/interfaces/Group.dto';
import { ServerDto } from 'src/Types/interfaces/Server.dto';

@Component({
  selector: 'app-initializing-server',
  templateUrl: './initializing-server.component.html',
  styleUrls: ['./initializing-server.component.scss'],
})
export class InitializingServerComponent implements OnInit {
  @Input() isGroup: boolean = false;
  @Input() server: ServerDto = {};
  @Input() groupName: string = '';
  @Input() groups: GroupDto[] =[];

  constructor() {}
  showAlert: boolean = false;
  alert: Alert = {
    isOpen: false,
    header: '',
    subHeader: '',
    message: '',
    buttons: [],
  };
  ngOnInit() {}
  fileToBuffer(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const reader = new FileReader();
    const maxSize = 1024;
    const allowedTypes = ['.pk', '.pubk', '.ppk', '.ppubk'];
    const removeFile = () => { fileInput.value = '';}
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
        this.server.SSH_privatekey = buffer;
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
}
type Alert = {
  isOpen: boolean;
  header: string;
  subHeader: string;
  message: string;
  buttons: AlertButton[];
};
