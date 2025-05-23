import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {IonMenu } from '@ionic/angular';
import { AuthorizationService } from './services/authorization.service';
import { Subscription } from 'rxjs';
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
  userImage:string="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
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
  private userSubscription: Subscription | null = null;

  public async isOpen(e:any):Promise<void>{
    console.log(e);
  }

  async ngAfterViewInit(){
    this.ionMenu.swipeGesture=false;
    this.userSubscription = this.auth.user$.subscribe(user => {
      this.userImage = user?.photoURL || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
    });   
    await this.ionMenu.close();
  }

  signOut():void{
    this.ionMenu.close();
    this.auth.Logout();
    
  }
  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
