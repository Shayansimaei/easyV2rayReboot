import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { AuthorizationService } from './services/authorization.service';
import { LoadingService } from './services/loading-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public menu={
    isOpen:false
  }
  @ViewChild('menu')
  ionMenu!:IonMenu;
  isLoading:boolean=false;
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private auth:AuthorizationService) {}
  
  public async isOpen(e:any):Promise<void>{
    console.log(e);
    
  }
  async ngAfterViewInit(){
    await this.ionMenu.close()
    
  }
  signOut():void{
    this.ionMenu.close();
    this.auth.Logout();
  }
}
