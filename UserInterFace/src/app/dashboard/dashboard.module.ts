import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard.routing.module';

import { DashboardPage } from './dashboard.page';
import { HeaderComponent } from '../header/header.component';
import { NgxTolgeeModule } from '@tolgee/ngx';
import { DialogComponent } from '../dialog/dialog.component';
import { InitializingServerComponent } from '../initializing-server/initializing-server.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    NgxTolgeeModule,
    
  ],
  declarations: [DashboardPage,HeaderComponent,DialogComponent,InitializingServerComponent],
  
  
})
export class FolderPageModule {}
